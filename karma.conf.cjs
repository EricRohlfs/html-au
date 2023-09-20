// Karma configuration
// Generated on Fri Mar 25 2022 19:20:30 GMT-0400 (Eastern Daylight Time)

// eslint-disable-next-line no-undef
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine','sinon'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: './src/**/*.ts', type: 'module', watched: true, served: true, included: false},
      { pattern: './dist/**/*.map', type: 'module', watched: true, served: true, included: false},
      { pattern: './test/**/*.map', type: 'module', watched: true, served: true, included: false},
      { pattern: './test/**/*.ts', type: 'module', watched: true, served: true, included: false},
      { pattern: './dist/browser/test/index.js', type: 'module', included: true, served:true, watched:true }
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      '**/*.js': ['sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    //reporters: ['progress'],
    reporters:['kjhtml','spec'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,

    mime: {
      'text/x-typescript': ['ts']
    }

  });
};
