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
var runSequence = require('run-sequence');
var vinylPaths = require('vinyl-paths');
var requireDir = require('require-dir');
var browserSync = require('browser-sync');

var gulp = require('gulp');
var gulpChanged = require('gulp-changed');

var options = require('./gulp/config');

var tasks = requireDir('./gulp/tasks');

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