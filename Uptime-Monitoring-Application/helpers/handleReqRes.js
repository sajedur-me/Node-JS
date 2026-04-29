/*
* Title: Handle Request and Response
* Description: A helper function to handle HTTP requests and responses for the Uptime Monitoring Application.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 25/04/2026
*/

const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const notFoundHandler = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headersObject = req.headers;

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };

  const chosenHandler =
    typeof routes[trimmedPath] === 'function'
      ? routes[trimmedPath]
      : notFoundHandler.notFoundHandler;

  console.log('trimmedPath:', trimmedPath);
  console.log('chosenHandler:', chosenHandler);
  console.log('type:', typeof chosenHandler);

  const decoder = new StringDecoder('utf-8');
  let realData = '';

  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on('end', () => {
    realData += decoder.end();

    requestProperties.body = parseJSON(realData);

    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      payload = typeof payload === 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;