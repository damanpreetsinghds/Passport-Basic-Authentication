'use-strict'
/**
 * Local imports*/

var logManager = require('../../utils/log-manager.js');
var security = require('../../utils/security.js');
var memoryCache = require('../../utils/cache-manager.js');
var dataProcessor = require('../processor');


/**
 * Global vars
 * */
var logger = logManager.getLogger();

/*Phone user cache*/


/*******************************User Cache Data**********************/
exports.findUserByPhone = function (phone, cb) {

    var id = 'userphone' + phone;
    logger.info('[cache] Caching the request', id);
    memoryCache.wrap(id, function (callback) {
        dataProcessor.user.findUserByPhone(phone, callback)
    }, {ttl: 60 * 60 * 24/* one day*/}, cb);

};