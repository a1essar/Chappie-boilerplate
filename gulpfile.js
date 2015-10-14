/**
 * Gulp HappyStarter
 * */

/**
 * todo: add favicon generator
 * todo: add generate font from otf
 * todo: add generate css from fonts files
 * todo: http://bdadam.com/blog/better-webfont-loading-with-localstorage-and-woff2.html
 * todo: h5bp
 * todo: webp less mixin
 * todo: cssnext;
 * */
'use strict';

var del = require('del');
var runSequence = require('run-sequence');
var vinylPaths = require('vinyl-paths');
var requireDir = require('require-dir');
var bs = require('browser-sync').create();

var gulp = require('gulp');
var gulpChanged = require('gulp-changed');

var options = require('./gulp/config');

var tasks = requireDir('./gulp/tasks');

/* start task: browser-sync */
gulp.task('bs', function(callback) {
    bs.init({
        notify: false,
        server: {
            baseDir: 'dist'
        },
        online: true,
        'no-online': true
    }, callback);
});
/* end: browser-sync */

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

gulp.task('watch:go', function(callback) {
    runSequence('go',
        ['bs'],
        callback);
});

gulp.task('watch', ['watch:go'], function () {
    gulp.watch(options.paths.watch.styles, ['styles']);
    gulp.watch(options.paths.watch.scripts, ['scripts']);
    gulp.watch(options.paths.watch.main, ['copy:main']);
    gulp.watch(options.paths.watch.assets, ['copy:assets']);
    gulp.watch(options.paths.watch.templates, ['copy:templates']);
    gulp.watch(options.paths.watch.mustache, ['templates']);
    gulp.watch(options.paths.watch.views, ['templates']);

    gulp.watch([
        'dist/**/*.html',
        'dist/**/*.css',
        'dist/**/*.js',
        'dist/**/*.json',
        'dist/**/*.jpg',
        'dist/**/*.png',
        'dist/**/*.svg',
        'dist/**/*.woff'
    ]).on('change', bs.reload);
});

gulp.task('watch:server', ['copy:server'], function () {
    gulp.watch(options.paths.watch.server);
});

gulp.task('default', ['go']);
