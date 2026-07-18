import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { BLOOD_TYPES } from "./Donor.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["donor", "hospital"],
      required: true,
    },
    bloodType: {
      type: String,
      enum: BLOOD_TYPES,
      required: function requiredBloodType() {
        return this.role === "donor";
      },
    },
    hospitalName: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    aadhaarNumber: {
      type: String,
      trim: true,
      select: false,
      sparse: true,
      unique: true,
      validate: {
        validator(value) {
          return !value || /^\d{12}$/.test(value);
        },
        message: "Aadhaar number must be 12 digits",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    bloodType: this.bloodType,
    hospitalName: this.hospitalName,
    phone: this.phone,
  };
};

export const User = mongoose.model("User", userSchema);
