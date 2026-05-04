/*
* Title: Token Handler
* Description: A helper function to define and handle token-related routes for the Uptime Monitoring Application.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 30/04/2026
*/


// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']; 
    if (acceptedMethods.includes(requestProperties.method)) {
        handler._tokens[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};

handler._tokens = {};

handler._tokens.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone.trim() : false;
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password.trim() : false;

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                const hashedPassword = hash(password);
                if (hashedPassword === userData.password) {
                    const tokenObject = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 1000; // 1 hour
                    const tokenData = {
                        phone,
                        token: tokenObject,
                        expires,
                    };

                    data.create('tokens', tokenObject, tokenData, (err) => {
                        if (!err) {
                            callback(200, {
                                message: 'Token created successfully',
                                token: tokenData,
                            });
                        } else {
                            callback(500, {
                                message: 'Could not create token',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        message: 'Password did not match',
                    });
                }
            } else {
                callback(400, {
                    message: 'User not found',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Missing required fields',
        });
    }
};

handler._tokens.get = (requestProperties, callback) => {
    const token = typeof requestProperties.queryStringObject.token === 'string' && requestProperties.queryStringObject.token.trim().length === 20 ? requestProperties.queryStringObject.token.trim() : false;

    if (token) {
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                callback(200, {
                    message: 'Token retrieved successfully',
                    token: tokenData,
                });
            } else {
                callback(404, {
                    message: 'Token not found',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Missing required field',
        });
    }

};

handler._tokens.put = (requestProperties, callback) => {
    const token = typeof requestProperties.body.token === 'string' && requestProperties.body.token.trim().length === 20 ? requestProperties.body.token.trim() : false;
    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true ? true : false;

    if (token && extend) {
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 60 * 60 * 1000; // extend for another hour
                    data.update('tokens', token, tokenData, (err) => {
                        if (!err) {
                            callback(200, {
                                message: 'Token extended successfully',
                            });
                        } else {
                            callback(500, {
                                message: 'Could not extend token',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        message: 'Token has already expired and cannot be extended',
                    });
                }
            } else {
                callback(404, {
                    message: 'Token not found',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Missing required fields or fields are invalid',
        });
    }
};

handler._tokens.delete = (requestProperties, callback) => {
    const token = typeof requestProperties.queryStringObject.token === 'string' && requestProperties.queryStringObject.token.trim().length === 20 ? requestProperties.queryStringObject.token.trim() : false;

    if (token) {
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', token, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'Token deleted successfully',
                        });
                    } else {
                        callback(500, {
                            message: 'Could not delete token',
                        });
                    }
                });
            } else {
                callback(400, {
                    message: 'Token not found',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Missing required field',
        });
    }
};

handler._tokens.verifyToken = (token, phone, callback) => {
    data.read('tokens', token, (err, tokenData) => {
        if (!err && tokenData) {
            if (tokenData.phone === phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;