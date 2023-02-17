'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const deeks_1 = require("../deeks");
const assert_1 = __importDefault(require("assert"));
describe('deeks Module', () => {
    describe('deepKeys() - Objects', () => {
        describe('Default Options', () => {
            it('should retrieve no keys for null', (done) => {
                const keys = (0, deeks_1.deepKeys)(null);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 0);
                done();
            });
            it('should retrieve no keys for an empty object', (done) => {
                const testObj = {}, keys = (0, deeks_1.deepKeys)(testObj);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 0);
                done();
            });
            it('should retrieve no keys for a non-object', (done) => {
                const testObj = 'testing', keys = (0, deeks_1.deepKeys)(testObj);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 0);
                done();
            });
            it('should retrieve the keys for a single keyed object', (done) => {
                const testObj = { a: 1 }, keys = (0, deeks_1.deepKeys)(testObj);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, ['a']);
                done();
            });
            it('should retrieve the keys for a multiple keyed object', (done) => {
                const testObj = {
                    a: 1,
                    b: 2
                }, keys = (0, deeks_1.deepKeys)(testObj);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 2);
                assert_1.default.deepEqual(keys, ['a', 'b']);
                done();
            });
            it('should retrieve the keys for a multi-level object', (done) => {
                const testObj = {
                    a: 1,
                    b: 2,
                    c: {
                        d: 4
                    }
                }, keys = (0, deeks_1.deepKeys)(testObj);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 3);
                assert_1.default.deepEqual(keys, ['a', 'b', 'c.d']);
                done();
            });
            it('should retrieve the keys for a deep multi-level object', (done) => {
                const testObj = {
                    a: 1,
                    b: 2,
                    c: {
                        d: {
                            e: {
                                f: {
                                    g: 7
                                }
                            }
                        }
                    }
                }, keys = (0, deeks_1.deepKeys)(testObj);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 3);
                assert_1.default.deepEqual(keys, ['a', 'b', 'c.d.e.f.g']);
                done();
            });
            it('should retrieve the keys for objects containing an array of sub-objects', (done) => {
                const testObj = {
                    make: 'Nissan',
                    model: 'GT-R',
                    trim: 'NISMO',
                    specifications: [
                        { mileage: 10 },
                        { cylinders: '6' }
                    ]
                }, keys = (0, deeks_1.deepKeys)(testObj);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 4);
                assert_1.default.deepEqual(keys, ['make', 'model', 'trim', 'specifications']);
                done();
            });
            it('should not escape nested dots in key values when option not specified', (done) => {
                const testObj = {
                    'a.a': '2',
                    'a.b': {
                        c: '3',
                        'c.d': '4'
                    }
                }, keys = (0, deeks_1.deepKeys)(testObj);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 3);
                assert_1.default.deepEqual(keys, ['a.a', 'a.b.c', 'a.b.c.d']);
                done();
            });
            it('should include empty array key paths in the generated key list', (done) => {
                const testObj = {
                    a: {
                        b: [],
                        c: {
                            f: 4,
                            e: []
                        }
                    },
                    b: []
                }, keys = (0, deeks_1.deepKeys)(testObj);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 4);
                assert_1.default.deepEqual(keys, ['a.b', 'a.c.f', 'a.c.e', 'b']);
                done();
            });
        });
        describe('Custom Options', () => {
            it('[expandArrayObjects] options object should be passed to deepKeysFromList when processing an array', (done) => {
                const testObj = {
                    specifications: [
                        { make: 'Nissan' },
                        { model: 'GT-R' },
                        { trim: 'NISMO' },
                        { features: [
                                { name: 'Air Conditioning',
                                    notes: [
                                        { note: 'Ice cold!' }
                                    ] },
                                { name: 'Heat',
                                    notes: [
                                        { note: 'Warmer than the sun!' }
                                    ] }
                            ] }
                    ]
                }, options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 5);
                assert_1.default.deepEqual(keys, ['specifications.make', 'specifications.model', 'specifications.trim', 'specifications.features.name', 'specifications.features.notes.note']);
                done();
            });
            it('[expandArrayObjects] should retrieve the keys for objects containing an empty array', (done) => {
                const testObj = {
                    make: 'Nissan',
                    model: 'GT-R',
                    trim: 'NISMO',
                    specifications: []
                }, options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 4);
                assert_1.default.deepEqual(keys, ['make', 'model', 'trim', 'specifications']);
                done();
            });
            it('[expandArrayObjects] should retrieve the keys for objects containing an array of non-objects', (done) => {
                const testObj = {
                    make: 'Nissan',
                    model: 'GT-R',
                    trim: 'NISMO',
                    features: ['Insane horsepower', 'Fast acceleration']
                }, options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 4);
                assert_1.default.deepEqual(keys, ['make', 'model', 'trim', 'features']);
                done();
            });
            it('[expandArrayObjects] should retrieve the keys for objects containing an array of sub-objects', (done) => {
                const testObj = {
                    make: 'Nissan',
                    model: 'GT-R',
                    trim: 'NISMO',
                    specifications: [
                        { mileage: 10 },
                        { cylinders: '6' }
                    ]
                }, options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 5);
                assert_1.default.deepEqual(keys, ['make', 'model', 'trim', 'specifications.mileage', 'specifications.cylinders']);
                done();
            });
            it('[expandArrayObjects] should retrieve the keys for objects containing sub-objects with a multi-level array', (done) => {
                const testObj = {
                    make: 'Nissan',
                    model: 'GT-R',
                    trim: 'NISMO',
                    specifications: {
                        tierOne: [
                            { mileage: 10 },
                            { cylinders: '6' }
                        ]
                    }
                }, options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 5);
                assert_1.default.deepEqual(keys, ['make', 'model', 'trim', 'specifications.tierOne.mileage', 'specifications.tierOne.cylinders']);
                done();
            });
            it('[expandArrayObjects] should retrieve the keys for objects containing an array of sub-objects and a non-object', (done) => {
                const testObj = {
                    make: 'Nissan',
                    model: 'GT-R',
                    trim: 'NISMO',
                    specifications: [
                        { mileage: 10 },
                        { cylinders: '6' },
                        5
                    ]
                }, options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 6);
                assert_1.default.deepEqual(keys, ['make', 'model', 'trim', 'specifications.mileage', 'specifications.cylinders', 'specifications']);
                done();
            });
            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding] should retrieve the keys for objects containing an empty array', (done) => {
                const testObj = {
                    make: 'Nissan',
                    model: 'GT-R',
                    trim: 'NISMO',
                    specifications: []
                }, options = {
                    expandArrayObjects: true,
                    ignoreEmptyArraysWhenExpanding: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 3);
                assert_1.default.deepEqual(keys, ['make', 'model', 'trim']);
                done();
            });
            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding] should retrieve the keys for objects containing an array of non-objects', (done) => {
                const testObj = {
                    make: 'Nissan',
                    model: 'GT-R',
                    trim: 'NISMO',
                    features: ['Insane horsepower', 'Fast acceleration']
                }, options = {
                    expandArrayObjects: true,
                    ignoreEmptyArraysWhenExpanding: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 4);
                assert_1.default.deepEqual(keys, ['make', 'model', 'trim', 'features']);
                done();
            });
            it('[escapeNestedDots] should not escape nested dots in key values when option not specified', (done) => {
                const testObj = {
                    'a.a': '2',
                    'a.b': {
                        c: '3',
                        'c.d': '4'
                    }
                }, keys = (0, deeks_1.deepKeys)(testObj, { escapeNestedDots: true });
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 3);
                assert_1.default.deepEqual(keys, ['a\\.a', 'a\\.b.c', 'a\\.b.c\\.d']);
                done();
            });
            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding, escapeNestedDots] should retrieve the keys for objects containing an array of non-objects', (done) => {
                const testObj = {
                    make: 'Nissan',
                    model: 'GT-R',
                    'model.trim': 'NISMO',
                    'features.exterior': ['Insane horsepower', 'Fast acceleration'],
                    'oem.options': {
                        'cost.total': '3200',
                        'cost.minusRebates': '1295'
                    }
                }, options = {
                    expandArrayObjects: true,
                    ignoreEmptyArraysWhenExpanding: true,
                    escapeNestedDots: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 6);
                assert_1.default.deepEqual(keys, ['make', 'model', 'model\\.trim', 'features\\.exterior', 'oem\\.options.cost\\.total', 'oem\\.options.cost\\.minusRebates']);
                done();
            });
            it('[ignoreEmptyArrays] should ignore empty arrays when generating key list and when specified', (done) => {
                const testObj = {
                    a: {
                        b: [],
                        c: {
                            f: 4,
                            e: []
                        }
                    },
                    b: []
                }, options = {
                    ignoreEmptyArrays: true
                }, keys = (0, deeks_1.deepKeys)(testObj, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, ['a.c.f']);
                done();
            });
        });
    });
    describe('deepKeysFromList() - List of Objects', () => {
        describe('Default Options', () => {
            it('should retrieve no keys for an empty array', (done) => {
                const testList = [], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 0);
                done();
            });
            it('should retrieve no keys for an array of a non-object', (done) => {
                const testList = ['testing'], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [[]]);
                done();
            });
            it('should retrieve no keys for an array of one empty object', (done) => {
                const testList = [{}], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [[]]);
                done();
            });
            it('should retrieve keys for an array of one object', (done) => {
                const testList = [
                    { a: 1 }
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['a']]);
                done();
            });
            it('should retrieve keys for an array of one object and no keys for a string', (done) => {
                const testList = [
                    { a: 1 },
                    'testing'
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 2);
                assert_1.default.deepEqual(keys, [['a'], []]);
                done();
            });
            it('should retrieve keys for an array of one object with multiple single-level keys', (done) => {
                const testList = [
                    {
                        a: 1,
                        b: 2
                    }
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['a', 'b']]);
                done();
            });
            it('should retrieve keys for an array of one object with multi-level keys', (done) => {
                const testList = [
                    {
                        a: 1,
                        b: {
                            c: {
                                d: 4
                            }
                        }
                    }
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['a', 'b.c.d']]);
                done();
            });
            it('should retrieve keys for an array of two objects with multi-level keys', (done) => {
                const testList = [
                    {
                        a: 1,
                        b: {
                            c: {
                                d: 4
                            }
                        }
                    },
                    {
                        e: 2,
                        f: {
                            g: {
                                h: 8
                            }
                        }
                    }
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 2);
                assert_1.default.deepEqual(keys, [['a', 'b.c.d'], ['e', 'f.g.h']]);
                done();
            });
            it('should retrieve keys for an array of one object with an array of objects', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: [
                            { mileage: 10 },
                            { cylinders: '6' }
                        ]
                    }
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim', 'specifications']]);
                done();
            });
            it('should retrieve keys for an array of one object with an array of multi-level objects and a non-object', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: [
                            {
                                odometer: {
                                    miles: 10,
                                    km: 22
                                }
                            },
                            { cylinders: '6' },
                            5
                        ]
                    }
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim', 'specifications']]);
                done();
            });
            it('should return the key name for the field with an array value if it contains a non-document value', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        rebates: [
                            500,
                            500,
                            1500
                        ]
                    }
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim', 'rebates']]);
                done();
            });
            it('should not escape nested dots in key values when option not specified', (done) => {
                const testList = [
                    {
                        'a.a': '2',
                        'a.b': {
                            c: '3',
                            'c.d': '4'
                        }
                    }
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['a.a', 'a.b.c', 'a.b.c.d']]);
                done();
            });
            it('should include empty array key paths in the generated key list', (done) => {
                const testList = [
                    {
                        a: {
                            b: [],
                            c: {
                                f: 4,
                                e: []
                            }
                        },
                        b: []
                    }
                ], keys = (0, deeks_1.deepKeysFromList)(testList);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['a.b', 'a.c.f', 'a.c.e', 'b']]);
                done();
            });
        });
        describe('Custom Options', () => {
            it('[expandArrayObjects] should retrieve keys for an array of one object with an empty array', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: []
                    }
                ], options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeysFromList)(testList, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim', 'specifications']]);
                done();
            });
            it('[expandArrayObjects] should retrieve keys for an array of one object with an array of non-objects', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        features: ['Insane horsepower', 'Fast acceleration']
                    }
                ], options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeysFromList)(testList, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim', 'features']]);
                done();
            });
            it('[expandArrayObjects] should retrieve keys for an array of one object with an array of objects', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: [
                            { mileage: 10 },
                            { cylinders: '6' }
                        ]
                    }
                ], options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeysFromList)(testList, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim', 'specifications.mileage', 'specifications.cylinders']]);
                done();
            });
            it('[expandArrayObjects] should retrieve keys for an array of one object with sub-object containing an object of a multi-level array', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: {
                            tierOne: [
                                {
                                    odometer: {
                                        miles: 10,
                                        km: 22
                                    }
                                },
                                { cylinders: '6' }
                            ]
                        }
                    }
                ], options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeysFromList)(testList, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim', 'specifications.tierOne.odometer.miles', 'specifications.tierOne.odometer.km', 'specifications.tierOne.cylinders']]);
                done();
            });
            it('[expandArrayObjects] should retrieve keys for an array of one object with an array of multi-level objects and a non-object', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: [
                            {
                                odometer: {
                                    miles: 10,
                                    km: 22
                                }
                            },
                            { cylinders: '6' },
                            5
                        ]
                    }
                ], options = {
                    expandArrayObjects: true
                }, keys = (0, deeks_1.deepKeysFromList)(testList, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim', 'specifications.odometer.miles', 'specifications.odometer.km', 'specifications.cylinders', 'specifications']]);
                done();
            });
            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding] should retrieve keys for an array of one object with an empty array', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: []
                    }
                ], options = {
                    expandArrayObjects: true,
                    ignoreEmptyArraysWhenExpanding: true
                }, keys = (0, deeks_1.deepKeysFromList)(testList, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim']]);
                done();
            });
            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding] should retrieve keys for an array of one object with an array of non-objects', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        features: ['Insane horsepower', 'Fast acceleration']
                    }
                ], options = {
                    expandArrayObjects: true,
                    ignoreEmptyArraysWhenExpanding: true
                }, keys = (0, deeks_1.deepKeysFromList)(testList, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'trim', 'features']]);
                done();
            });
            it('[escapeNestedDots] should not escape nested dots in key values when option not specified', (done) => {
                const testList = [
                    {
                        'a.a': '2',
                        'a.b': {
                            c: '3',
                            'c.d': '4'
                        }
                    }
                ], keys = (0, deeks_1.deepKeysFromList)(testList, { escapeNestedDots: true });
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['a\\.a', 'a\\.b.c', 'a\\.b.c\\.d']]);
                done();
            });
            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding, escapeNestedDots] should retrieve keys for an array of one object with an array of non-objects', (done) => {
                const testList = [
                    {
                        make: 'Nissan',
                        model: 'GT-R',
                        'model.trim': 'NISMO',
                        'features.exterior': ['Insane horsepower', 'Fast acceleration'],
                        'oem.options': {
                            'cost.total': '3200',
                            'cost.minusRebates': '1295'
                        }
                    }
                ], options = {
                    expandArrayObjects: true,
                    ignoreEmptyArraysWhenExpanding: true,
                    escapeNestedDots: true
                }, keys = (0, deeks_1.deepKeysFromList)(testList, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['make', 'model', 'model\\.trim', 'features\\.exterior', 'oem\\.options.cost\\.total', 'oem\\.options.cost\\.minusRebates']]);
                done();
            });
            it('[ignoreEmptyArrays] should not include empty array key paths in the generated key list when specified', (done) => {
                const testList = [
                    {
                        a: {
                            b: [],
                            c: {
                                f: 4,
                                e: []
                            }
                        },
                        b: []
                    }
                ], options = {
                    ignoreEmptyArrays: true
                }, keys = (0, deeks_1.deepKeysFromList)(testList, options);
                assert_1.default.equal(Array.isArray(keys), true);
                assert_1.default.equal(keys.length, 1);
                assert_1.default.deepEqual(keys, [['a.c.f']]);
                done();
            });
        });
    });
});
//# sourceMappingURL=index.js.map