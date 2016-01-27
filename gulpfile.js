'use strict';

var gulp    = require('gulp')
  , clean   = require('gulp-clean')
  , runSeq  = require('run-sequence');

gulp.task('default', ['build']);

gulp.task('build', function () {
  runSeq(
    'build:clean',
    'build:copy'
  );
});

var GLOBS = {
  build: 'build',
  app: [
    'package.json',
    'main.js',
    'index.html',
    'js/*.js',
    'css/*.css',
    'css/fonts/**/*.ttf',
    'icons/*',
    'img/*.png',
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/blockchain-wallet-client/**/*',
    'node_modules/jquery/**/*',
    'node_modules/node-env-file/**/*'
  ]
};

gulp.task('build:clean', function () {
  return gulp.src(GLOBS.build)
    .pipe(clean());
});

gulp.task('build:copy', function () {
  return gulp.src(GLOBS.app, { base: '.' })
    .pipe(gulp.dest(GLOBS.build));
});
