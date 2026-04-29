/*
* Title: Utilities
* Description: A helper function containing utility functions for the Uptime Monitoring Application.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 29/04/2026
*/


const crypto = require('crypto');
const utilities = {};
const environments = require('./environments');

// parse JSON string to an object
utilities.parseJSON = (str) => {
  let obj = {};
  try {
    obj = JSON.parse(str);
  } catch (error) {
    obj = {};
  }
  return obj;
};

// hash a string
utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

module.exports = utilities;