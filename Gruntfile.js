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
    copy: {
      closureLibrary: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/',
            src: [
              'google-closure-library/closure/goog/**/*.js',
              'google-closure-library/third_party/closure/goog/**/*.js',
            ],
            dest: 'app/lib/'
          }
        ]
      }
    },
    shell: {
      test: { command: 'mocha --require intelli-espower-loader' },
      lint: { command: 'eslint Gruntfile.js app/js/ test' }
    }
  });

  grunt.registerTask('install', [
    'bower:install',
    'copy:closureLibrary'
  ]);

  grunt.registerTask('default', [
    'shell:lint',
    'shell:test'
  ]);
};
