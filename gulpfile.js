/**
 *
 */

'use strict';

var _ = require('underscore');
var del = require('del');
var rimraf = require('rimraf');
var path = require('path');
var es = require('event-stream');
var rjs = require('requirejs');
var autoprefixer = require('autoprefixer-core');
var less = require('less');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var gulpConcat = require('gulp-concat');
var gulpPlumber = require('gulp-plumber');
var gulpCsso = require('gulp-csso');
var gulpSourcemaps = require('gulp-sourcemaps');
var mainBowerFiles = require('main-bower-files');
var lazypipe = require('lazypipe');

var options = {
    'autoprefixerOptions': [
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ]
};

options.paths = {
    'styles': ['src/client/styles/css/*.css', 'src/client/styles/less/*.less', 'src/client/styles/less/**/*.less'],
    'scripts': ['src/client/scripts/js/*.js', 'src/client/scripts/js/**/*.js'],
    'dest': {
        'scripts': 'dist/scripts/js',
        'scriptFileName': 'script.min.js',
        'styles': 'dist/styles/css',
        'styleFileName': 'style.min.css',
        'fonts': 'dist/fonts',
        'images': 'dist/images',
    }
};

var styles = lazypipe()
    .pipe(gulpPlumber)
    .pipe(gulpSourcemaps.init)
    .pipe(function(){
        return gulpIf(/.less/, lessRender());
    })
    .pipe(testPipe)
    .pipe(urlRebase)
    .pipe(autoprefixerRender)
    .pipe(gulpCsso)
    .pipe(gulpConcat, options.paths.dest.styleFileName)
    .pipe(gulpSourcemaps.write)
    .pipe(gulp.dest, options.paths.dest.styles);

var fonts = lazypipe()
    .pipe(gulp.dest, options.paths.dest.fonts);

var images = lazypipe()
    .pipe(gulp.dest, options.paths.dest.images);

gulp.task('scripts', ['clean:scripts'], function(callback) {
    var vendors = mainBowerFiles({
        paths: {
            paths: './',
            bowerDirectory: 'vendor',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        },
        filter: /.js/
    });

    var modules = {};
    var baseUrl = 'src/client/scripts/js';
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
        out: options.paths.dest.scripts + '/script.min.js',
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

gulp.task('styles', ['clean:styles'], function() {
    var vendors = mainBowerFiles({
        paths: {
            paths: './',
            bowerDirectory: 'vendor',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    });

    vendors = _.union(vendors, options.paths.styles);

    return gulp.src(vendors)
        .pipe(gulpPlumber())
        .pipe(gulpIf(/.less|.css/, styles()))
        .pipe(gulpIf(/.eot|.svg|.ttf|.woff/, fonts()))
        .pipe(gulpIf(/.jpg|.png|.gif|.jpeg/, images()))
        ;
});

gulp.task('fonts', ['clean:fonts'], function () {
    return gulp.src([
        'src/client/fonts/*'
    ]).pipe(fonts());
});

gulp.task('images', ['clean:images'], function (callback) {
    return gulp.src([
        'src/client/images/*'
    ])
    .pipe(images());
});

gulp.task('copy', ['clean'], function (callback) {
    return gulp.src([
        'src/client/*',
        '!src/client/fonts',
        '!src/client/images',
        '!src/client/scripts',
        '!src/client/styles',
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));
});

gulp.task('clean', function(callback) {
    del([
        'dist/*',
        '!dist/scripts',
        '!dist/styles',
        '!dist/fonts',
        '!dist/images',
        '!dist/templates',
    ], { force: false }, callback);
});

gulp.task('clean:scripts', function(callback) {
    rimraf('dist/scripts', callback);
});

gulp.task('clean:styles', function(callback) {
    rimraf('dist/styles', callback);
});

gulp.task('clean:fonts', function(callback) {
    rimraf('dist/fonts', callback);
});

gulp.task('clean:images', function(callback) {
    rimraf('dist/images', callback);
});

gulp.task('go', ['copy', 'images', 'fonts', 'styles', 'scripts']);
gulp.task('default', ['styles']);

function lessRender() {
    var data;
    var content = new Buffer(0);

    function bufferContents(file){
        if (file.isNull()) {
            return;
        }

        data = file;

        if (content.length !== 0) {
            content = Buffer.concat([content, new Buffer(0)]);
        }

        content = Buffer.concat([content, new Buffer(file.contents)]);
    }

    function endStream(){
        if (!data) {
            return this.emit('end');
        }

        var _this = this;

        less.render(content.toString('utf8'), {
            compress: false,
            paths: [],
            sourceMap: false
        }).then(
            function(output) {
                data.contents = new Buffer(output.css);
                _this.emit('data', data);
                _this.emit('end');
            },
            function(error) {
                console.log(error);
            }
        );
    }

    return es.through(bufferContents, endStream);
}

function autoprefixerRender() {
    function render(file, callback) {
        var content = file.contents.toString('utf8');
        var css = autoprefixer({ browsers: options.autoprefixerOptions }).process(content).css;

        file.contents = new Buffer(css);

        callback(null, file);
    }

    return es.map(render);
}

function urlRebase() {
    function render(file, callback) {
        var content = file.contents.toString('utf8');

        var URL_REGEX = /url\s*\(\s*([^\)]+)\)/g;

        function cleanMatch(url) {
            var firstChar;
            url = url.trim();
            firstChar = url.substr(0, 1);
            if (firstChar === (url.substr(-1)) && (firstChar === '"' || firstChar === "'")) {
                url = url.substr(1, url.length - 2);
            }
            return url;
        }

        content = content.replace(URL_REGEX, function(match, file) {
            var file = cleanMatch(file);
            var filename = path.basename(file).toLowerCase();

            if(filename.indexOf('eot') >= 0 || filename.indexOf('woff') >= 0 || filename.indexOf('ttf') >= 0 || filename.indexOf('svg') >= 0 && file.indexOf('font') >= 0){
                return "url(\"../../fonts/" + filename + "\")";
            }

            if(filename.indexOf('jpg') >= 0 || filename.indexOf('png') >= 0 || filename.indexOf('gif') >= 0 || filename.indexOf('jpeg') >= 0){
                return "url(\"../../images/" + filename + "\")";
            }
        });

        file.contents = new Buffer(content);

        callback(null, file);
    }

    return es.map(render);
}

function testPipe() {
    function render(file, callback) {
        console.log(file.history);

        callback(null, file);
    }

    return es.map(render);
}