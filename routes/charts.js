const express = require('express');
const router = express.Router();
const { swissEph } = require("../utils/rasiEng/swisseph");
const { calculatePorutham } = require("../utils/rasiEng/matchCalculations");
const { getCityAutocomplete, getCityTimezone } = require("../utils/rasiEng/geoData");
const { calculateBirthChart } = require("../utils/astroCalculations");


router.post('/birth-chart', async (req, res) => {
  try {
    const { year, month, day, hour, minute, latitude, longitude, timezone } = req.body;
    
    // Create Date object
    const date = new Date(year, month - 1, day, hour, minute);
    
    const chartData = calculateBirthChart(
      date, 
      parseFloat(latitude), 
      parseFloat(longitude), 
      timezone || 'Asia/Kolkata'
    );

    res.json({ ok: true, data: chartData });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post('/porutham', async (req, res) => {
    try {
        const { gMoonLon, bMoonLon } = req.body;
        const result = calculatePorutham(gMoonLon, bMoonLon);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/city-autocomplete', async (req, res) => {
    try {
        const { query } = req.body;
        const cities = await getCityAutocomplete(query);
        res.json({ success: true, data: cities });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/city-timezone', async (req, res) => {
    try {
        const { lat, lon, timestamp } = req.body;
        const tz = await getCityTimezone(lat, lon, timestamp);
        res.json({ success: true, data: tz });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
