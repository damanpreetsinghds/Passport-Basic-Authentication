'use-strict'


/**
 * Module Exports
 * */
var express = require('express');


/**
 * Local imports
 * */

var apiHandler = require('./api-route-handler');
var authenticator = require('../config/passport.js');
/**
 * Global Vars
 * */
var router = express.Router();


router.post('/otp/request', apiHandler.user.otpRequest);

router.post('/otp/verify', apiHandler.user.otpVerify);

router.get('/user', authenticator.isAuthenticated, apiHandler.user.userInfo);


module.exports = router;
