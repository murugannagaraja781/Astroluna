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

        const externalData = await fetchDailyHoroscope(today);

        if (externalData && Array.isArray(externalData)) {
            // Map external data to our app's expected format (RasipalanModel.kt)
            const mappedData = externalData.map((item, index) => ({
                signId: index + 1,
                signNameEn: item.sign_en,
                signNameTa: item.sign_ta,
                date: today,
                prediction: {
                    ta: truncateTo3Lines(item.forecast_ta),
                    en: truncateTo3Lines(item.forecast_en)
                },
                details: {
                    career: item.career_ta,
                    finance: item.finance_ta,
                    health: item.health_ta
                },
                lucky: {
                    number: String(item.lucky_number),
                    color: {
                        ta: item.lucky_color_ta,
                        en: item.lucky_color_en
                    }
                }
            }));

            console.log("Fetched and mapped Rasi Engine horoscope data for Android successfully.");
            // Android app expects the array directly
            return res.json(mappedData);
        } else {
            console.error("Failed to fetch horoscope data from Rasi Engine source.");
            return res.status(500).json([]);
        }
    } catch (error) {
        console.error("Error in Rasipalan route:", error.message);
        return res.status(500).json([]);
    }
});

function truncateTo3Lines(text) {
    if (!text) return "";
    // If text has newlines, take first 3 lines
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    if (lines.length >= 3) {
        return lines.slice(0, 3).join('\n');
    }
    // If it's one long paragraph, take first 3 sentences or ~250 chars
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    if (sentences.length >= 3) {
        return sentences.slice(0, 3).join(' ');
    }
    // Default: truncate to 250 characters if still too long
    if (text.length > 250) {
        return text.substring(0, 247) + "...";
    }
    return text;
}

module.exports = router;
