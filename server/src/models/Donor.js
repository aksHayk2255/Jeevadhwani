import mongoose from "mongoose";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

const donorSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: BLOOD_TYPES,
    },
    distanceKm: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["donor", "hospital"],
      default: "donor",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      lat: { type: Number, default: 10.0159 },
      lng: { type: Number, default: 76.3419 },
    },
  },
  { timestamps: true }
);

donorSchema.methods.toPublic = function toPublic() {
  return {
    id: this.publicId,
    name: this.name,
    bloodType: this.bloodType,
    distanceKm: this.distanceKm,
    distance: `${this.distanceKm.toFixed(1)} km away`,
    available: this.available,
  };
};

export const Donor = mongoose.model("Donor", donorSchema);
export { BLOOD_TYPES };
