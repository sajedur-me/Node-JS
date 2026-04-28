/*
* Title: Uptime Monitoring Application
* Description: A RESTful API to monitor up/down time of user defined links.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 25/04/2026
*/

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// App object - module scaffolding
const app = {};

// Testing file system

data.delete('test', 'newFile', (err, data) => {
    console.log(err, data);
});


app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Server is listening on port ${environment.port}`);

        console.log(environment);  // Check the entire environment object

    });
};

app.handleReqRes = handleReqRes;


// Start the server
app.createServer();
