/*
* Title: Uptime Monitoring Application
* Description: A RESTful API to monitor up/down time of user defined links.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 25/04/2026
*/

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');

// App object - module scaffolding
const app = {};

app.config = {
    port: 3000,
};


app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Server is listening on port ${app.config.port}`);
    });
}

app.handleReqRes = handleReqRes;


// Start the server
app.createServer();
