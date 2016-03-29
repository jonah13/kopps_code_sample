'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

    // index.html watcher
    gulp.watch([path.join(conf.paths.src, '/index.html'), 'bower.json'], ['inject']);

    // CSS watcher
    gulp.watch(['./app/styles/**/*.css', './app/styles/*.css'], function(event) {
        if(isOnlyChange(event)) {
            browserSync.reload(event.path);
        } else {
            gulp.start('inject');
        }
    });

    // Javascript watcher
    gulp.watch(path.join(conf.paths.src, '/scripts/**/*.js'), function(event) {
        if(isOnlyChange(event))
          gulp.start('scripts');
        else
            gulp.start('inject');
    });

    // HTML watcher
    gulp.watch(path.join(conf.paths.src, '/views/**/*.html'), function(event) {
        browserSync.reload(event.path);
    });
});
