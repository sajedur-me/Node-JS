/*
* Title: Routes
* Description: A helper function to define and handle different routes for the Uptime Monitoring Application.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 25/04/2026
*/

const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler');

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;