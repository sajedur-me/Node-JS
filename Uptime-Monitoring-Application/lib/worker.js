/*
 * Title: Production worker file for Uptime Monitoring Application
 * Description: This file runs the worker processes for the uptime monitoring app.
 * Author: Md. Sajedur Rahman (sajedur.me@example.com)
 * Date: 06/05/2026
 */

// Dependencies
const url = require('url');
const http = require('http');
const https = require('https');

const data = require('./data');
const { sendTwilioSms } = require('../helpers/notifications');

const worker = {};

// Gather all checks
worker.gatherAllChecks = () => {
  data.list('checks', (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        data.read('checks', check, (readErr, checkData) => {
          if (!readErr && checkData) {
            worker.validateCheckData(checkData);
          } else {
            console.log(`Error reading check data for check: ${check}`);
          }
        });
      });
    } else {
      console.log('Error: Could not find any checks to process');
    }
  });
};

// Validate check data
worker.validateCheckData = (checkData) => {
  if (
    checkData &&
    typeof checkData.id === 'string' &&
    checkData.id.trim().length === 20 &&
    typeof checkData.userPhone === 'string' &&
    checkData.userPhone.trim().length === 11 &&
    typeof checkData.protocol === 'string' &&
    ['http', 'https'].indexOf(checkData.protocol) > -1 &&
    typeof checkData.url === 'string' &&
    checkData.url.trim().length > 0 &&
    typeof checkData.method === 'string' &&
    ['GET', 'POST', 'PUT', 'DELETE'].indexOf(checkData.method.toUpperCase()) > -1 &&
    checkData.successCodes instanceof Array &&
    checkData.successCodes.length > 0 &&
    typeof checkData.timeoutSeconds === 'number' &&
    checkData.timeoutSeconds % 1 === 0 &&
    checkData.timeoutSeconds >= 1 &&
    checkData.timeoutSeconds <= 5
  ) {
    checkData.method = checkData.method.toUpperCase();

    checkData.state =
      typeof checkData.state === 'string' &&
      ['up', 'down'].indexOf(checkData.state) > -1
        ? checkData.state
        : 'down';

    checkData.lastChecked =
      typeof checkData.lastChecked === 'number' && checkData.lastChecked > 0
        ? checkData.lastChecked
        : false;

    worker.performCheck(checkData);
  } else {
    console.log('Error: Check data is not properly formatted');
  }
};

// Perform check
worker.performCheck = (checkData) => {
  const checkOutcome = {
    error: false,
    responseCode: false,
  };

  let outcomeSent = false;

  const parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true);

  const requestDetails = {
    protocol: `${checkData.protocol}:`,
    hostname: parsedUrl.hostname,
    method: checkData.method,
    path: parsedUrl.path,
    timeout: checkData.timeoutSeconds * 1000,
  };

  const protocolToUse = checkData.protocol === 'http' ? http : https;

  const req = protocolToUse.request(requestDetails, (res) => {
    checkOutcome.responseCode = res.statusCode;

    if (!outcomeSent) {
      worker.processCheckOutcome(checkData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on('error', (err) => {
    const checkOutcome = {
      error: true,
      value: err,
    };

    if (!outcomeSent) {
      worker.processCheckOutcome(checkData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on('timeout', () => {
    const checkOutcome = {
      error: true,
      value: 'timeout',
    };

    if (!outcomeSent) {
      worker.processCheckOutcome(checkData, checkOutcome);
      outcomeSent = true;
    }

    req.destroy();
  });

  req.end();
};

// Process check outcome
worker.processCheckOutcome = (checkData, checkOutcome) => {
  const state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    checkData.successCodes.indexOf(checkOutcome.responseCode) > -1
      ? 'up'
      : 'down';

  const alertWanted =
    checkData.lastChecked && checkData.state !== state ? true : false;

  const newCheckData = checkData;

  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  data.update('checks', newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log('Alert is not needed as there is no state change!');
      }
    } else {
      console.log('Error: Could not save check update');
    }
  });
};

// Send alert to user
worker.alertUserToStatusChange = (newCheckData) => {
  const msg = `Alert: Your check for ${newCheckData.method} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;

  sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User was alerted to a status change via SMS: ${msg}`);
    } else {
      console.log('There was a problem sending SMS to one of the users!');
    }
  });
};

// Worker loop
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 6000);
};

// Start worker
worker.init = () => {
  worker.gatherAllChecks();
  worker.loop();
};

module.exports = worker;