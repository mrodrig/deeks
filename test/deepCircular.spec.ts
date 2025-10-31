'use strict';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { deepKeys, deepKeysFromList } from '../src/deeks';
import assert from 'assert';

describe('deep circular stress (automated)', function () {
    // allow extra time for building large chains on slower CI
    this.timeout(20000);

    it('handles a very deep circular chain without stack overflow', () => {
        const depth = 5000;
        const root: any = { root: true };
        let current = root;
        for (let i = 0; i < depth; i++) {
            const next: any = { ['k' + i]: i };
            current.child = next;
            current = next;
        }

        // close the cycle back to root
        current.child = root;

        const keys = deepKeys(root, { expandNestedObjects: true });

        assert.equal(Array.isArray(keys), true);
        // expect root + depth entries
        assert.equal((keys as string[]).length, depth + 1);
    });

    // Integrate additional coverage-focused tests here so they run under the
    // same "deep circular stress (automated)" section.
    it('deepKeysFromList returns [] for repeated documents (visited guard)', () => {
        const obj: any = { a: 1 };
        const list = [obj, obj];

        const keys = deepKeysFromList(list as object[]);

        assert.equal(Array.isArray(keys), true);
        assert.deepEqual(keys, [['a'], []]);
    });

    it('arrayIndexesAsKeys includes numeric index paths for non-object entries', () => {
        const testObj = {
            list: [{ a: 1 }, 5]
        };

        const keys = deepKeys(testObj, { arrayIndexesAsKeys: true });

        assert.equal(Array.isArray(keys), true);
        // expect the object entry to yield 'list.0.a' and the non-object entry to yield 'list.1'
        assert.deepEqual(keys.sort(), ['list.0.a', 'list.1'].sort());
    });

    it('arrayIndexesAsKeys works for primitive-only arrays (index path)', () => {
        const testObj = { arr: [1] };
        const keys = deepKeys(testObj, { arrayIndexesAsKeys: true });

        assert.equal(Array.isArray(keys), true);
        assert.deepEqual(keys, ['arr.0']);
    });

    it('arrayIndexesAsKeys works for nested primitive arrays', () => {
        const testObj = { outer: { arr: [1] } };
        const keys = deepKeys(testObj, { arrayIndexesAsKeys: true });

        assert.equal(Array.isArray(keys), true);
        assert.deepEqual(keys, ['outer.arr.0']);
    });

    it('arrayIndexesAsKeys does not re-traverse the same object repeated in an array', () => {
        const shared = { a: 1 };
        const testObj = { arr: [shared, shared] };
        const keys = deepKeys(testObj, { arrayIndexesAsKeys: true });

        // Only one set of keys should be produced for the shared object
        assert.equal(Array.isArray(keys), true);
        assert.deepEqual(keys.sort(), ['arr.1.a'].sort());
    });

    it('does not re-traverse the same nested object (visited prevents duplicate traversal)', () => {
        const shared: any = { x: 1 };
        const testObj: any = { a: shared, b: shared };

        const keys = deepKeys(testObj);

        assert.equal(Array.isArray(keys), true);
        // 'a.x' should be present but 'b.x' should not because the object was already visited
        assert.deepEqual(keys, ['a.x']);
    });
});
