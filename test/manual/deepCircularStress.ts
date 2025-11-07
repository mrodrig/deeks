'use strict';

/**
 * MANUAL TEST: deepCircularStress
 *
 * This is a manual stress test that constructs a very deep circular
 * object chain and runs `deepKeys` against it to exercise the
 * iterative traversal and confirm it doesn't hit the JS call stack
 * limit.
 *
 * IMPORTANT:
 * - This file is intended to be run manually (it can be slow on CI).
 * - It is placed under `test/manual/` and excluded from published
 *   packages via `.npmignore` so it won't be run automatically.
 *
 * How to run locally:
 *   # run with the default depth (5000)
 *   npx ts-node test/manual/deepCircularStress.ts
 *
 *   # or override depth using DEPTH env var
 *   DEPTH=10000 npx ts-node test/manual/deepCircularStress.ts
 *
 * Exit codes:
 * - 0: success
 * - 2: deepKeys threw an exception (e.g. RangeError)
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { deepKeys } from '../../src/deeks';

const depth = Number(process.env.DEPTH) || 5000;
console.log(`Building circular chain with depth=${depth}`);

const root: any = { root: true };
let current = root;
for (let i = 0; i < depth; i++) {
    const next: any = { ['k' + i]: i };
    current.child = next;
    current = next;
}

// close the cycle back to root
current.child = root;

try {
    console.time('deepKeys');
    const keys = deepKeys(root, { expandNestedObjects: true });
    console.timeEnd('deepKeys');
    console.log('returned keys count:', Array.isArray(keys) ? keys.length : 'not-array');
    if (Array.isArray(keys)) {
        console.log('sample keys:', keys.slice(0, 10));
    }
    process.exit(0);
} catch (err: any) {
    console.error('deepKeys threw:', err && err.stack ? err.stack.split('\n')[0] : err);
    process.exit(2);
}
