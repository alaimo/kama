# kama
Simple string localization for Node JS using the nunjucks templating engine.

### Installation
`npm install --save kama`

### Use
```js
var kama = require('kama');

// use the default instance
kama.configure([files], opts);
kama.translate(key, params, locale);

// create a new instance
var res = new kama.Kama([files], opts);
res.translate(key, params, locale);
```

### Example
Create a bunch of json resource files with the following format

```json
{
  "hello": {
    "en_US": "Hello",
    "fr_FR": "Bonjour",
    "es_ES": "Hola"
  }
}
```

Then configure the global kama instance
```js
var kama = require('kama');
kama.configure('resources/res.json');
console.log(kama.translate('hello')) // Hello
console.log(kama.translate('hello', null, 'fr_FR')) // Bonjour
```

### Features
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
console.log(kama.translate('hello_brand', null, 'fr_FR)) // Bonjour, Brand 2
console.log(kama.translate('hello_brand')) // Hello, Brand 1
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

console.log(kama.translate('hello_params', {name: 'Bob'})); // Hello, Bob
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
console.log(kama.translate('hello_params', {name:'Bob'})); // Hello, Bob
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
console.log(kama.translate('hello_filter')); // Hello, Bar
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
  
console.log(emails.translate('hello_params', {name: 'Bob'}); // Hello, emails Bob
console.log(emails.translate('hello_params', {name: 'Bob'}); // Hello, audits Bob
```

### Notes
* Unless an environment or tags object is specified, kama will use the default nunjucks environment.
* Cascaded files are evaluated in order of their placement in the array.
* look ups check key>locale then key>defaultLocale in each file.
* "en_US" is the defaultLocale by default.  You can set defaultLocale in the opts parameter.


