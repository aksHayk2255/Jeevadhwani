import "dotenv/config";
import { connectDB } from "./config/db.js";
import { Donor } from "./models/Donor.js";
import { SAMPLE_DONORS } from "./data/sampleDonors.js";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  await connectDB(uri);
  await Donor.deleteMany({});
  await Donor.insertMany(SAMPLE_DONORS);

  console.log(`Seeded ${SAMPLE_DONORS.length} donors`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
