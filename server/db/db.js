'use-strict'
/**
 * Local imports*/

var dbUtils = require('../../utils/dbUtils.js');
var logManager = require('../../utils/log-manager.js');
var security = require('../../utils/security.js');

/**
 * Global vars
 * */
var logger = logManager.getLogger();


exports.findUserByPhone = function (phone, cb) {
    logger.info('[db] findUserByPhone', phone);

    try {
        var tableName = 'pba_user';
        dbUtils.getConnection(function (db) {
            db.collection(tableName).findOne({'phone': phone}, function (err, user) {
                // if there are any errors, return the error

                if (err)
                    cb(err, null);
                else
                    cb(null, user);

            });
        });
    } catch (e) {
    }

};

exports.createUser = function (user, cb) {
    logger.info('[db] createUser', user);
    try {
        var tableName = 'pba_user';
        dbUtils.getConnection(function (db) {
            db.collection(tableName).insertOne(user, function (err, data) {
                // if there are any errors, return the error

                if (err)
                    cb(err, null);
                else
                    cb(null, true);

            });
        });
    } catch (e) {
    }


}