const fs = require('fs');
const path = require('path');


function convertCookiesToHeader(cookies) {
    return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
}


const getCookie = () => {
    const cookiesJson = fs.readFileSync(path.join(__dirname, '../cookies.json'), 'utf8');
    const cookies = JSON.parse(cookiesJson);
    return convertCookiesToHeader(cookies)
}


module.exports = getCookie()

