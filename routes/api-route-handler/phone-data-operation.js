'use-strict'

/**
 * Module imports
 * */

var crypto = require('crypto');

/**
 * Local imports
 * */
var logManager = require('../../utils/log-manager.js');
var utils = require('../../utils/utils.js');
var constants = require('../../helper/constants.js');
var dataProcessor = require('../../server/processor');


/**
 * Global vars
 * */
var logger = logManager.getLogger();


exports.otpRequest = function (req, res) {

    logger.info('[phone-data-operation] otpRequest');

    var phone = req.body.phone;

    if (!phone) {
        return res.send(utils.generateHTTPResponseJson('MissingPhoneNumber', constants.HTTP_STATUS_CODES.HTTP_BAD_REQUEST, 'Enter phone number'));
    }

    dataProcessor.user.optRequest(phone, function (err, data) {

        if (err) {
            res.send({success: false, message: err.message})
        } else {
            res.send({success: true, otp: data})
        }

    })
};

exports.otpVerify = function (req, res) {

    logger.info('[phone-data-operation] otpRequest');

    var phone = req.body.phone;
    var otp = req.body.otp;

    if (!phone) {
        return res.send(utils.generateHTTPResponseJson('MissingPhoneNumber', constants.HTTP_STATUS_CODES.HTTP_BAD_REQUEST, 'Enter phone number'));
    }
    if (!otp) {
        return res.send(utils.generateHTTPResponseJson('MissingOtp', constants.HTTP_STATUS_CODES.HTTP_BAD_REQUEST, 'Enter OTP'));
    }

    dataProcessor.user.otpVerify(phone, otp, function (err, data) {

        if (err)
            return res.send({success: false, message: err.message});

        if (!data)
            return res.send({success: false, message: 'Otp Mismatch'});

        data['success'] = true;
        res.send(data);


    })
};
exports.userInfo = function (req, res) {
    return res.send(req.user);
};
