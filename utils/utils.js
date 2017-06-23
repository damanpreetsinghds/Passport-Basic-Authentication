/*** Local Imports***/
var memoryCache = require('./cache-manager');
var logManager = require('./log-manager');
var logger = logManager.getLogger();

const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateHTTPResponseJson(errorName, errorCode, errorMessage) {
    logger.info('[utils] Generating error json for ' + errorName + errorCode + errorMessage);
    return JSON.stringify({
        name: errorName,
        statusCode: errorCode,
        message: errorMessage
    });
}

function deleteKey(id, cb) {
    logger.info('[utils] Deleting key ' + id);
    memoryCache.del(id, function (err) {
        if (err) {
            cb(err, false);
        } else {
            cb(null, true);
        }
    });

}

function setKeywithTTL(key, value, ttl, cb) {
    logger.info('[utils] cache key-value pair.', key, value);
    memoryCache.set(key, value, {ttl: ttl}, function (err) {
        logger.info('[utils] cache callback.');
        if (err)
            cb(err, null)
        else
            cb(null, 'cache' + key)
    });
}
/**
 * Generate hash of string
 * @param {string} key for cache.
 * @param {string} value for cache.
 * @param {string} cb for cache.*/
function setKey(key, value, cb) {
    memoryCache.set(key, value, function (err) {
        if (err)
            cb(err, null)
        else
            cb(null, 'cache' + key)
    });
}

function getKey(key, cb) {
    logger.info('[utils] get key.', key);
    memoryCache.get(key, function (err, result) {
        logger.info('[utils] get key callback recieved.', result);
        if (err) {
            cb(err, null);
        }
        if (result) {
            cb(null, result);
        }
    })
}


/**
 * Generate hash of string
 * @param {string} string for which hash is to be generated.*/
function hashCode(string) {
    var hash = 0, i, chr, len;
    if (string.length === 0) return hash;
    for (i = 0, len = string.length; i < len; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
/**
 * Generate ErrorJSON based on the ErrorOBJ from DynamoDB.
 * @param {obj} err - error object from the DynamoDB.
 */
function checkError(err) {
    logger.info('[utils] Checking ErrorJSON based on the ErrorOBJ from DynamoDB.');
    if (err) {
        if (err.code) {
            return JSON.parse(generateHTTPResponseJson(err.name, constants.HTTP_STATUS_CODES.HTTP_NOT_FOUND, err.message));
        }
        var errJSON;
        try {
            errJSON = JSON.parse(err);
        } catch (e) {
            logger.error('Invalid error JSON');
        }
        if (errJSON.statusCode) {
            return errJSON;
        }
    }
}
/** Function to check empty object
 * @param (Object) object to check is empty.
 */
function isEmpty(obj) {
    return (Object.keys(obj).length === 0);
}
/** Sorter function to sort two values
 * @param key
 */
function getSorter(key) {
    return function (a, b) {
        if (a[key] > b[key]) {
            return 1;
        }
        if (a[key] < b[key]) {
            return -1;
        }
        /** a must be equal to b */
        return 0;
    };
}

/** Sort the array object.
 * @param {string} field name of the field in array for which it should be sorted.
 * @param {boolean} reverse whether ascending or descending.
 * @param {operator} primer to convert the object.
 */
var sort_by = function (field, reverse, primer) {
    logger.info('[utils] sorting the array items on key=' + field);

    var key = primer ?
        function (x) {
            return primer(x[field]);
        } : function (x) {
            return x[field];
        };

    reverse = reverse ? -1 : 1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    };
};


exports.generateHTTPResponseJson = generateHTTPResponseJson;
exports.deleteKey = deleteKey;
exports.setKeywithTTL = setKeywithTTL;
exports.setKey = setKey;
exports.getKey = getKey;
exports.checkError = checkError;
exports.isEmpty = isEmpty;
exports.getSorter = getSorter;
exports.sort_by = sort_by;
exports.hashCode = hashCode;