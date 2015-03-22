'use strict';

var rjs = require('requirejs');
var mainBowerFiles = require('main-bower-files');
var path = require('path');

var gulp = require('gulp');
var gulpJshint = require('gulp-jshint');
var gulpJscs = require('gulp-jscs');
var gulpPlumber = require('gulp-plumber');

var options = require('../config');

/* start task: scripts */
gulp.task('scripts', function(callback) {
    var vendors = mainBowerFiles({
        paths: {
            paths: './',
            bowerDirectory: 'vendor',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        },
        filter: /.js$/
    });

    var modules = {};
    var baseUrl = options.paths.scriptsBase;
    var excluded = ['almond'];

    vendors.map(function(el){
        el = el.replace(/.js$/, '');
        var name = path.basename(el);

        if(excluded.indexOf(name) >= 0){
            return false;
        }

        modules[name] = path.relative(baseUrl, el);
    });

    rjs.optimize({
        baseUrl: baseUrl,
        paths: modules,
        name: path.relative(baseUrl, 'vendor/almond/almond'),
        include: ['common'],
        insertRequire: [path.relative(baseUrl, 'vendor/almond/almond')],
        out: options.paths.dest.scripts + '/' + options.paths.dest.scriptFileName,
        optimize: "uglify2",
        uglify2: {
            compress: {
                drop_console: false
            }
        },
        preserveLicenseComments: false,
        generateSourceMaps: true
    }, function(buildResponse){
        callback();
    }, callback);
});
/* end task: scripts */

/* start jshint */
gulp.task('jshint', function (callback) {
    return gulp.src(options.paths.scripts)
        .pipe(gulpPlumber())
        .pipe(gulpJshint())
        .pipe(gulpJshint.reporter('unix'));
});
/* end jshint */

/* start jscs */
gulp.task('jscs', function (callback) {
    return gulp.src(options.paths.scripts)
        .pipe(gulpPlumber())
        .pipe(gulpJscs());
});
/* end jscs */