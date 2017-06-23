'use-strict'

var crypto = require('crypto');
/**
 * Local imports*/

var logManager = require('../../utils/log-manager.js');
var db = require('../db/db.js');
var utils = require('../../utils/utils.js');
var cache = require('../db');
var security = require('../../utils/security.js');

/**
 * Global vars
 * */
var logger = logManager.getLogger();


exports.findUserByPhone = function (phone, cb) {

    logger.info('[phone-data-processor] findUserByPhone ', phone);

    db.findUserByPhone(phone, function (err, data) {
        logger.info('[phone-data-processor] findUserByPhone ', err, data);
        return cb(err, data);
    })

};

exports.optRequest = function (phone, cb) {
    var otp = crypto.randomBytes(3).toString('hex').toUpperCase();
    utils.setKeywithTTL(phone, otp, 60 * 5/*5 min*/, function (err) {
        if (err) cb(err, null);
        else cb(null, otp)
    })

};

exports.otpVerify = function (phone, otp, cb) {
    logger.info('[phone-data-processor] otpVerify ', phone, otp);
    utils.getKey(phone, function (err, data) {
        if (err) return cb(err, null);

        if (otp !== data)
            return cb(null, false);

        cache.findUserByPhone(phone, function (err, user) {
            if (err)
                return cb(err, null);

            if (!user || utils.isEmpty(user)) {
                var userData = {
                    phone: phone,
                    password: security.encryptPassword(phone)
                };

                createUser(userData, function (err, user) {

                    if (err)
                        return cb(err, null);

                    if (user) {

                        cb(null, {token: new Buffer(user['phone'] + ":" + user['password'], "utf8").toString("base64")})
                    }

                })
            } else {
                cb(null, {token: new Buffer(user['phone'] + ":" + user['password'], "utf8").toString("base64")})

            }


        })


    });

};

function createUser(user, cb) {

    logger.info('[phone-data-processor] createUser', user);

    db.createUser(user, function (err, data) {
        cb(err, data)
    })
}


exports.createUser = createUser;


