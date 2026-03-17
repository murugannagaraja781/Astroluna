// utils/rasiEng/geoData.js
const fetch = require('node-fetch');

/**
 * Get city suggestions using a public API or placeholder logic
 * @param {string} query - City name query
 */
async function getCityAutocomplete(query) {
    if (!query || query.length < 3) return [];
    
    try {
        // Fallback to a free public API if no Google API key is available
        // For now, returning a mock or a simple search
        // In production, this should use Google Places API
        console.log(`Searching for cities with query: ${query}`);
        
        // Mock data for demo/stability
        const mocks = [
            { name: 'Chennai, Tamil Nadu, India', lat: 13.0827, lon: 80.2707, timezone: 'Asia/Kolkata' },
            { name: 'Bangalore, Karnataka, India', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
            { name: 'Madurai, Tamil Nadu, India', lat: 9.9252, lon: 78.1198, timezone: 'Asia/Kolkata' },
            { name: 'Coimbatore, Tamil Nadu, India', lat: 11.0168, lon: 76.9558, timezone: 'Asia/Kolkata' },
            { name: 'Salem, Tamil Nadu, India', lat: 11.6643, lon: 78.1460, timezone: 'Asia/Kolkata' }
        ];

        return mocks.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
    } catch (error) {
        console.error('Error in getCityAutocomplete:', error);
        return [];
    }
}

/**
 * Get timezone for a coordinate
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} timestamp - Unix timestamp
 */
async function getCityTimezone(lat, lon, timestamp) {
    try {
        // Most of India is Asia/Kolkata
        // In a real app, use Google Timezone API
        return {
            timezoneId: 'Asia/Kolkata',
            rawOffset: 19800,
            dstOffset: 0
        };
    } catch (error) {
        console.error('Error in getCityTimezone:', error);
        return { timezoneId: 'UTC', rawOffset: 0, dstOffset: 0 };
    }
}

module.exports = {
    getCityAutocomplete,
    getCityTimezone
};
