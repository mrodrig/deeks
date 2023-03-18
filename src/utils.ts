'use strict';

export function unique(array: unknown[]) {
    return [...new Set(array)];
}

export function flatten(array: unknown[]) {
    return [].concat(...array as ConcatArray<never>[]);
}

/**
 * Returns whether this value is a document to recur on or not
 * @param val Any item whose type will be evaluated
 * @returns {boolean}
 */
export function isDocumentToRecurOn(val: unknown) {
    return typeof val === 'object' && val !== null && !Array.isArray(val) && Object.keys(val).length;
}
