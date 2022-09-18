var CronJob = require('cron').CronJob;
var axios = require('axios');
const config = {
    
    url: '/api/updateAll',  // 只有此為必需
    method: 'get', // 大小寫皆可
    headers: { 'Content-Type': 'application/json' },
    
    // 添加在 url 前面，除非 url 為絕對路徑
    baseURL: 'http://localhost:3000'
}
var job = new CronJob('15 * * * * *', async function() {
    try {
        // let res = await axios.get('http://localhost:3000/api/updateAll');
        let res = await axios(config);
        let data = res.data;
        console.log(data);
    }
    catch (e) {
        console.log(e);
      }
}, null, true, 'America/Los_Angeles');
job.start();

// var CronJob = require('cron').CronJob;
// var job = new CronJob('* * * * * *', function() {
//     console.log('You will see this message every second');
// }, null, true, 'America/Los_Angeles');
// job.start();