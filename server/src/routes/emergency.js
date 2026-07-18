import { Router } from "express";
import { Donor, BLOOD_TYPES } from "../models/Donor.js";
import { EmergencyBroadcast } from "../models/EmergencyBroadcast.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const broadcasts = await EmergencyBroadcast.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ count: broadcasts.length, broadcasts });
  } catch (err) {
    next(err);
  }
});

router.post("/broadcast", async (req, res, next) => {
  try {
    const {
      bloodType = "O+",
      radiusKm = 5,
      message = "Urgent blood needed nearby.",
      hospitalName = "LifeLink Network",
    } = req.body;

    if (!BLOOD_TYPES.includes(bloodType)) {
      return res.status(400).json({
        error: `Invalid bloodType. Use one of: ${BLOOD_TYPES.join(", ")}`,
      });
    }

    const matched = await Donor.find({
      bloodType,
      available: true,
      distanceKm: { $lte: radiusKm },
    }).sort({ distanceKm: 1 });

    const broadcast = await EmergencyBroadcast.create({
      bloodType,
      radiusKm,
      message,
      hospitalName,
      matchedDonorIds: matched.map((d) => d.publicId),
      status: "active",
    });

    res.status(201).json({
      message: "Emergency broadcast sent",
      broadcast: {
        id: broadcast._id,
        bloodType: broadcast.bloodType,
        radiusKm: broadcast.radiusKm,
        matchedCount: matched.length,
        matchedDonors: matched.map((d) => d.toPublic()),
        status: broadcast.status,
        createdAt: broadcast.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
