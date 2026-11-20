
import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());

// Backend health check
app.get("/", (req, res) => {
  res.send("TripCraft Backend is running!");
});

// Database connection test
app.get("/api/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
