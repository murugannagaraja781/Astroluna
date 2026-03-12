
const { fetchDailyHoroscope } = require('/Users/wohozo/Documents/Astroluna/utils/rasiEng/horoscopeData');
const { DateTime } = require('luxon');

async function checkSigns() {
    const today = DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd');
    const data = await fetchDailyHoroscope(today);
    console.log('Signs in data:');
    data.forEach(item => {
        console.log(`- EN: ${item.sign_en}, TA: ${item.sign_ta}`);
    });

    const taurusData = data.find(item => item.sign_en && item.sign_en.toLowerCase() === 'taurus');
    console.log('\nTaurus search result:', taurusData ? 'FOUND' : 'NOT FOUND');
}

checkSigns();
