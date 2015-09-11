module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var closureCompilerCommandFor = function(entryPoint, outName){
    return [
      'java -jar node_modules/google-closure-compiler/compiler.jar',

      '--only_closure_dependencies',
      '--closure_entry_point="' + entryPoint + '"',

      '--create_source_map="app/js/' + outName + '.js.map"',
      '--source_map_location_mapping=app\\|',
      '--output_wrapper "%output%\n//# sourceMappingURL=/js/' + outName + '.js.map"',

      '--language_in=ECMASCRIPT6',
      '--language_out=ECMASCRIPT5_STRICT',

      '--jscomp_error=constantProperty',
      '--jscomp_error=const',
      '--jscomp_error=checkRegExp',
      '--warning_level=VERBOSE',
      '--jscomp_warning=checkDebuggerStatement',

      '--js=app/lib/google-closure-library/closure/goog/**.js',
      '--js=!app/lib/google-closure-library/closure/goog/**test.js',
      '--js=app/lib/google-closure-library/third_party/closure/goog/**.js',
      '--js=!app/lib/google-closure-library/third_party/closure/goog/**test.js',
      '--js=app/js/KeepMeContributing/**.js',
      '--js_output_file=app/js/' + outName + '.js'
    ].join(' ');
  };

  grunt.initConfig({
    bower: { install: { options: { targetDir: 'app/lib', verbose: true } } },
    copy: {
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
      buildDebug: { command: closureCompilerCommandFor('KeepMeContributing', 'app') },
      buildWorker: { command: closureCompilerCommandFor('KeepMeContributing.Worker', 'worker') },
      buildServer: { command: 'mvn compile' },
      buildServerTest: { command: 'mvn test' },
      testServer: { command: 'foreman start web' },
      lint: { command: 'eslint Gruntfile.js app/js/' },
      deploy: { command: 'mvn heroku:deploy' }
    },
    watch: {
      buildDebug: {
        files: ['app/js/KeepMeContributing/**/*.js'],
        tasks: ['shell:buildDebug', 'notify:buildDebug'],
        options: { interrupt: true, atBegin: true }
      },
      buildWorker: {
        files: ['app/js/KeepMeContributing/**/*.js'],
        tasks: ['shell:buildWorker', 'notify:buildWorker'],
        options: { interrupt: true, atBegin: true }
      },
      buildServer: {
        files: ['src/main/java/**/*.java'],
        tasks: ['shell:buildServer', 'notify:buildServer'],
        options: { interrupt: true, atBegin: true  }
      },
      buildServerTest: {
        files: ['src/main/java/**/*.java', 'src/test/java/**/*.java'],
        tasks: ['shell:buildServerTest', 'notify:buildServerTest'],
        options: { interrupt: true, atBegin: true  }
      }
    },
    notify: {
      buildDebug: {
        options: {
          title: 'buildDebug',
          message: 'Finished to build js/app.js.\nCheck the terminal to check for warnings.'
        }
      },
      buildWorker: {
        options: {
          title: 'buildWorker',
          message: 'Finished to build js/worker.js.\nCheck the terminal to check for warnings.'
        }
      },
      buildServer: {
        options: {
          title: 'buildServer',
          message: 'Finished to build the server application.\nCheck the terminal to check for warnings.'
        }
      },
      buildServerTest: {
        options: {
          title: 'buildServerTest',
          message: 'Finished to build the tests of the server application.\nCheck the terminal to check for warnings.'
        }
      }
    }
  });

  grunt.registerTask('install', [
    'bower:install',
    'copy:closureLibrary'
  ]);
  grunt.registerTask('test', [
    'shell:buildDebug',
    'shell:testServer'
  ]);

  grunt.registerTask('default', [
    'shell:lint',
    'shell:buildDebug',
    'shell:buildServer'
  ]);

  grunt.registerTask('deploy', [
    'default',
    'shell:deploy'
  ]);
};
