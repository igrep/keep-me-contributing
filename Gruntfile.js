module.exports = function (grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    bower: {
      install: {
        options: {
          targetDir: 'app/lib',
          verbose: true
        }
      }
    },
    shell: {
      test: { command: 'mocha --require intelli-espower-loader' },
      lint: { command: 'eslint Gruntfile.js app/js/ test' }
    }
  });

  grunt.registerTask('default', [
    'shell:lint',
    'shell:test'
  ]);
};
