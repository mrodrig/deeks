'use strict';

module.exports = {
    // underscore replacements:
    isString,
    isNull,
    isError,
    isDate,
    isFunction,
    isUndefined,
    isObject,
    unique,
    flatten
};

/*
 * Helper functions which were created to remove underscorejs from this package.
 */

function isString(value) {
    return typeof value === 'string';
}

function isObject(value) {
    return typeof value === 'object';
}

function isFunction(value) {
    return typeof value === 'function';
}

function isNull(value) {
    return value === null;
}

function isDate(value) {
    return value instanceof Date;
}

function isUndefined(value) {
    return typeof value === 'undefined';
}

function isError(value) {
    return Object.prototype.toString.call(value) === '[object Error]';
}

function unique(array) {
    return [...new Set(array)];
}

function flatten(array) {
    return [].concat(...array);
}
