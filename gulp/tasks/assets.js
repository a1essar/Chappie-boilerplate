'use strict';

var mainBowerFiles = require('main-bower-files');

var gulp = require('gulp');
var gulpChanged = require('gulp-changed');
var gulpFilter = require('gulp-filter');
var gulpPlumber = require('gulp-plumber');

var options = require('../config');

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