/*
* Title: Uptime Monitoring Application
* Description: A RESTful API to monitor up/down time of user defined links.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 25/04/2026
*/

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');

// App object - module scaffolding
const app = {};

app.init = () => {
    server.init();
    workers.init();
};

app.init();

module.exports = app;
