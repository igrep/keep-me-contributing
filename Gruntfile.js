module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);


  /**
   * Process grunt.option-s and argv
   */

  /* Build target of closure compiler. See the ClosureCompilerRule class for details. */
  var targetName = grunt.option('target') || 'frontend';

  /*
   * Run on an connected Android device after building by cordova.
   * NOTE: only valid when building by cordova.
   */
  var runAfterbuilding = grunt.option('run');

  /*
   * Build Rule class
   */
  ClosureCompilerRule = function(outName, entryPoint, cordovaMode){
    this.outName = outName;
    this.entryPoint = entryPoint;
    this.outRoot = cordovaMode ? 'www' : 'app';
    this.cordova = cordovaMode;
  };
  ClosureCompilerRule.ruleFor = function(name, cordovaMode){
    var rules = {
      frontend:      new this('app',             'KeepMeContributing',             cordovaMode),
      worker:        new this('worker',          'KeepMeContributing.Worker.Main', cordovaMode),
      workerTestLib: new this('worker-test-lib', 'KeepMeContributing.Worker',      cordovaMode),
    };
    if (name in rules){
      return rules[name];
    } else {
      throw new Error('Unknown target of Closure Compiler: ' + name);
    }
  };

  ClosureCompilerRule.prototype.outPath = function(){
    return this.outRoot + '/js/' + this.outName + '.js';
  };

  ClosureCompilerRule.prototype.compilerCommand = function(){
    return [
      'java -jar node_modules/google-closure-compiler/compiler.jar',

      '--only_closure_dependencies',
      '--closure_entry_point="' + this.entryPoint + '"',

      '--create_source_map="' + this.outPath() + '.map"',
      '--source_map_location_mapping=' + this.outRoot + '\\|',
      '--output_wrapper "%output%\n//# sourceMappingURL=/js/' + this.outName + '.js.map"',

      '--language_in=ECMASCRIPT6',
      '--language_out=ECMASCRIPT5_STRICT',

      '--jscomp_error=constantProperty',
      '--jscomp_error=const',
      '--jscomp_error=checkRegExp',
      '--warning_level=VERBOSE',
      '--jscomp_warning=checkDebuggerStatement',

      '--define KeepMeContributing.Defines.CORDOVA=' + this.cordova,

      '--externs=app/js/externs/cordova.js',

      '--js=app/lib/google-closure-library/closure/goog/**.js',
      '--js=!app/lib/google-closure-library/closure/goog/**test.js',
      '--js=app/lib/google-closure-library/third_party/closure/goog/**.js',
      '--js=!app/lib/google-closure-library/third_party/closure/goog/**test.js',
      '--js=app/js/KeepMeContributing/**.js',
      '--js_output_file=' + this.outPath()
    ].join(' ');
  };

  ClosureCompilerRule.prototype.cordovaMode = function(){
    return new this.constructor(this.outName, this.entryPoint, true);
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
      },
      cordova: {
        files: [
          {
            expand: true, cwd: 'app',
            src: ['css/*', 'img/*', 'js/load.js', 'index.html'],
            dest: 'www/'
          }
        ]
      }
    },
    shell: {
      buildClient: {
        command: function(cordova, targetArgument){
          var target = targetArgument || targetName;
          return ClosureCompilerRule.ruleFor(target, cordova === 'cordova').compilerCommand();
        }
      },
      cordova: {
        command: 
          runAfterbuilding ?
            'cordova run android --device' : 'cordova build android'
      },
      installServerDeps: { command: 'mvn install' },
      buildServer: { command: 'mvn compile' },
      buildServerTest: { command: 'mvn test' },
      testServer: { command: 'foreman start web' },
      lint: { command: 'eslint Gruntfile.js app/js/' },
      deploy: { command: 'mvn heroku:deploy' }
    },
    watch: {
      buildClient: {
        files: [
          'app/js/KeepMeContributing/**/*.js',
          'app/js/externs/**/*.js',
        ],
        tasks: ['shell:buildClient', 'notify:buildClient'],
        options: { interrupt: true, atBegin: true }
      },
      cordova: {
        files: [
          'app/js/KeepMeContributing/**/*.js',
          'app/js/externs/**/*.js',
          'app/css/*.css',
          'app/img/*.png',
          'app/js/load.js',
          'app/index.html'
        ],
        tasks: [
          'shell:buildClient:cordova',
          'notify:buildClient',
          'copy:cordova',
          'shell:cordova',
          'notify:cordova'
        ],
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
      buildClient: {
        options: {
          title: 'buildClient',
          message: 'Finished to build.\nCheck the terminal to check for warnings.'
        }
      },
      cordova: {
        options: {
          title: 'Cordova',
          message: 'Finished to build cordova app.'
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
    'shell:installServerDeps',
    'bower:install',
    'copy:closureLibrary'
  ]);

  grunt.registerTask('buildBrowserApp', [
    'shell:buildClient:browser:frontend',
    'shell:buildClient:browser:worker',
    'shell:buildClient:browser:workerTestLib'
  ]);

  grunt.registerTask('buildCordovaApp', [
    'shell:buildClient:cordova:frontend'
  ]);

  grunt.registerTask('default', [
    'shell:lint',
    'buildBrowserApp',
    'shell:buildServer'
  ]);

  grunt.registerTask('cordova', [
    'buildCordovaApp',
    'copy:cordova',
    'shell:cordova'
  ]);

  grunt.registerTask('deploy', [
    'default',
    'shell:deploy'
  ]);
};
