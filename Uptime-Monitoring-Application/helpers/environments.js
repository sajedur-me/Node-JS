/*
* Title: Environments
* Description: Handle all environments related things
* Author: Md. Sajedur Rahman (sajedur.me@gmail.com)
* Date: 28/04/2026
*/

// helpers/environments.js
const environments = {};

// Default environment
environments.staging = {
  port: 3000,
  envName: 'staging',
  secretKey: 'thisIsASecret',
  maxChecks: 5,
  twilio: {
    fromPhone: '+15313004724',
    accountSid: 'ACcf160e14476367d46ca17d1c8c34879b',
    authToken: '4aa0cf36802d62c3707d5744fbd1ed2f',}
};

// Production environment
environments.production = {
  port: 5000,
  envName: 'production',
  secretKey: 'thisIsAlsoASecret',
  maxChecks: 5,
  twilio: {
    fromPhone: '+15313004724',
    accountSid: 'ACcf160e14476367d46ca17d1c8c34879b',
    authToken: '4aa0cf36802d62c3707d5744fbd1ed2f',}
};

// Check environment from command line or default to staging
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;