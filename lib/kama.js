// =================================================================================================
// File: kama.js
// Author: Jonathan Alaimo
// Created: 5.19.2015
//
// Description: Simple localization for Node JS
// License:
// 		The MIT License (MIT)
//
// 		Copyright (c) 2015 Jonathan Alaimo
//
// 		Permission is hereby granted, free of charge, to any person obtaining a copy
// 		of this software and associated documentation files (the "Software"), to deal
// 		in the Software without restriction, including without limitation the rights
// 		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// 		copies of the Software, and to permit persons to whom the Software is
// 		furnished to do so, subject to the following conditions:
//
// 		The above copyright notice and this permission notice shall be included in all
// 		copies or substantial portions of the Software.
//
// 		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// 		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// 		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// 		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// 		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// 		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// 		SOFTWARE.
// =================================================================================================

var nunjucks = require('nunjucks'),
	path = require('path'),
	fs = require('fs'),
	pub = {};

// define the Res class
function Kama(files, opts) {
	if(files || opts) {
		this.configure(files, opts);
	}
}

Kama.prototype = {};

Kama.prototype.constructor = Kama;

Kama.prototype.Kama = Kama;

Kama.prototype.env = nunjucks;

Kama.prototype.keys = [];

Kama.prototype.defaultLocale = 'en_US';

Kama.prototype.missingKeyCallback = function(key) {
	return key;
}

Kama.prototype.configure = function(files, opts) {
	var filePaths,
		cwd;

	if(files) {
		cwd = process.cwd();
		filePaths = Array.isArray(files) ? files : [files];

		// synchronously read and merge all resource strings
		this.keys = filePaths.map(function(file) {
			try {
				return JSON.parse(fs.readFileSync(path.resolve(cwd, file), 'utf-8'));
			} catch (err) {
				console.log('Kama::Failed to load resource: ', err);
			}
			return {};
		}).
		reverse();
	}

	if(opts) {
		// if an environment is passed, ignore tag overrides
		if(opts.env) {
			this.env = opts.env;
		} else if(opts.tags) {
			this.env = new nunjucks.Environment(null, {tags: opts.tags});
		} else if (opts.missingKeyCallback) {
			this.missingKeyCallback = opts.missingKeyCallback;
		}
	}

	if(opts.defaultLocale) {
		this.defaultLocale = opts.defaultLocale;
	}

	return this;
};

Kama.prototype.translate = function(key, params, locale) {
	var len = this.keys.length,
		res,
		str;

	// cascade through res bundles via file:key:locale > file:key:defaultLocale
	while(!str && len--) {
		res = this.keys[len][key];
		if(res) {
			str = res[locale] || res[this.defaultLocale];
		}
	}

	// return the key if a translation is missing or use the passed callback function
	return str ? this.env.renderString(str, params) : this.missingKeyCallback(key);
};

module.exports = new Kama();
