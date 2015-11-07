module.exports = function(grunt) {
  // load plugins
  [
    'grunt-contrib-jshint',
    'grunt-mocha-test'
  ].forEach(function(task) {
  grunt.loadNpmTasks(task);
  });

  grunt.initConfig({
    jshint: {
      module: ['lib/**/*.js', 'test/**/*.js']
    },
    mochaTest: {
      test: {
        options: {
          mocha: require('mocha')
        },
        src: ['test/test-*.js']
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'mochaTest']);
};