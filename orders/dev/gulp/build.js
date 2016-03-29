'use strict';

var path   = require('path');
var gulp   = require('gulp');
var conf   = require('./conf');
var modifyCssUrls = require('gulp-modify-css-urls');

var runSequence = require('run-sequence');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

/* Build */
gulp.task('build', function(cb) {
    runSequence(
        'clean',
        'html',
        //'assets',
        'startpage-rename-dist',
        'startpage-remove-dist',
        'other',
        cb
    );
});

/* Create angular cache file */
gulp.task('partials', function () {
    return gulp.src(path.join(conf.paths.src, '/views/**/*.html'))
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'kopp',
            root: 'views'
        }))
        .pipe($.replace('assets/images', 'orders/assets/images'))
        .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

/* Create minified styles/scripts/templates and save in dist */
gulp.task('html', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };

    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(path.join(conf.paths.src, 'index-dev.html'))
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe(assets = $.useref.assets())
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.revReplace({ prefix: '/orders/' }))
        .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(modifyCssUrls({
            modify: function (url) {
                if (~url.indexOf('../fonts/'))
                    return url.replace('../fonts/', '../assets/fonts/');
                else
                    return url;
            }
        }))
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace({ prefix: '/orders/' }))
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

/* Copy assets */
gulp.task('assets', function () {
    return gulp.src('app/assets/**', { base: 'app' })
        .pipe(gulp.dest('../'));
});

/* Copy related to project files */
gulp.task('other', function () {
    //return gulp.src('./app/test_data/**')
    //    .pipe(gulp.dest('../test_data'));
});

/* Copy index-dev.html to index.html */
gulp.task('startpage-rename-dist', function () {
    return gulp.src('../index-dev.html')
        .pipe($.rename('index.html'))
        .pipe(gulp.dest('../'));
});

/* Remove index-dev.html */
gulp.task('startpage-remove-dist', function () {
    return gulp.src('../index-dev.html')
        .pipe($.clean({ force: true }));
});

/* Cleanup dist folder */
gulp.task('clean', function (done) {

    var clean = [
        /*'../assets', */'../scripts', '../styles', '../index-dev.html', './app/index-dev.html', '../index.html', '../test_data'
    ];
    $.del(clean, { force: true }, done);
});
