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
    const visited = new WeakSet<object>();

    if (typeof object === 'object' && object !== null) {
        return generateDeepKeysList('', object as Record<string, unknown>, parsedOptions, visited);
    }
    return [];
}

/**
 * Return the deep keys list for all documents in the provided list
 * @param list
 * @param options
 * @returns Array[Array[String]]
 */
export function deepKeysFromList(list: object[], options?: DeeksOptions, visited?: WeakSet<object>): string[][] {
    const parsedOptions = mergeOptions(options);
    const localVisited = visited ?? new WeakSet<object>();

    return list.map((document: object): string[] => { // for each document
        if (typeof document === 'object' && document !== null) {
            // avoid re-traversing objects we've already seen (circular refs)
            if (localVisited.has(document)) {
                return [];
            }

            // if the data at the key is a document, then we retrieve the subHeading starting with an empty string heading and the doc
            return generateDeepKeysList('', document as Record<string, unknown>, parsedOptions, localVisited);
        }
        return [];
    });
}

function generateDeepKeysList(heading: string, data: Record<string, unknown>, options: DeeksOptions, visited: WeakSet<object>): string[] {
    const result: string[] = [];

    // Iterative recursion simulation using an explicit stack of frames so we preserve
    // left-to-right processing order (matching the recursive implementation).
    interface Frame { obj: Record<string, unknown>; keys: string[]; i: number; basePath: string }
    const rootKeys = Object.keys(data);
    // mark root as visited to match recursive entry behavior
    visited.add(data as unknown as object);
    const stack: Frame[] = [{ obj: data, keys: rootKeys, i: 0, basePath: heading }];

    while (stack.length) {
        const frame = stack[stack.length - 1];

        if (frame.i >= frame.keys.length) {
            // finished this object
            stack.pop();
            continue;
        }

        const currentKey = frame.keys[frame.i++];
        const value = frame.obj[currentKey];
        const keyName = buildKeyName(frame.basePath, escapeNestedDotsIfSpecified(currentKey, options));

        // If nested document or array-as-object via arrayIndexesAsKeys, descend (push new frame)
        if ((options.expandNestedObjects && utils.isDocumentToRecurOn(value)) || (options.arrayIndexesAsKeys && Array.isArray(value) && (value as unknown[]).length)) {
            if (options.arrayIndexesAsKeys && Array.isArray(value)) {
                // treat array like an object with numeric keys
                const arr = value as unknown[];
                // push frames in reverse so they are processed in increasing index order
                for (let idx = arr.length - 1; idx >= 0; idx--) {
                    const elem = arr[idx];
                    const elemPath = buildKeyName(keyName, String(idx));
                    if (typeof elem === 'object' && elem !== null && !Array.isArray(elem)) {
                        if (!visited.has(elem as unknown as object)) {
                            visited.add(elem as unknown as object);
                            stack.push({ obj: elem as Record<string, unknown>, keys: Object.keys(elem as Record<string, unknown>), i: 0, basePath: elemPath });
                        }
                    } else {
                        // non-object -> behave like leaf (original recursion would have produced the index path)
                        result.push(elemPath);
                    }
                }
            } else {
                // value is an object -> push its frame (if not visited)
                if (!visited.has(value as unknown as object)) {
                    visited.add(value as unknown as object);
                    stack.push({ obj: value as Record<string, unknown>, keys: Object.keys(value as Record<string, unknown>), i: 0, basePath: keyName });
                }
            }
        } else if (options.expandArrayObjects && Array.isArray(value)) {
            // call helper and append its results in order
            const subKeys = processArrayKeys(value as object[], keyName, options, visited) as string[];
            for (const k of subKeys) {
                result.push(k as string);
            }
        } else if (options.ignoreEmptyArrays && Array.isArray(value) && !(value as unknown[]).length) {
            // skip
            continue;
        } else {
            // leaf key
            result.push(keyName);
        }
    }

    return utils.unique(result) as string[];
}

/**
 * Helper function to handle the processing of arrays when the expandArrayObjects
 * option is specified.
 * @param subArray
 * @param currentKeyPath
 * @param options
 * @returns {*}
 */
function processArrayKeys(subArray: object[], currentKeyPath: string, options: DeeksOptions, visited: WeakSet<object>) {
    let subArrayKeys = deepKeysFromList(subArray, options, visited);

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
