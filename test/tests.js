const deeks = require('../src/deeks.js'),

    should = require('should');

describe('deeks Module', function() {
    describe('Objects', function () {
        it('should retrieve no keys for an empty object', function (done) {
            let testObj = {},
                keys = deeks.deepKeys(testObj);

            keys.should.be.an.instanceOf(Array)
                .and.have.lengthOf(0);
            done();
        });

        it('should retrieve no keys for a non-object', function (done) {
            let testObj = 'testing',
                keys = deeks.deepKeys(testObj);

            keys.should.be.an.instanceOf(Array)
                .and.have.lengthOf(0);
            done();
        });

        it('should retrieve the keys for a single keyed object', function (done) {
            let testObj = { a: 1 },
                keys = deeks.deepKeys(testObj);

            keys.should.be.an.instanceOf(Array)
                .and.containEql('a')
                .and.have.lengthOf(1);
            done();
        });

        it('should retrieve the keys for a multiple keyed object', function (done) {
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

        it('should retrieve the keys for a multi-level object', function (done) {
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

        it('should retrieve the keys for a deep multi-level object', function (done) {
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
    });

    describe('List of Objects', function () {
        it('should retrieve no keys for an empty array', function (done) {
            let testList = [],
                keys = deeks.deepKeysFromList(testList);

            keys.should.be.an.instanceOf(Array)
                .and.have.lengthOf(0);
            done();
        });

        it('should retrieve no keys for an array of a non-object', function (done) {
            let testList = ['testing'],
                keys = deeks.deepKeysFromList(testList);

            keys.should.be.an.instanceOf(Array)
                .and.containEql([])
                .and.have.lengthOf(1);
            done();
        });

        it('should retrieve no keys for an array of one empty object', function (done) {
            let testList = [{}],
                keys = deeks.deepKeysFromList(testList);

            keys.should.be.an.instanceOf(Array)
                .and.containEql([])
                .and.have.lengthOf(1);
            done();
        });

        it('should retrieve keys for an array of one object', function (done) {
            let testList = [
                    { a: 1 }
                ],
                keys = deeks.deepKeysFromList(testList);

            keys.should.be.an.instanceOf(Array)
                .and.containEql(['a'])
                .and.have.lengthOf(1);
            done();
        });

        it('should retrieve keys for an array of one object and no keys for a string', function (done) {
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

        it('should retrieve no keys for an array of one object with multiple single-level keys', function (done) {
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

        it('should retrieve no keys for an array of one object with multi-level keys', function (done) {
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

        it('should retrieve no keys for an array of one object with multi-level keys', function (done) {
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
    });
});