'use strict';

var path     = require('path');
var gulp     = require('gulp');
var conf     = require('./conf');
var $        = require('gulp-load-plugins')();
var wiredep  = require('wiredep').stream;
var _        = require('lodash');

gulp.task('inject', ['scripts', 'styles'], function () {

    /* Styles inject */
    var injectStyles = gulp.src([
        path.join(conf.paths.src, '/styles/**/*.css'),
        path.join(conf.paths.src, '/styles/*.css')
    ], { read: false });

    /* Scripts inject */
    var injectScripts = gulp.src([
        path.join(conf.paths.src, '/scripts/*.js'),
        path.join(conf.paths.src, '/scripts/**/*.js')
    ])
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

    /* Options */
    var injectOptions = {
        ignorePath: [conf.paths.src],
        addRootSlash: false
    };

    return gulp.src(path.join(conf.paths.src, '/index.html'))
        .pipe($.rename({ suffix: '-dev' }))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe(gulp.dest(conf.paths.src));
});
