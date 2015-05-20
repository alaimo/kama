# kama
Simple string localization for Node JS using the nunjucks templating engine.

## Installation
`npm install --save kama`

## Use
```js
var kama = require('kama');

// use the default instance
kama.configure([files], opts);
kama.translate(key, params, locale);

// create a new instance
var res = new kama.Kama([files], opts);
res.translate(key, params, locale);
```

## Example
```js
// Create a bunch of json resource files with the following format
{
  "hello": {
    "en_US": "Hello",
    "fr_FR": "Bonjour",
    "es_ES": "Hola"
  }
}

// Then configure the global kama instance
var kama = require('kama');
kama.configure('resources/res.json');
console.log(kama.translate('hello')) 
// Hello
console.log(kama.translate('hello', null, 'fr_FR')) 
// Bonjour
```

## Features
Cascade resource files
```js
// saved in app_root/resources/brand1/res.js
{
  "hello_brand": {
    "en_US": "Hello, Brand 1",
    "fr_FR": "Bonjour, Brand 1",
    "es_ES": "Hola, Brand 1"
  }
}

// saved in app_root/resources/brand2/res.js
{
  "hello_brand": {
    "fr_FR": "Bonjour Brand 2"
  }
}

...

var require('kama');
kama.configure([
  'resources/brand2/res.js',
  'resources/brand1/res.js'
]);
console.log(kama.translate('hello_brand', null, 'fr_FR)); 
// Bonjour, Brand 2
console.log(kama.translate('hello_brand'));
// Hello, Brand 1
```

Resolve parameters
```js
// assume the following is in a loaded resource file
{
  "hello_params": {
    "en_US": "Hello, {{ name }}"
  }
}

...

console.log(kama.translate('hello_params', {name: 'Bob'})); 
// Hello, Bob
```

Change template tags
```js
// assume the following is in app_root/resources/res.json
{
  "hello_params": {
    "en_US": "Hello, $[name]"
  }
}

...

kama.configure('resources/res.json', {
  tags: {
		variableStart: '$[',
		variableEnd: ']'
	}
});
console.log(kama.translate('hello_params', {name:'Bob'})); 
// Hello, Bob
```

Use your own nunjucks environment
```js
// assume the following is in app_root/resources/res.json
{
  "hello_filter": {
    "en_US": "Hello {{ 'foo' | bar }}"
  }
}

...

var nunjucks = require('nunjucks'),
  kama = require('kama'),
  env = new nunjucks.Environment();
  
env.addFilter('bar', function(str) {
  return 'Bar';
});

kama.configure('resources/res.json', {env: env});
console.log(kama.translate('hello_filter')); 
// Hello, Bar
```

Use multiple kama instances
```js

// emails.json
{
  "hello_params": {
    "en_US": "Hello, emails $[name]"
  }
}

// audits.json
{
  "hello_params": {
    "en_US": "Hello, audits {{ name }}"
  }
}

...

var kama = require('kama');
  emails = new kama.Kama('resources/emails.json', {
    tags: {
		  variableStart: '$[',
		  variableEnd: ']'
	}),
  audits = new kama.Kama('resources/audits.json');
  
console.log(emails.translate('hello_params', {name: 'Bob'}); 
// Hello, emails Bob
console.log(audits.translate('hello_params', {name: 'Bob'}); 
// Hello, audits Bob
```

## Options
The following values can be set in the opts parameter of `kama.configure([files], opts)` or `new kama.Kama([files], opts)`.
* __defaultLocale__: The default locale.  Defaults to "en_US".
* __env__: Custom nunjucks environment
* __tags__: Nunjucks syntax customization object


## Notes
* Unless an environment or tags object is specified, kama will use the default nunjucks environment.
* Cascaded files are evaluated in order of their placement in the array.
* `kama.translate(key, params, locale)` will check key>locale then key>defaultLocale in each file until a truthy string is found.
* If `kama.translate(key, params, locale)` fails to find a valid string it will return the key parameter.

## License

The MIT License (MIT)

Copyright (c) 2015 Jonathan Alaimo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
