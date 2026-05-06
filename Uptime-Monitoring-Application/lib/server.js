/*
* Title: Production server file for Uptime Monitoring Application
* Description: This file will be used to run the application in production environment.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 06/05/2026
*/

// Dependencies
const http = require('http');
const {handleReqRes} = require('../helpers/handleReqRes');

const server = {};

server.config = {
    port: 3000,
};

server.createServer = () => {
    const httpServer = http.createServer(server.handleReqRes);
    httpServer.listen(server.config.port, () => {
        console.log(`Server is listening on port ${server.config.port} in ${process.env.NODE_ENV} mode`);
    });
};

server.handleReqRes = handleReqRes;


// Start the server
server.init = () => {
    server.createServer();
};


module.exports = server;