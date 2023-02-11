'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyArray = exports.flatten = exports.unique = exports.isNull = exports.isObject = void 0;
function isObject(value) {
    return typeof value === 'object';
}
exports.isObject = isObject;
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
function unique(array) {
    return [...new Set(array)];
}
exports.unique = unique;
function flatten(array) {
    return [].concat(...array);
}
exports.flatten = flatten;
function isEmptyArray(val) {
    return Array.isArray(val) && !val.length;
}
exports.isEmptyArray = isEmptyArray;
//# sourceMappingURL=utils.js.map