'use strict';

var _ = require('underscore');

module.exports = {
    deepKeys: deepKeys,
    deepKeysFromList: deepKeysFromList
};

/**
 * Return the deep keys list for a single document
 * @param object
 * @returns {Array}
 */
function deepKeys (object) {
    if (_.isObject(object)) {
        return generateDeepKeysList('', object);
    }
    return [];
}

/**
 * Return the deep keys list for all documents in the provided list
 * @param list
 * @returns Array[Array[String]]
 */
function deepKeysFromList(list) {
    return list.map(function (document) { // for each document
        if (_.isObject(document)) {
            // if the data at the key is a document, then we retrieve the subHeading starting with an empty string heading and the doc
            return deepKeys(document);
        }
        return [];
    });
}

var generateDeepKeysList = function(heading, data) {
    var keys = Object.keys(data).map(function (currentKey) {
        // If the given heading is empty, then we set the heading to be the subKey, otherwise set it as a nested heading w/ a dot
        var keyName = buildKeyName(heading, currentKey);

        // If we have another nested document, recur on the sub-document to retrieve the full key name
        if (isDocument(data[currentKey]) && Object.keys(data[currentKey]).length) {
            return generateDeepKeysList(keyName, data[currentKey]);
        }
        // Otherwise return this key name since we don't have a sub document
        return keyName;
    });

    return _.flatten(keys);
};

/**
 * Function used to generate the key path
 * @param upperKeyName String accumulated key path
 * @param currentKeyName String current key name
 * @returns String
 */
function buildKeyName(upperKeyName, currentKeyName) {
    if (upperKeyName) {
        return upperKeyName + '.' + currentKeyName;
    }
    return currentKeyName;
}

/**
 * Returns whether this value is a JS document or not
 * @param val Any item whose type will be evaluated
 * @returns {boolean}
 */
function isDocument(val) {
    return _.isObject(val) && !_.isNull(val) && !_.isArray(val);
}