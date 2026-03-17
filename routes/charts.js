const express = require('express');
const router = express.Router();
const { swissEph } = require("../utils/rasiEng/swisseph");
const { calculatePorutham } = require("../utils/rasiEng/matchCalculations");
const { getCityAutocomplete, getCityTimezone } = require("../utils/rasiEng/geoData");
const { calculateBirthChart } = require("../utils/astroCalculations");


router.post('/birth-chart', async (req, res) => {
  try {
    let { year, month, day, hour, minute, latitude, longitude, timezone, date: dateStr, time: timeStr, lat, lon } = req.body;
    
    // Fallback parsing for combined date/time
    if (dateStr && !year) {
      const parts = dateStr.split('-');
      year = parseInt(parts[0]);
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    }
    if (timeStr && hour === undefined) {
      const parts = timeStr.split(':');
      hour = parseInt(parts[0]);
      minute = parseInt(parts[1]);
    }
    
    const latFinal = parseFloat(latitude || lat || 13.0827);
    const lonFinal = parseFloat(longitude || lon || 80.2707);

    // Create Date object
    const date = new Date(year, month - 1, day, hour, minute);
    
    const chartData = calculateBirthChart(
      date, 
      latFinal, 
      lonFinal, 
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
