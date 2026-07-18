import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { Donor } from "./models/Donor.js";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import donorRoutes from "./routes/donors.js";
import requestRoutes from "./routes/requests.js";
import emergencyRoutes from "./routes/emergency.js";
import { SAMPLE_DONORS } from "./data/sampleDonors.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/emergency", emergencyRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

async function ensureSeedData() {
  const count = await Donor.countDocuments();
  if (count === 0) {
    await Donor.insertMany(SAMPLE_DONORS);
    console.log(`Seeded ${SAMPLE_DONORS.length} sample donors`);
  }
}

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  await connectDB(uri);
  await ensureSeedData();

  app.listen(PORT, () => {
    console.log(`LifeLink API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
