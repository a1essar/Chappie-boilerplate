'use strict';

var rjs = require('requirejs');
var mainBowerFiles = require('main-bower-files');
var path = require('path');
var runSequence = require('run-sequence');
var es = require('event-stream');

var gulp = require('gulp');
var gulpJshint = require('gulp-jshint');
var gulpJscs = require('gulp-jscs');
var gulpEslint = require('gulp-eslint');
var gulpPlumber = require('gulp-plumber');
var gulpBabel = require('gulp-babel');

var options = require('../config');

/* start task: es6-compiler */
gulp.task('es6-compiler', function (callback) {
    return gulp.src('src/client/scripts/es6/**/*.es6')
        .pipe(gulpBabel({
            'modules': 'amd',
            'compact': false
        }))
        .pipe((function() {
            /* disable all hinters for generate js files */
            function render(file, callback) {
                var content = file.contents.toString('utf8');
                content = '//jshint ignore: start\n' + '//jscs:disable\n' + '/*eslint-disable */\n' + content + '\n/*eslint-enable */\n' + '//jscs:enable\n' + '//jshint ignore: end\n';
                file.contents = new Buffer(content);
                callback(null, file);
            }

            return es.map(render);
        })())
        .pipe(gulp.dest('src/client/scripts/js'));
});
/* end task: es6-compiler */

/* start task: rjs */
gulp.task('rjs', function(callback) {
    var vendors = mainBowerFiles({
        paths: './',
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
        name: path.relative(baseUrl, 'bower_components/almond/almond'),
        include: ['common'],
        insertRequire: [path.relative(baseUrl, 'bower_components/almond/almond')],
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
/* end task: rjs */

/* start task: scripts */
gulp.task('scripts', function(callback) {
    runSequence('es6-compiler', 'eslint', 'rjs', callback);
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

/* start eslint */
gulp.task('eslint', function (callback) {
    return gulp.src(options.paths.scripts)
        .pipe(gulpPlumber())
        .pipe(gulpEslint())
        .pipe(gulpEslint.format())
        .pipe(gulpEslint.failOnError());
});
/* end eslint */
