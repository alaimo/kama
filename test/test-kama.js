var expect = require('expect.js'),
	nunjucks = require('nunjucks'),
	kama = require('../lib/kama'),

	file1 = 'test/resources/brand1/res.json',
	file2 = 'test/resources/brand2/res.json',

	EN_US = 'en_US',
	ES_SP = 'es_ES',
	FR_FR = 'fr_FR',

	params = {brand: 'Blah'};

describe('Kama', function() {
	this.timeout(5000);

	before(function() {
		kama.configure([file1, file2]);
	});

	it('should use the defualt locale', function() {
		expect(kama.translate('hello')).to.be('Hello');
	});

	it('should pull translated strings', function() {
		expect(kama.translate('hello', null, EN_US)).to.be('Hello');
		expect(kama.translate('hello', null, ES_SP)).to.be('Hola');
		expect(kama.translate('hello', null, FR_FR)).to.be('Bonjour');
	});

	it('should casacade for translations', function() {
		// should cascade across files by file/key/locale, file/key/defaultLocale
		expect(kama.translate('hello_brand', null, EN_US)).to.be('Hello, Brand 2');
		expect(kama.translate('hello_brand', null, ES_SP)).to.be('Hola, Brand 2');
		expect(kama.translate('hello_brand', null, FR_FR)).to.be('Hello, Brand 2');
	});

	it('should resolve params', function() {
		expect(kama.translate('hello_params', params, EN_US)).to.be('Hello, Blah');
		expect(kama.translate('hello_params', params, ES_SP)).to.be('Hola, Blah');
		expect(kama.translate('hello_params', params, FR_FR)).to.be('Bonjour, Blah');
	});

	describe('#constructor', function() {

		it('should create a seperate instance', function() {
			var empty = new kama.Kama(),
				brand2 = new kama.Kama(file2);

			expect(empty.translate('hello')).to.be('hello');
			expect(brand2.translate('hello_brand')).to.be('Hello, Brand 2');
			expect(kama.translate('hello_params')).not.to.be(brand2.translate('hello_params'));
		});

		it('should accept custom tag definitions', function() {
			var custom = new kama.Kama(
				file1,
				{tags: {variableStart: '${', variableEnd: '}'}
			});
			expect(custom.translate('hello_custom_params', params)).to.be('Hello, Blah');
		});

		it('should accept a custom nunjucks environment', function() {
			var env,
				custom;

			env = new nunjucks.Environment(null);
			env.addFilter('bar', function(str) {
				return 'bar';
			});

			custom = new kama.Kama(file1, {env: env});
			expect(custom.translate('hello_filter')).to.be('Hello, bar');
		});

	}); // describe constructor

}); // describe kama
