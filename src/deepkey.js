'use strict';

var _ = require('underscore');

module.exports = {
    deepKeys: deepKeys,
    deepKeysFromList: deepKeysFromList
};

function deepKeys (object) {
    return generateDeepKeysList('', object);
}

function deepKeysFromList(list) {
    return list.map(function (document) { // for each document
        if (_.isObject(document)) {
            // if the data at the key is a document, then we retrieve the subHeading starting with an empty string heading and the doc
            return deepKeys(document);
        }
    });
}

var generateDeepKeysList = function(heading, data) {
    var keyName = ''; // temporary variable to aid in determining the heading - used to generate the 'nested' headings

    var keys = Object.keys(data).map(function (currentKey) {
        // If the given heading is empty, then we set the heading to be the subKey, otherwise set it as a nested heading w/ a dot
        keyName = heading ? heading + '.' + currentKey : currentKey;

        // If we have another nested document, recur on the sub-document to retrieve the full key name
        if (_.isObject(data[currentKey]) && !_.isNull(data[currentKey]) && !_.isArray(data[currentKey]) && Object.keys(data[currentKey]).length) {
            return generateDeepKeysList(keyName, data[currentKey]);
        }
        // Otherwise return this key name since we don't have a sub document
        return keyName;
    });

    return _.flatten(keys);
};