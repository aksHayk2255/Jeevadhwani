import { Router } from "express";
import { Donor, BLOOD_TYPES } from "../models/Donor.js";
import { BloodRequest } from "../models/BloodRequest.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 }).limit(50);
    res.json({ count: requests.length, requests });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const {
      donorId,
      bloodType,
      requesterName = "Anonymous",
      requesterRole = "patient",
      message = "",
    } = req.body;

    if (!donorId || !bloodType) {
      return res.status(400).json({
        error: "donorId and bloodType are required",
      });
    }

    if (!BLOOD_TYPES.includes(bloodType)) {
      return res.status(400).json({
        error: `Invalid bloodType. Use one of: ${BLOOD_TYPES.join(", ")}`,
      });
    }

    const donor = await Donor.findOne({ publicId: donorId, available: true });
    if (!donor) {
      return res.status(404).json({
        error: "Available donor not found",
      });
    }

    if (donor.bloodType !== bloodType) {
      return res.status(400).json({
        error: `Donor ${donorId} is ${donor.bloodType}, not ${bloodType}`,
      });
    }

    const request = await BloodRequest.create({
      donorPublicId: donorId,
      bloodType,
      requesterName,
      requesterRole,
      message,
    });

    res.status(201).json({
      message: "Blood request sent",
      request,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
