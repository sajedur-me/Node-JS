/*
* Title: Notifications Helper
* Description: Helper for sending notifications to users in the Uptime Monitoring Application.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 05/05/2026
*/

const https = require('https');
// const { twilio } = require('./config');
const querystring = require('querystring');
const { twilio } = require('./environments');

const notifications = {};

notifications.sendTwilioSms = (phone, message, callback) => {
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMessage = typeof message === 'string' && message.trim().length > 0 && message.trim().length <= 1600 ? message.trim() : false;

    if (userPhone && userMessage) {
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMessage
        };

        const stringPayload = querystring.stringify(payload);

        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
            }
        };

        const req = https.request(requestDetails, (res) => {
            const status = res.statusCode;

            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback('Error occurred while sending SMS');
        });
        req.write(stringPayload);
        req.end();
    } else {
        callback('Given parameters were missing or invalid');
    }
};


module.exports = notifications;







