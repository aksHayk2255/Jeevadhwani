import { Router } from "express";
import { Donor, BLOOD_TYPES } from "../models/Donor.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { bloodType, available } = req.query;
    const filter = {};

    if (bloodType) {
      if (!BLOOD_TYPES.includes(bloodType)) {
        return res.status(400).json({
          error: `Invalid bloodType. Use one of: ${BLOOD_TYPES.join(", ")}`,
        });
      }
      filter.bloodType = bloodType;
    }

    if (available !== undefined) {
      filter.available = available === "true";
    }

    const donors = await Donor.find(filter).sort({ distanceKm: 1 });
    res.json({
      count: donors.length,
      donors: donors.map((d) => d.toPublic()),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/nearest", async (req, res, next) => {
  try {
    const { bloodType } = req.query;

    if (!bloodType || !BLOOD_TYPES.includes(bloodType)) {
      return res.status(400).json({
        error: `bloodType query is required. Use one of: ${BLOOD_TYPES.join(", ")}`,
      });
    }

    const donor = await Donor.findOne({
      bloodType,
      available: true,
    }).sort({ distanceKm: 1 });

    if (!donor) {
      return res.status(404).json({
        error: `No available donors found for ${bloodType}`,
      });
    }

    res.json({ donor: donor.toPublic() });
  } catch (err) {
    next(err);
  }
});

router.get("/:publicId", async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ publicId: req.params.publicId });
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }
    res.json({ donor: donor.toPublic() });
  } catch (err) {
    next(err);
  }
});

export default router;
