# kama
Simple string localization for Node JS using the nunjucks templating engine.

### Installation
`npm install --save kama`

### Getting Started
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
  'resources/brand1/res.js',
  'resources/brand2/res.js'
]);
console.log(kama.translate('hello_brand', null, 'fr_FR)) // Bonjour, Brand 2
console.log(kama.translate('hello_brand')) // Hello, Brand 1
```
