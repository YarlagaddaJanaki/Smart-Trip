const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const savedTripRoutes = require("./routes/savedTripRoutes");
// Database
require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const aiRoutes = require("./routes/aiRoutes");
// JWT Middleware
const verifyToken = require("./middleware/authMiddleware"); // change if your filename is different

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/ai", aiRoutes);
// Home Route
app.use("/api/saved-trips", savedTripRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "AI Travel Planner Backend Running Successfully 🚀"
    });
});

// Protected Route
app.get("/api/profile", verifyToken, (req, res) => {
    res.json({
        success: true,
        message: "Protected Route Accessed Successfully",
        user: req.user
    });
});

const geocodeCache = new Map();

app.get("/api/geocode", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();

    if (!query) {
      return res.status(400).json({ message: "Destination is required" });
    }

    // Reuse previous results instead of repeatedly querying the service.
    const cacheKey = query.toLowerCase();

    if (geocodeCache.has(cacheKey)) {
      return res.json(geocodeCache.get(cacheKey));
    }

    const url = new URL(
      "https://nominatim.openstreetmap.org/search"
    );

    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "in");

    const response = await fetch(url, {
      headers: {
        "User-Agent": "SmartTripAI/1.0 (destination lookup)"
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        message: "Geocoding service is unavailable"
      });
    }

    const results = await response.json();

    if (!results.length) {
      return res.status(404).json({
        message: "Location not found"
      });
    }

    const location = {
      lat: Number(results[0].lat),
      lon: Number(results[0].lon),
      displayName: results[0].display_name
    };

    geocodeCache.set(cacheKey, location);

    res.json(location);
  } catch (error) {
    console.error("Geocoding error:", error.message);
    res.status(500).json({ message: "Unable to find location" });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});