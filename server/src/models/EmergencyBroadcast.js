import mongoose from "mongoose";
import { BLOOD_TYPES } from "./Donor.js";

const emergencyBroadcastSchema = new mongoose.Schema(
  {
    bloodType: {
      type: String,
      required: true,
      enum: BLOOD_TYPES,
    },
    radiusKm: {
      type: Number,
      default: 5,
      min: 0.5,
      max: 50,
    },
    message: {
      type: String,
      default: "Urgent blood needed nearby.",
      trim: true,
    },
    hospitalName: {
      type: String,
      default: "LifeLink Network",
      trim: true,
    },
    matchedDonorIds: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["sent", "active", "closed"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export const EmergencyBroadcast = mongoose.model(
  "EmergencyBroadcast",
  emergencyBroadcastSchema
);
