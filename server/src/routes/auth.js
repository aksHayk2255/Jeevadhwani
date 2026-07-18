import { Router } from "express";
import { BLOOD_TYPES } from "../models/Donor.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { signToken } from "../utils/token.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = "donor",
      bloodType,
      hospitalName = "",
      phone = "",
      aadhaarNumber = "",
    } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        error: "name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    if (!["donor", "hospital"].includes(role)) {
      return res.status(400).json({
        error: 'role must be "donor" or "hospital"',
      });
    }

    if (role === "donor") {
      if (!bloodType || !BLOOD_TYPES.includes(bloodType)) {
        return res.status(400).json({
          error: `Donors must provide a valid bloodType: ${BLOOD_TYPES.join(", ")}`,
        });
      }
    }

    if (role === "hospital" && !hospitalName?.trim()) {
      return res.status(400).json({
        error: "Hospitals must provide hospitalName",
      });
    }

    const normalizedAadhaar = aadhaarNumber?.trim().replace(/\s+/g, "");
    const normalizedPhone = phone?.trim();

    if (!normalizedPhone) {
      return res.status(400).json({
        error: "Mobile number is required",
      });
    }

    if (!normalizedAadhaar || !/^\d{12}$/.test(normalizedAadhaar)) {
      return res.status(400).json({
        error: "Aadhaar number must be a 12-digit number",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    if (normalizedAadhaar) {
      const aadhaarExists = await User.findOne({ aadhaarNumber: normalizedAadhaar });
      if (aadhaarExists) {
        return res.status(409).json({ error: "Aadhaar number is already registered" });
      }
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      bloodType: role === "donor" ? bloodType : undefined,
      hospitalName: role === "hospital" ? hospitalName.trim() : "",
      phone: normalizedPhone,
      aadhaarNumber: normalizedAadhaar,
    });

    const token = signToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: user.toPublic(),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);

    res.json({
      message: "Login successful",
      token,
      user: user.toPublic(),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user.toPublic() });
});

export default router;
