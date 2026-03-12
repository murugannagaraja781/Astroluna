const { fetchDailyHoroscope } = require('./utils/rasiEng/horoscopeData');

async function test() {
    const today = '2026-03-12';
    const data = await fetchDailyHoroscope(today);
    console.log(JSON.stringify(data, null, 2));
}

test();
