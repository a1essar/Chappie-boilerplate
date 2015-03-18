/**
 * Gulp HappyStarter
 * */

/**
 * todo: gulp build only changed files (fix assets and templates)
 * todo: webp less mixin
 * todo: gulp-jslint
 * todo: cssnext;
 * todo: replace jquery of bean, qwery, bonzo, reqwest
 * */
'use strict';

var del = require('del');
var mainBowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');
var vinylPaths = require('vinyl-paths');
var requireDir = require('require-dir');

var gulp = require('gulp');
var gulpChanged = require('gulp-changed');
var gulpFilter = require('gulp-filter');
var gulpPlumber = require('gulp-plumber');

var options = require('./gulp/config');

var tasks = requireDir('./gulp/tasks');

/* start task: bower:assets */
gulp.task('bower:assets', function() {
    var vendors = mainBowerFiles({
        paths: {
            paths: './',
            bowerDirectory: 'vendor',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    });

    var imagesFilter = gulpFilter(['*.jpg', '*.png', '*.gif', '*.jpeg']);
    var fontsFilter = gulpFilter(['*.eot', '*.ttf', '*.woff', '*.woff2']);
    var jsonFilter = gulpFilter(['*.json']);
    var svgFilter = gulpFilter(['*.svg']);

    return gulp.src(vendors)
        .pipe(gulpPlumber())

        .pipe(imagesFilter)
        .pipe(gulpChanged(options.paths.dest.images))
        .pipe(gulp.dest(options.paths.dest.images))
        .pipe(imagesFilter.restore())

        .pipe(fontsFilter)
        .pipe(gulpChanged(options.paths.dest.svg))
        .pipe(gulp.dest(options.paths.dest.fonts))
        .pipe(fontsFilter.restore())

        .pipe(jsonFilter)
        .pipe(gulpChanged(options.paths.dest.svg))
        .pipe(gulp.dest(options.paths.dest.json))
        .pipe(jsonFilter.restore())

        .pipe(svgFilter)
        .pipe(gulpChanged(options.paths.dest.svg))
        .pipe(gulp.dest(options.paths.dest.svg))
        .pipe(svgFilter.restore())
        ;
});
/* end task: bower:assets */

/* start copy:assets */
gulp.task('copy:assets', ['bower:assets'], function (callback) {
    var imagesFilter = gulpFilter(['*.jpg', '*.png', '*.gif', '*.jpeg']);
    var fontsFilter = gulpFilter(['*.eot', '*.ttf', '*.woff', '*.woff2']);
    var jsonFilter = gulpFilter(['*.json']);
    var svgFilter = gulpFilter(['*.svg']);

    return gulp.src(options.paths.assets)
        .pipe(gulpPlumber())

        .pipe(imagesFilter)
        .pipe(gulpChanged(options.paths.dest.images))
        .pipe(gulp.dest(options.paths.dest.images))
        .pipe(imagesFilter.restore())

        .pipe(fontsFilter)
        .pipe(gulpChanged(options.paths.dest.svg))
        .pipe(gulp.dest(options.paths.dest.fonts))
        .pipe(fontsFilter.restore())

        .pipe(jsonFilter)
        .pipe(gulpChanged(options.paths.dest.svg))
        .pipe(gulp.dest(options.paths.dest.json))
        .pipe(jsonFilter.restore())

        .pipe(svgFilter)
        .pipe(gulpChanged(options.paths.dest.svg))
        .pipe(gulp.dest(options.paths.dest.svg))
        .pipe(svgFilter.restore())
        ;
});
/* end copy:assets */

/* start copy:templates */
gulp.task('copy:templates', function (callback) {
    return gulp.src(options.paths.templates)
        .pipe(gulpChanged(options.paths.dest.templates))
        .pipe(gulp.dest(options.paths.dest.templates));
});
/* end copy:templates */

/* start copy:main */
gulp.task('copy:main', function (callback) {
    return gulp.src(options.paths.main)
        .pipe(gulpChanged(options.paths.dest.main))
        .pipe(gulp.dest(options.paths.dest.main))
        ;
});
/* end copy:main */

/* start copy:server */
gulp.task('copy:server', ['clean:server'], function (callback) {
    return gulp.src(options.paths.server)
        .pipe(gulpChanged(options.paths.dest.server))
        .pipe(gulp.dest(options.paths.dest.server))
        ;
});
/* end copy:server */

/* start task: clean */
gulp.task('clean', function (callback) {
    return gulp.src(options.paths.clean.root, { read: false })
        .pipe(vinylPaths(del));
});
/* end task: clean */

gulp.task('copy', function(callback) {
    runSequence('clean',
        ['copy:main', 'copy:templates', 'copy:assets'],
        callback);
});

gulp.task('go', function(callback) {
    runSequence('copy',
        ['styles', 'scripts', 'templates'],
        callback);
});

gulp.task('watch', ['go', 'browser-sync'], function () {
    gulp.watch(options.paths.watch.styles, ['styles', browserSync.reload]);
    gulp.watch(options.paths.watch.scripts, ['scripts', browserSync.reload]);
    gulp.watch(options.paths.watch.main, ['copy:main', browserSync.reload]);
    gulp.watch(options.paths.watch.assets, ['copy:assets', browserSync.reload]);
    gulp.watch(options.paths.watch.templates, ['copy:templates', browserSync.reload]);
    gulp.watch(options.paths.watch.mustache, ['templates', browserSync.reload]);
});

gulp.task('watch:server', ['copy:server'], function () {
    gulp.watch(options.paths.watch.server);
});

gulp.task('default', ['go']);