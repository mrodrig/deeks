'use strict';

import { DeeksOptions } from './types';
import * as utils from './utils';

export * from './types';

/**
 * Return the deep keys list for a single document
 * @param object
 * @param options
 * @returns {Array}
 */
export function deepKeys(object: object, options?: DeeksOptions): string[] {
    const parsedOptions = mergeOptions(options);
    if (typeof object === 'object' && object !== null) {
        return generateDeepKeysList('', object as Record<string, unknown>, parsedOptions);
    }
    return [];
}

/**
 * Return the deep keys list for all documents in the provided list
 * @param list
 * @param options
 * @returns Array[Array[String]]
 */
export function deepKeysFromList(list: object[], options?: DeeksOptions): string[][] {
    const parsedOptions = mergeOptions(options);
    return list.map((document: object): string[] => { // for each document
        if (typeof document === 'object' && document !== null) {
            // if the data at the key is a document, then we retrieve the subHeading starting with an empty string heading and the doc
            return deepKeys(document, parsedOptions);
        }
        return [];
    });
}

function generateDeepKeysList(heading: string, data: Record<string, unknown>, options: DeeksOptions): string[] {
    const keys = Object.keys(data).map((currentKey: string) => {
        // If the given heading is empty, then we set the heading to be the subKey, otherwise set it as a nested heading w/ a dot
        const keyName = buildKeyName(heading, escapeNestedDotsIfSpecified(currentKey, options));

        // If we have another nested document, recur on the sub-document to retrieve the full key name
        if (options.expandNestedObjects && utils.isDocumentToRecurOn(data[currentKey]) || (options.arrayIndexesAsKeys && Array.isArray(data[currentKey]) && (data[currentKey] as unknown[]).length)) {
            return generateDeepKeysList(keyName, data[currentKey] as Record<string, unknown>, options);
        } else if (options.expandArrayObjects && Array.isArray(data[currentKey])) {
            // If we have a nested array that we need to recur on
            return processArrayKeys(data[currentKey] as object[], keyName, options);
        } else if (options.ignoreEmptyArrays && Array.isArray(data[currentKey]) && !(data[currentKey] as unknown[]).length) {
            return [];
        }
        // Otherwise return this key name since we don't have a sub document
        return keyName;
    });

    return utils.flatten(keys);
}

/**
 * Helper function to handle the processing of arrays when the expandArrayObjects
 * option is specified.
 * @param subArray
 * @param currentKeyPath
 * @param options
 * @returns {*}
 */
function processArrayKeys(subArray: object[], currentKeyPath: string, options: DeeksOptions) {
    let subArrayKeys = deepKeysFromList(subArray, options);

    if (!subArray.length) {
        return options.ignoreEmptyArraysWhenExpanding ? [] : [currentKeyPath];
    } else if (subArray.length && utils.flatten(subArrayKeys).length === 0) {
        // Has items in the array, but no objects
        return [currentKeyPath];
    } else {
        subArrayKeys = subArrayKeys.map((schemaKeys) => {
            if (Array.isArray(schemaKeys) && schemaKeys.length === 0) {
                return [currentKeyPath];
            }
            return schemaKeys.map((subKey) => buildKeyName(currentKeyPath, escapeNestedDotsIfSpecified(subKey, options)));
        });

        return utils.unique(utils.flatten(subArrayKeys));
    }
}

function escapeNestedDotsIfSpecified(key: string, options: DeeksOptions) {
    if (options.escapeNestedDots) {
        return key.replace(/\./g, '\\.');
    }
    return key;
}

/**
 * Function used to generate the key path
 * @param upperKeyName String accumulated key path
 * @param currentKeyName String current key name
 * @returns String
 */
function buildKeyName(upperKeyName: string, currentKeyName: string) {
    if (upperKeyName) {
        return upperKeyName + '.' + currentKeyName;
    }
    return currentKeyName;
}

function mergeOptions(options: DeeksOptions | undefined): DeeksOptions {
    return {
        arrayIndexesAsKeys: false,
        expandNestedObjects: true,
        expandArrayObjects: false,
        ignoreEmptyArraysWhenExpanding: false,
        escapeNestedDots: false,
        ignoreEmptyArrays: false,
        ...(options ?? {})
    };
}
