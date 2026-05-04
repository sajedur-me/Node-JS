/*
* Title: Check Handler
* Description: A helper function to handle different check-related routes for the Uptime Monitoring Application.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 04/05/2026
*/

// dependencies
const data = require('../../lib/data');
const { createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']; 
    if (acceptedMethods.includes(requestProperties.method)) {
        handler._checks[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};

handler._checks = {};

handler._checks.post = (requestProperties, callback) => {
    const protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].includes(requestProperties.body.protocol) ? requestProperties.body.protocol : false;
    const url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url.trim() : false;
    const method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].includes(requestProperties.body.method) ? requestProperties.body.method : false;
    const successCodes = typeof requestProperties.body.successCodes === 'object' && requestProperties.body.successCodes instanceof Array && requestProperties.body.successCodes.length > 0 ? requestProperties.body.successCodes : false;
    const timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

        data.read('tokens', token, (err, tokenData) => {
              if (!err && tokenData) {
                const userPhone = tokenData.phone;
                data.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        tokenHandler._tokens.verifyToken(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];
                                if (userChecks.length < maxChecks) {
                                    const checkId = createRandomString(20);
                                    const checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds,
                                    };
                                    data.create('checks', checkId, checkObject, (err) => {
                                        if (!err) {
                                            userData.checks = userChecks;
                                            userData.checks.push(checkId);

                                            data.update('users', userPhone, userData, (err) => {
                                                if (!err) {
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        message: 'Could not update the user with the new check',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                message: 'Could not create the new check',
                                            });
                                        }
                                    });
                                } else {
                                    callback(400, {
                                        message: 'Maximum number of checks reached',
                                    });
                                }
                            } else {
                                callback(403, {
                                    message: 'Token is invalid',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            message: 'User not found',
                        });
                    }
                });
              } else {
                callback(403, {
                    message: 'Authentication failed',
                });
              }
        });
        
    } else {
        callback(400, {
            message: 'Missing required fields or fields are invalid',
        });
    }
};

handler._checks.get = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id.trim() : false;

    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

                tokenHandler._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, checkData);
                    } else {
                        callback(403, {
                            message: 'Token is invalid',
                        });
                    }
                });
            } else {
                callback(404, {
                    message: 'Check not found',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Missing required field',
        });
    }
};

handler._checks.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id.trim() : false;
    const protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].includes(requestProperties.body.protocol) ? requestProperties.body.protocol : false;
    const url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url.trim() : false;
    const method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].includes(requestProperties.body.method) ? requestProperties.body.method : false;
    const successCodes = typeof requestProperties.body.successCodes === 'object' && requestProperties.body.successCodes instanceof Array && requestProperties.body.successCodes.length > 0 ? requestProperties.body.successCodes : false;
    const timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (id) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {
                    const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

                    tokenHandler._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {} else { checkData.protocol = protocol; }
                            if (url) {} else { checkData.url = url; }
                            if (method) {} else { checkData.method = method; }
                            if (successCodes) {} else { checkData.successCodes = successCodes; }
                            if (timeoutSeconds) {} else { checkData.timeoutSeconds = timeoutSeconds; }

                            data.update('checks', id, checkData, (err) => {
                                if (!err) {
                                    callback(200, checkData);
                                } else {
                                    callback(500, {
                                        message: 'Could not update the check',
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                message: 'Token is invalid',
                            });
                        }
                    });
                } else {
                    callback(404, {
                        message: 'Check not found',
                    });
                }
            });
        } else {
            callback(400, {
                message: 'Missing fields to update',
            });
        }
    } else {
        callback(400, {
            message: 'Missing required field',
        });
    }
};

handler._checks.delete = (requestProperties, callback) => {
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id.trim() : false;

    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

                tokenHandler._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        data.delete('checks', id, (err) => {
                            if (!err) {
                                data.read('users', checkData.userPhone, (err, userData) => {
                                    if (!err && userData) {
                                        const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];
                                        const checkPosition = userChecks.indexOf(id);

                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            userData.checks = userChecks;
                                            data.update('users', checkData.userPhone, userData, (err) => {
                                                if (!err) {
                                                    callback(200, {
                                                        message: 'Check deleted successfully',
                                                    });
                                                } else {
                                                    callback(500, {
                                                        message: 'Could not update the user after deleting the check',
                                                    });
                                                }
                                            });
                                        } else { 
                                            callback(500, {
                                                message: 'Could not find the check on the user\'s object, so could not remove it',
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            message: 'Could not find the user who created the check',
                                        });
                                    }
                                });
                            } else {
                                callback(500, {
                                    message: 'Could not delete the check',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            message: 'Token is invalid',
                        });
                    }
                });
            } else {
                callback(404, {
                    message: 'Check not found',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Missing required field',
        });
    }
};


module.exports = handler;



