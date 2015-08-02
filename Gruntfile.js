module.exports = function (grunt) {
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
      bowerForTest: {
        files: [
          {
            expand: true,
            cwd: 'app/',
            src: [
              'lib/**/*.js',
              'lib/**/*.css'
            ],
            dest: 'test/lib/'
          }
        ]
      },
      closureLibrary: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/',
            src: [
              'google-closure-library/closure/goog/**/*.js',
              'google-closure-library/third_party/closure/goog/**/*.js'
            ],
            dest: 'app/lib/'
          }
        ]
      }
    },
    shell: {
      buildTest: {
        command: (
          [
            'java -jar node_modules/google-closure-compiler/compiler.jar',

            '--only_closure_dependencies',
            '--closure_entry_point=KeepMeContributing',

            '--create_source_map=test/js/sourceMap.json',

            '--allow_es6_out',
            '--language_in=ECMASCRIPT6',
            '--language_out=ECMASCRIPT5_STRICT',

            '--jscomp_error=constantProperty',
            '--jscomp_error=const',
            '--jscomp_error=visibility',
            '--jscomp_error=checkRegExp',
            '--warning_level=VERBOSE',
            '--jscomp_warning=checkDebuggerStatement',

            '--js=app/lib/google-closure-library/closure/goog/**.js',
            '--js=!app/lib/google-closure-library/closure/goog/**test.js',
            '--js=app/lib/google-closure-library/third_party/closure/goog/**.js',
            '--js=!app/lib/google-closure-library/third_party/closure/goog/**test.js',
            '--js=app/js/KeepMeContributing/**.js',
            '--js_output_file=test/js/app.js'
          ].join(' ')
        )
      },
      testServer: { command: 'js-dev-server -S test/ -W test/ --port 9876' },
      lint: { command: 'eslint Gruntfile.js app/js/ test/js/' }
    }
  });

  grunt.registerTask('install', [
    'bower:install',
    'copy:closureLibrary'
  ]);
  grunt.registerTask('test', [
    'copy:bowerForTest',
    'shell:buildTest',
    'shell:testServer'
  ]);

  grunt.registerTask('default', [
    'shell:lint',
    'test'
  ]);
};
