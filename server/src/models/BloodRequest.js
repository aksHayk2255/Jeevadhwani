import mongoose from "mongoose";
import { BLOOD_TYPES } from "./Donor.js";

const bloodRequestSchema = new mongoose.Schema(
  {
    donorPublicId: {
      type: String,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: BLOOD_TYPES,
    },
    requesterName: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    requesterRole: {
      type: String,
      enum: ["patient", "hospital", "donor"],
      default: "patient",
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "fulfilled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);
