'use strict';

process.env.CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-i18n/angular-locale_pt-br.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/app.module.js',
      'app/app.routes.js',
      'app/filters/*.js',
      'app/services/*.js',
      'app/directives/*.js',
      'app/controllers/*.js',
      'test/unit/**/*.spec.js'
    ],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    reporters: ['progress'],
    singleRun: false
  });
};
