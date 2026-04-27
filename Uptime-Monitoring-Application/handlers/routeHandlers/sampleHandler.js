/*
* Title: Sample Handler
* Description: A handler function for the sample route in the Uptime Monitoring Application.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 25/04/2026
*/

const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  callback(200, {
    message: 'This is a sample URL',
  });
};

module.exports = handler;