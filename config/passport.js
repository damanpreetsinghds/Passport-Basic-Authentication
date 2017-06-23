'use-strict'

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

/**
 * Local import
 * */
var db = require('../server/db');
var logManager = require('../utils/log-manager.js');
var utils = require('../utils/utils.js');

/**
 * Global vars
 * */
var logger = logManager.getLogger();
passport.use(new BasicStrategy(
    function (phone, password, callback) {

        logger.info('[passport]', phone);

        db.findUserByPhone(phone, function (err, user) {

            logger.info('[passport]', err, user);

            if (err)
                return callback(err, null);

            if (!user || utils.isEmpty(user))
                return callback(null, false);

            callback(null, user);

        })

    }
));

exports.isAuthenticated = passport.authenticate('basic', {session: false});