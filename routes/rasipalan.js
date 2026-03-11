const express = require('express');
const router = express.Router();
const { DateTime } = require('luxon');
const { fetchDailyHoroscope } = require('../utils/rasiEng/horoscopeData');

// Mapping for canonical rasi names if needed, but we'll try to stick to what the data provides
// or what the app previously used if possible.
const SIGN_NAME_MAP = {
    "Aries": "Mesham",
    "Taurus": "Rishabam",
    "Gemini": "Mithunam",
    "Cancer": "Kadagam",
    "Leo": "Simmam",
    "Virgo": "Kanni",
    "Libra": "Thulaam",
    "Scorpio": "Viruchigam",
    "Sagittarius": "Dhanusu",
    "Capricorn": "Magaram",
    "Aquarius": "Kumbam",
    "Pisces": "Meenam"
};

router.get('/', async (req, res) => {
    try {
        const today = DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd');
        console.log(`Fetching Rasipalan data for: ${today}`);

        let externalData = await fetchDailyHoroscope(today);

        // If data is null or not an array, try to return an empty array with 200 OK
        // to avoid crashing the app with 500 errors.
        if (!externalData || !Array.isArray(externalData)) {
            console.error("No horoscope data found for today or yesterday.");
            return res.json([]);
        }

        // Map external data to our app's expected format (RasipalanModel.kt)
        const mappedData = externalData.map((item, index) => {
            const predictionTa = item.prediction_ta || item.forecast_ta || item.details?.career || "";
            const predictionEn = item.prediction_en || item.forecast_en || item.details?.career_en || "";

            return {
                signId: index + 1,
                signNameEn: item.sign_en || "",
                signNameTa: item.sign_ta || "",
                date: today,
                prediction: {
                    ta: predictionTa,
                    en: predictionEn
                },
                details: {
                    career: item.career_ta || item.details?.career || "Moderate",
                    finance: item.finance_ta || item.details?.finance || "Stable",
                    health: item.health_ta || item.details?.health || "Good"
                },
                lucky: {
                    number: String(item.lucky_number || ""),
                    color: {
                        ta: item.lucky_color_ta || "",
                        en: item.lucky_color_en || ""
                    }
                }
            };
        });

        // Filter by sign if provided in query (useful for testing)
        const signQuery = req.query.sign;
        if (signQuery) {
            const searchStr = signQuery.toLowerCase();
            const filtered = mappedData.filter(d =>
                (d.signNameEn && d.signNameEn.toLowerCase() === searchStr) ||
                (d.signNameTa === signQuery)
            );
            return res.json(filtered);
        }

        console.log(`Successfully fetched and mapped ${mappedData.length} Rasi items.`);
        return res.json(mappedData);
    } catch (error) {
        console.error("Error in Rasipalan route:", error.message);
        // Always return an empty array instead of a 500 status to prevent app from ignoring the response body
        return res.json([]);
    }
});

// Helper removed from here as we want full text for the list view


module.exports = router;
