/**
 *
 *
 */

'use strict';

var del = require('del');
var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var csso = require('gulp-csso');

var paths = {
    'styles': ['app/client/styles/*.css', 'app/client/styles/less/*.less', 'app/client/styles/less/**/*.less'],
    'dest': {
        'styles': 'app/public/css'
    }
};

var config = {
    'autoprefixer-options': [
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ],
    'production': false
};

gulp.task('clean', function(cb) {
    del(['build'], cb);
});

gulp.task('styles', ['clean'], function() {
    return gulp.src(paths.styles)
        .pipe(prefix(config['autoprefixer-options'], { cascade: true }))
        .pipe(concat('style.min.css'))
        .pipe(csso())
        .pipe(gulp.dest(paths.dest.styles));
});

gulp.task('go', ['styles']);
gulp.task('default', ['styles']);