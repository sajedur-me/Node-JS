/*
* Title: Not Found Handler
* Description: A handler function for handling not found routes in the Uptime Monitoring Application.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 25/04/2026
*/

const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: 'Your requested URL was not found',
  });
};

module.exports = handler;