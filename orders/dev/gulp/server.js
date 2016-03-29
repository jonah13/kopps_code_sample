'use strict';

var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var modRewrite   = require('connect-modrewrite');

/* Start server for development */
gulp.task('serve', ['watch'], function () {
    browserSync.init({
        server: {
            baseDir: './app',
            middleware: [
                modRewrite(['^[^\\.]*$ /index-dev.html [L]'])
            ]
        }
    });
});
