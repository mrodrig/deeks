'use strict';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { deepKeys } from '../src/deeks';
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
});
