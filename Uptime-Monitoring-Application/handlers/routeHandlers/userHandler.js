/*  
* Title: Sample Handler
* Description: A handler function for the sample route in the Uptime Monitoring Application.
* Author: Md. Sajedur Rahman (sajedur.me@example.com)
* Date: 29/04/2026
*/

// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']; 
    if (acceptedMethods.includes(requestProperties.method)) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName.trim() : false;
    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName.trim() : false;
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone.trim() : false;
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password.trim() : false;
    const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' && requestProperties.body.tosAgreement === true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (err) => {
            if (err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User created successfully',
                        });
                    } else {
                        callback(500, {
                            message: 'Could not create user',
                        });
                    }
                });

            } else {
                callback(400, {
                    message: 'User already exists',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Missing required fields',
        });
    }

};

handler._users.get = (requestProperties, callback) => {
    callback(200, {
        message: 'User retrieved successfully',
    });
};

handler._users.put = (requestProperties, callback) => {
    callback(200, {
        message: 'User updated successfully',
    });
}

handler._users.delete = (requestProperties, callback) => {
    callback(200, {
        message: 'User deleted successfully',
    });
}


module.exports = handler;