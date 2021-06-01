'use strict';

const deeks = require('../lib/deeks.js'),
    /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }]*/
    should = require('should');

describe('deeks Module', () => {
    describe('deepKeys() - Objects', () => {
        describe('Default Options', () => {
            it('should retrieve no keys for an empty object', (done) => {
                let testObj = {},
                    keys = deeks.deepKeys(testObj);

                keys.should.be.an.instanceOf(Array)
                    .and.have.lengthOf(0);
                done();
            });

            it('should retrieve no keys for a non-object', (done) => {
                let testObj = 'testing',
                    keys = deeks.deepKeys(testObj);

                keys.should.be.an.instanceOf(Array)
                    .and.have.lengthOf(0);
                done();
            });

            it('should retrieve the keys for a single keyed object', (done) => {
                let testObj = { a: 1 },
                    keys = deeks.deepKeys(testObj);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('a')
                    .and.have.lengthOf(1);
                done();
            });

            it('should retrieve the keys for a multiple keyed object', (done) => {
                let testObj = {
                        a: 1,
                        b: 2
                    },
                    keys = deeks.deepKeys(testObj);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('a')
                    .and.containEql('b')
                    .and.have.lengthOf(2);
                done();
            });

            it('should retrieve the keys for a multi-level object', (done) => {
                let testObj = {
                        a: 1,
                        b: 2,
                        c: {
                            d: 4
                        }
                    },
                    keys = deeks.deepKeys(testObj);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('a')
                    .and.containEql('b')
                    .and.containEql('c.d')
                    .and.have.lengthOf(3);
                done();
            });

            it('should retrieve the keys for a deep multi-level object', (done) => {
                let testObj = {
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
                    },
                    keys = deeks.deepKeys(testObj);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('a')
                    .and.containEql('b')
                    .and.containEql('c.d.e.f.g')
                    .and.have.lengthOf(3);
                done();
            });

            it('should retrieve the keys for objects containing an array of sub-objects', (done) => {
                let testObj = {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: [
                            { mileage: 10 },
                            { cylinders: '6' }
                        ]
                    },
                    keys = deeks.deepKeys(testObj);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('make')
                    .and.containEql('model')
                    .and.containEql('trim')
                    .and.containEql('specifications')
                    .and.have.lengthOf(4);
                done();
            });

            it('should not escape nested dots in key values when option not specified', (done) => {
                let testObj = {
                        'a.a': '2',
                        'a.b': {
                            c: '3',
                            'c.d': '4'
                        }
                    },
                    keys = deeks.deepKeys(testObj);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('a.a')
                    .and.containEql('a.b.c')
                    .and.containEql('a.b.c.d')
                    .and.have.lengthOf(3);
                done();
            });

            it('should include empty array key paths in the generated key list', (done) => {
                let testObj = {
                        a: {
                            b: [],
                            c: {
                                f: 4,
                                e: []
                            }
                        },
                        b: []
                    },
                    keys = deeks.deepKeys(testObj);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('a.b')
                    .and.containEql('a.c.f')
                    .and.containEql('a.c.e')
                    .and.containEql('b')
                    .and.have.lengthOf(4);
                done();
            });
        });

        describe('Custom Options', () => {
            it('[expandArrayObjects] options object should be passed to deepKeysFromList when processing an array', (done) => {
                let testObj = {
                        specifications: [
                            { make: 'Nissan' },
                            { model: 'GT-R' },
                            { trim: 'NISMO' },
                            { features: [
                                {name: 'Air Conditioning',
                                    notes: [
                                        { note: 'Ice cold!' }
                                    ]},
                                {name: 'Heat',
                                    notes: [
                                        { note: 'Warmer than the sun!' }
                                    ]}
                            ]}
                        ]
                    },
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('specifications.make')
                    .and.containEql('specifications.model')
                    .and.containEql('specifications.trim')
                    .and.containEql('specifications.features.name')
                    .and.containEql('specifications.features.notes.note')
                    .and.have.lengthOf(5);
                done();
            });

            it('[expandArrayObjects] should retrieve the keys for objects containing an empty array', (done) => {
                let testObj = {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: []
                    },
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('make')
                    .and.containEql('model')
                    .and.containEql('trim')
                    .and.containEql('specifications')
                    .and.have.lengthOf(4);
                done();
            });

            it('[expandArrayObjects] should retrieve the keys for objects containing an array of non-objects', (done) => {
                let testObj = {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        features: ['Insane horsepower', 'Fast acceleration']
                    },
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('make')
                    .and.containEql('model')
                    .and.containEql('trim')
                    .and.containEql('features')
                    .and.have.lengthOf(4);
                done();
            });

            it('[expandArrayObjects] should retrieve the keys for objects containing an array of sub-objects', (done) => {
                let testObj = {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: [
                            { mileage: 10 },
                            { cylinders: '6' }
                        ]
                    },
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('make')
                    .and.containEql('model')
                    .and.containEql('trim')
                    .and.containEql('specifications.mileage')
                    .and.containEql('specifications.cylinders')
                    .and.have.lengthOf(5);
                done();
            });

            it('[expandArrayObjects] should retrieve the keys for objects containing sub-objects with a multi-level array', (done) => {
                let testObj = {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: {
                            tierOne: [
                                { mileage: 10 },
                                { cylinders: '6' }
                            ]
                        }
                    },
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('make')
                    .and.containEql('model')
                    .and.containEql('trim')
                    .and.containEql('specifications.tierOne.mileage')
                    .and.containEql('specifications.tierOne.cylinders')
                    .and.have.lengthOf(5);
                done();
            });

            it('[expandArrayObjects] should retrieve the keys for objects containing an array of sub-objects and a non-object', (done) => {
                let testObj = {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: [
                            { mileage: 10 },
                            { cylinders: '6' },
                            5
                        ]
                    },
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('make')
                    .and.containEql('model')
                    .and.containEql('trim')
                    .and.containEql('specifications.mileage')
                    .and.containEql('specifications.cylinders')
                    .and.containEql('specifications')
                    .and.have.lengthOf(6);
                done();
            });

            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding] should retrieve the keys for objects containing an empty array', (done) => {
                let testObj = {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        specifications: []
                    },
                    options = {
                        expandArrayObjects: true,
                        ignoreEmptyArraysWhenExpanding: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('make')
                    .and.containEql('model')
                    .and.containEql('trim')
                    .and.have.lengthOf(3);
                done();
            });

            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding] should retrieve the keys for objects containing an array of non-objects', (done) => {
                let testObj = {
                        make: 'Nissan',
                        model: 'GT-R',
                        trim: 'NISMO',
                        features: ['Insane horsepower', 'Fast acceleration']
                    },
                    options = {
                        expandArrayObjects: true,
                        ignoreEmptyArraysWhenExpanding: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('make')
                    .and.containEql('model')
                    .and.containEql('trim')
                    .and.containEql('features')
                    .and.have.lengthOf(4);
                done();
            });

            it('[escapeNestedDots] should not escape nested dots in key values when option not specified', (done) => {
                let testObj = {
                        'a.a': '2',
                        'a.b': {
                            c: '3',
                            'c.d': '4'
                        }
                    },
                    keys = deeks.deepKeys(testObj, {escapeNestedDots: true});

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('a\\.a')
                    .and.containEql('a\\.b.c')
                    .and.containEql('a\\.b.c\\.d')
                    .and.have.lengthOf(3);
                done();
            });

            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding, escapeNestedDots] should retrieve the keys for objects containing an array of non-objects', (done) => {
                let testObj = {
                        make: 'Nissan',
                        model: 'GT-R',
                        'model.trim': 'NISMO',
                        'features.exterior': ['Insane horsepower', 'Fast acceleration'],
                        'oem.options': {
                            'cost.total': '3200',
                            'cost.minusRebates': '1295'
                        }
                    },
                    options = {
                        expandArrayObjects: true,
                        ignoreEmptyArraysWhenExpanding: true,
                        escapeNestedDots: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('make')
                    .and.containEql('model')
                    .and.containEql('model\\.trim')
                    .and.containEql('features\\.exterior')
                    .and.containEql('oem\\.options.cost\\.total')
                    .and.containEql('oem\\.options.cost\\.minusRebates')
                    .and.have.lengthOf(6);
                done();
            });

            it('[ignoreEmptyArrays] should ignore empty arrays when generating key list and when specified', (done) => {
                let testObj = {
                        a: {
                            b: [],
                            c: {
                                f: 4,
                                e: []
                            }
                        },
                        b: []
                    },
                    options = {
                        ignoreEmptyArrays: true
                    },
                    keys = deeks.deepKeys(testObj, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql('a.c.f')
                    .and.have.lengthOf(1);
                done();
            });
        });
    });

    describe('deepKeysFromList() - List of Objects', () => {
        describe('Default Options', () => {
            it('should retrieve no keys for an empty array', (done) => {
                let testList = [],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.have.lengthOf(0);
                done();
            });

            it('should retrieve no keys for an array of a non-object', (done) => {
                let testList = ['testing'],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql([])
                    .and.have.lengthOf(1);
                done();
            });

            it('should retrieve no keys for an array of one empty object', (done) => {
                let testList = [{}],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql([])
                    .and.have.lengthOf(1);
                done();
            });

            it('should retrieve keys for an array of one object', (done) => {
                let testList = [
                        { a: 1 }
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['a'])
                    .and.have.lengthOf(1);
                done();
            });

            it('should retrieve keys for an array of one object and no keys for a string', (done) => {
                let testList = [
                        { a: 1 },
                        'testing'
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['a'])
                    .and.containEql([])
                    .and.have.lengthOf(2);
                done();
            });

            it('should retrieve keys for an array of one object with multiple single-level keys', (done) => {
                let testList = [
                        {
                            a: 1,
                            b: 2
                        }
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['a', 'b'])
                    .and.have.lengthOf(1);
                done();
            });

            it('should retrieve keys for an array of one object with multi-level keys', (done) => {
                let testList = [
                        {
                            a: 1,
                            b: {
                                c: {
                                    d: 4
                                }
                            }
                        }
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['a', 'b.c.d'])
                    .and.have.lengthOf(1);
                done();
            });

            it('should retrieve keys for an array of two objects with multi-level keys', (done) => {
                let testList = [
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
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['a', 'b.c.d'])
                    .and.containEql(['e', 'f.g.h'])
                    .and.have.lengthOf(2);
                done();
            });

            it('should retrieve keys for an array of one object with an array of objects', (done) => {
                let testList = [
                        {
                            make: 'Nissan',
                            model: 'GT-R',
                            trim: 'NISMO',
                            specifications: [
                                { mileage: 10 },
                                { cylinders: '6' }
                            ]
                        }
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim', 'specifications'])
                    .and.have.lengthOf(1);
                done();
            });

            it('should retrieve keys for an array of one object with an array of multi-level objects and a non-object', (done) => {
                let testList = [
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
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim', 'specifications'])
                    .and.have.lengthOf(1);
                done();
            });

            it('should return the key name for the field with an array value if it contains a non-document value', (done) => {
                let testList = [
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
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim', 'rebates'])
                    .and.have.lengthOf(1);
                done();
            });

            it('should not escape nested dots in key values when option not specified', (done) => {
                let testList = [
                        {
                            'a.a': '2',
                            'a.b': {
                                c: '3',
                                'c.d': '4'
                            }
                        }
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['a.a', 'a.b.c', 'a.b.c.d'])
                    .and.have.lengthOf(1);
                done();
            });

            it('should include empty array key paths in the generated key list', (done) => {
                let testList = [
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
                    ],
                    keys = deeks.deepKeysFromList(testList);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['a.b', 'a.c.f', 'a.c.e', 'b'])
                    .and.have.lengthOf(1);
                done();
            });
        });

        describe('Custom Options', () => {
            it('[expandArrayObjects] should retrieve keys for an array of one object with an empty array', (done) => {
                let testList = [
                        {
                            make: 'Nissan',
                            model: 'GT-R',
                            trim: 'NISMO',
                            specifications: []
                        }
                    ],
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeysFromList(testList, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim', 'specifications'])
                    .and.have.lengthOf(1);
                done();
            });

            it('[expandArrayObjects] should retrieve keys for an array of one object with an array of non-objects', (done) => {
                let testList = [
                        {
                            make: 'Nissan',
                            model: 'GT-R',
                            trim: 'NISMO',
                            features: ['Insane horsepower', 'Fast acceleration']
                        }
                    ],
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeysFromList(testList, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim', 'features'])
                    .and.have.lengthOf(1);
                done();
            });

            it('[expandArrayObjects] should retrieve keys for an array of one object with an array of objects', (done) => {
                let testList = [
                        {
                            make: 'Nissan',
                            model: 'GT-R',
                            trim: 'NISMO',
                            specifications: [
                                { mileage: 10 },
                                { cylinders: '6' }
                            ]
                        }
                    ],
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeysFromList(testList, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim', 'specifications.mileage', 'specifications.cylinders'])
                    .and.have.lengthOf(1);
                done();
            });

            it('[expandArrayObjects] should retrieve keys for an array of one object with sub-object containing an object of a multi-level array', (done) => {
                let testList = [
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
                    ],
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeysFromList(testList, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim', 'specifications.tierOne.odometer.miles', 'specifications.tierOne.odometer.km', 'specifications.tierOne.cylinders'])
                    .and.have.lengthOf(1);
                done();
            });

            it('[expandArrayObjects] should retrieve keys for an array of one object with an array of multi-level objects and a non-object', (done) => {
                let testList = [
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
                    ],
                    options = {
                        expandArrayObjects: true
                    },
                    keys = deeks.deepKeysFromList(testList, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim', 'specifications.odometer.miles', 'specifications.odometer.km', 'specifications.cylinders', 'specifications'])
                    .and.have.lengthOf(1);
                done();
            });

            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding] should retrieve keys for an array of one object with an empty array', (done) => {
                let testList = [
                        {
                            make: 'Nissan',
                            model: 'GT-R',
                            trim: 'NISMO',
                            specifications: []
                        }
                    ],
                    options = {
                        expandArrayObjects: true,
                        ignoreEmptyArraysWhenExpanding: true
                    },
                    keys = deeks.deepKeysFromList(testList, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim'])
                    .and.have.lengthOf(1);
                done();
            });

            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding] should retrieve keys for an array of one object with an array of non-objects', (done) => {
                let testList = [
                        {
                            make: 'Nissan',
                            model: 'GT-R',
                            trim: 'NISMO',
                            features: ['Insane horsepower', 'Fast acceleration']
                        }
                    ],
                    options = {
                        expandArrayObjects: true,
                        ignoreEmptyArraysWhenExpanding: true
                    },
                    keys = deeks.deepKeysFromList(testList, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'trim', 'features'])
                    .and.have.lengthOf(1);
                done();
            });

            it('[escapeNestedDots] should not escape nested dots in key values when option not specified', (done) => {
                let testList = [
                        {
                            'a.a': '2',
                            'a.b': {
                                c: '3',
                                'c.d': '4'
                            }
                        }
                    ],
                    keys = deeks.deepKeysFromList(testList, {escapeNestedDots: true});

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['a\\.a', 'a\\.b.c', 'a\\.b.c\\.d'])
                    .and.have.lengthOf(1);
                done();
            });

            it('[expandArrayObjects, ignoreEmptyArraysWhenExpanding, escapeNestedDots] should retrieve keys for an array of one object with an array of non-objects', (done) => {
                let testList = [
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
                    ],
                    options = {
                        expandArrayObjects: true,
                        ignoreEmptyArraysWhenExpanding: true,
                        escapeNestedDots: true
                    },
                    keys = deeks.deepKeysFromList(testList, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['make', 'model', 'model\\.trim', 'features\\.exterior', 'oem\\.options.cost\\.total', 'oem\\.options.cost\\.minusRebates'])
                    .and.have.lengthOf(1);
                done();
            });

            it('[ignoreEmptyArrays] should not include empty array key paths in the generated key list when specified', (done) => {
                let testList = [
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
                    ],
                    options = {
                        ignoreEmptyArrays: true
                    },
                    keys = deeks.deepKeysFromList(testList, options);

                keys.should.be.an.instanceOf(Array)
                    .and.containEql(['a.c.f'])
                    .and.have.lengthOf(1);
                done();
            });
        });
    });
});
