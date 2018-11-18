# deeks - Deep Object Key Extraction

[![Dependencies](https://img.shields.io/david/mrodrig/deeks.svg?style=flat-square)](https://www.npmjs.org/package/deeks)
[![Downloads](http://img.shields.io/npm/dm/deeks.svg)](https://www.npmjs.org/package/deeks)
[![NPM version](https://img.shields.io/npm/v/deeks.svg)](https://www.npmjs.org/package/deeks)
[![Maintainability](https://api.codeclimate.com/v1/badges/830bc7f29f61466986ac/maintainability)](https://codeclimate.com/github/mrodrig/deeks/maintainability)

**Retrieve all keys and nested keys from objects and arrays of objects.**

## Installing

```bash
npm install --save deeks
```

Example: 
```javascript
let keys = require('deeks');

keys.deepKeys({
	make: 'Nissan',
	model: 'GT-R',
	trim: 'NISMO',
	specifications: {
	    mileage: 10,
	    cylinders: '6'
	}
})
// => ['make', 'model', 'trim', 'specifications.mileage', 'specifications.cylinders']
```

## API

### deepKeys(object) 

`keys.deepKeys(object)`

Returns all keys in an object, even if they're nested several layers deep. 
The array of keys that is returned can then be used with the 
[`doc-path`](https://github.com/mrodrig/doc-path) module to get and set values 
at a specific key path.

Returns: `Array[String]`

Example: `['make', 'model', 'specifications.odometer.miles', 'specifications.odometer.kilometers']`

### deepKeysFromList(array) 

`keys.deepKeysFromList(array)`

Returns all keys in each object in the array, even if the keys are nested 
several layers deep in each of the documents. These can also be used with the 
[`doc-path`](https://github.com/mrodrig/doc-path) module.

Returns: `Array[Array[String]]`

Example: `[ ['make', 'model', 'specifications.odometer.miles', 'specifications.odometer.kilometers'] ]`

## Examples

This module integrates really nicely with the 
[`doc-path`](https://github.com/mrodrig/doc-path) module, which allows
the programmatic getting and setting of key paths produced by this module.

Here's an example of how this works:

```javascript
const path = require('doc-path'),
      keys = require('deeks');

let car = {
		make: 'Nissan',
		model: 'GT-R',
		trim: 'NISMO',
		specifications: {
			mileage: 10,
			cylinders: '6'
		}
	},
	
	carKeys = keys.deepKeys(car);

for(let keyPath of carKeys) {
    // Clear all values
    path.setPath(car, keyPath, '');
}
```

## Tests

```bash
$ npm test
```

_Note_: This requires `mocha`, `should`, and `underscore`.

To see test coverage, please run:
```bash
$ npm run coverage
```

Current Coverage is:
```
Statements   : 100% ( 24/24 )
Branches     : 100% ( 13/13 )
Functions    : 100% ( 7/7 )
Lines        : 100% ( 24/24 )
```