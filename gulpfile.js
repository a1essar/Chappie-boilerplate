
/**
 * todo: webp less mixin
 * todo: gulp-jslint
 * todo: cssnext;
 * todo: replace jquery of bean, qwery, bonzo, reqwest
 */
'use strict';

var _ = require('underscore');
var autoprefixer = require('autoprefixer-core');
var browserSync = require('browser-sync');
var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var lazypipe = require('lazypipe');
var less = require('less');
var mainBowerFiles = require('main-bower-files');
var mustache = require('mustache');
var path = require('path');
var rjs = require('requirejs');
var runSequence = require('run-sequence');
var vinylPaths = require('vinyl-paths');

var gulp = require('gulp');
var gulpChanged = require('gulp-changed');
var gulpConcat = require('gulp-concat');
var gulpCsso = require('gulp-csso');
var gulpCsscomb = require('gulp-csscomb');
var gulpCsslint = require('gulp-csslint');
var gulpExec = require('gulp-exec');
var gulpFilter = require('gulp-filter');
var gulpHtmlmin = require('gulp-htmlmin');
var gulpHtmlhint = require("gulp-htmlhint");
var gulpIf = require('gulp-if');
var gulpImage = require('gulp-image');
var gulpGhPages = require('gulp-gh-pages');
var gulpPlumber = require('gulp-plumber');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpSpritesmith = require('gulp.spritesmith');
var gulpTtf2woff = require('gulp-ttf2woff');
var gulpWebp = require('gulp-webp');
var gulpUtil = require('gulp-util');

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
    'main': [
        'src/client/favicon.ico',
        'src/client/humans.txt',
        'src/client/index.html',
        'src/client/.htaccess',
        'src/client/index.php',
        'src/client/manifest.webapp',
        'src/client/robots.txt'
    ],
    'server': 'src/server/**',
    'assets': [
        'src/client/images/**',
        'src/client/fonts/**',
        'src/client/json/**',
        'src/client/svg/**'
    ],
    'images': 'src/client/images/**',
    'fonts': 'src/client/fonts/**',
    'json': 'src/client/json/**',
    'svg': 'src/client/svg/**',
    'templates': [
        'src/client/templates/**'
    ],
    'mustache': [
        'src/client/templates/mustache/*.mustache',
        'src/client/templates/mustache/**/*.mustache'
    ],
    'styles': ['src/client/styles/css/*.css', 'src/client/styles/less/*.less', 'src/client/styles/less/**/*.less'],
    'scripts': ['src/client/scripts/js/*.js', 'src/client/scripts/js/**/*.js'],
    'scriptsBase': 'src/client/scripts/js',
    'fontsConverts': {
        'src': 'src/client/fonts/*.ttf',
        'dest': 'src/client/fonts'
    },
    'optimizeImages': {
        'src': 'src/client/images/*',
        'dest': 'src/client/images'
    },
    'dest': {
        'main': 'dist',
        'server': 'dist/server',
        'scripts': 'dist/scripts/js',
        'scriptFileName': 'script.min.js',
        'styles': 'dist/styles/css',
        'styleFileName': 'style.min.css',
        'fonts': 'dist/fonts',
        'images': 'dist/images',
        'json': 'dist/json',
        'svg': 'dist/svg',
        'templates': 'dist/templates',
        'mustache': 'dist/templates'
    },
    'clean': {
        'root': 'dist',
        'main': [
            'dist/favicon.ico',
            'dist/humans.txt',
            'dist/index.html',
            'dist/index.php',
            'dist/.htaccess',
            'dist/manifest.webapp',
            'dist/robots.txt'
        ],
        'server': 'dist/server',
        'images': 'dist/images',
        'fonts': 'dist/fonts',
        'svg': 'dist/svg',
        'json': 'dist/json',
        'styles': 'dist/styles',
        'scripts': 'dist/scripts',
        'templates': 'dist/templates'
    },
    'watch': {
        'main': [
            'src/client/favicon.ico',
            'src/client/humans.txt',
            'src/client/index.html',
            'src/client/.htaccess',
            'src/client/index.php',
            'src/client/manifest.webapp',
            'src/client/robots.txt'
        ],
        'server': 'src/server/**',
        'assets': [
            'src/client/images/**',
            'src/client/fonts/**',
            'src/client/json/**',
            'src/client/svg/**'
        ],
        'images': 'src/client/images/**',
        'fonts': 'src/client/fonts/**',
        'svg': 'src/client/svg/**',
        'json': 'src/client/json/**',
        'templates': [
            'src/client/templates/**'
        ],
        'mustache': [
            'src/client/templates/mustache/*.mustache',
            'src/client/templates/mustache/**/*.mustache',
            'src/client/scripts/js/views/**/*.js'
        ],
        'styles': ['src/client/styles/css/*.css', 'src/client/styles/less/*.less', 'src/client/styles/less/**/*.less'],
        'scripts': ['src/client/scripts/js/*.js', 'src/client/scripts/js/**/*.js']
    },
    'test': 'src/client/scripts/js/test/runner.html'
};

/* start task: scripts */
gulp.task('scripts', function(callback) {
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

/* start task: styles */
gulp.task('styles', function() {
    var vendors = mainBowerFiles({
        paths: {
            paths: './',
            bowerDirectory: 'vendor',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        },
        filter: /.less|.css/
    });

    vendors = _.union(vendors, options.paths.styles);

    /* custom reporter for gulpCsslint*/
    var customReporter = function(file) {
        if(Object.keys(file.csslint.results[0].error.rule).length <= 0){
            return false;
        }

        var c = gulpUtil.colors;
        process.stderr.write('\x07'); // Send a beep to the terminal so it bounces

        var errorCount = file.csslint.errorCount;
        var plural = errorCount === 1 ? '' : 's';

        gulpUtil.log(c.cyan(errorCount)+' error'+plural+' found in '+c.magenta(file.path));

        file.csslint.results.forEach(function(result) {
            var message = result.error;

            gulpUtil.log(
                c.red('[') +
                (
                    typeof message.line !== 'undefined' ?
                    c.yellow( 'L' + message.line ) +
                    c.red(':') +
                    c.yellow( 'C' + message.col )
                        :
                        c.yellow('GENERAL')
                ) +
                c.red('] ') +
                message.message + ' ' + message.rule.desc + ' (' + message.rule.id + ')');
        });
    };

    return gulp.src(vendors)
        .pipe(gulpPlumber())

        .pipe(gulpSourcemaps.init())

        .pipe(gulpIf(/.less/, lessRender()))

        .pipe(urlRebase())
        .pipe(autoprefixerRender())
        .pipe(gulpCsso())

        .pipe(gulpCsslint({
            'adjoining-classes': false,
            'box-model': false,
            'box-sizing': false,
            'compatible-vendor-prefixes': false,
            'empty-rules': true,
            'display-property-grouping': true,
            'duplicate-background-images': true,
            'duplicate-properties': true,
            'fallback-colors': false,
            'floats': false,
            'font-faces': false,
            'font-sizes': true,
            'gradients': false,
            'ids': true,
            'import': true,
            'important': false,
            'known-properties': false,
            'outline-none': false,
            'overqualified-elements': false,
            'qualified-headings': true,
            'regex-selectors': true,
            'shorthand': false,
            'star-property-hack': false,
            'text-indent': false,
            'underscore-property-hack': false,
            'unique-headings': false,
            'universal-selector': false,
            'unqualified-attributes': false,
            'vendor-prefix': false,
            'zero-units': true,
            'bulletproof-font-face': false
        }))
        .pipe(gulpCsslint.reporter(customReporter))

        .pipe(gulpConcat(options.paths.dest.styleFileName))

        .pipe(gulpSourcemaps.write('.'))

        .pipe(gulp.dest(options.paths.dest.styles))
        ;

        /* see all gulpHtmlmin options: https://github.com/CSSLint/csslint/wiki/Rules-by-ID */
});
/* end task: styles */

/* start task: csscomb */
gulp.task('csscomb', function() {
    return gulp.src(options.paths.styles, {base: './'})
        .pipe(gulpPlumber())

        .pipe(gulpCsscomb())

        .pipe(gulp.dest('./'))
        ;
});
/* end task: csscomb */

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

/* start task: templates */
gulp.task('templates', function(){

    /* custom reporter function for gulpHtmlhint*/
    var reporter = function reporter(file){
        var c = gulpUtil.colors;

        var errorCount = file.htmlhint.errorCount;
        var plural = errorCount === 1 ? '' : 's';

        process.stderr.write('\x07'); // Send a beep to the terminal so it bounces

        gulpUtil.log(c.cyan(errorCount) + ' error' + plural + ' found in ' + c.magenta(file.path));

        file.htmlhint.messages.forEach(function(result){
            var message = result.error,
                line = message.line,
                col = message.col,
                detail = typeof message.line !== 'undefined' ?
                c.yellow('L' + line) + c.red(':') + c.yellow('C' + col) : c.yellow('GENERAL');

            gulpUtil.log(
                c.red('[') + detail + c.red(']') + c.yellow(' ' + message.message) + ' (' + message.rule.id + ')'
            );
        });
    };

    /* see all gulpHtmlmin options: https://github.com/kangax/html-minifier */
    /* see all gulpHtmlhint options: https://github.com/yaniswang/HTMLHint/wiki/Rules */

    var filter  = gulpFilter(['**', '!partials/*']);

    gulp.src(options.paths.mustache)
        .pipe(gulpPlumber())

        .pipe(gulpChanged(options.paths.dest.mustache))
        .pipe(mustacheRender())

        .pipe(filter)
        .pipe(gulpHtmlhint({
            'tagname-lowercase': true,
            'attr-lowercase': true,
            'attr-value-double-quotes': false,
            'attr-value-not-empty': true,
            'attr-no-duplication': true,
            'doctype-first': true,
            'tag-pair': true,
            'tag-self-close': true,
            'spec-char-escape': true,
            'id-unique': true,
            'src-not-empty': true,
        }))
        .pipe(gulpHtmlhint.reporter(reporter))
        .pipe(filter.restore())

        .pipe(gulpHtmlmin({collapseWhitespace: true}))

        .pipe(gulp.dest(options.paths.dest.mustache));
});
/* end task: templates */

/* start task: ttf2woff */
gulp.task('ttf2woff', function(){
    gulp.src(options.paths.fontsConverts.src)
        .pipe(gulpTtf2woff())
        .pipe(gulp.dest(options.paths.fontsConverts.dest));
});
/* end task: ttf2woff */

/* start task: images2webp */
gulp.task('images2webp', function () {
    return gulp.src(options.paths.optimizeImages.src)
        .pipe(gulpWebp({quality: 60}))
        .pipe(gulp.dest(options.paths.optimizeImages.dest))
        ;
});
/* end task: images2webp */

/* start task: optimize-images */
gulp.task('optimize-images', function () {
    return gulp.src(options.paths.optimizeImages.src)
        .pipe(gulpImage())
        .pipe(gulp.dest(options.paths.optimizeImages.dest))
        ;
});
/* end task: optimize-images */

/* start task: sprites */
gulp.task('sprites', function () {
    var types = ['png', 'jpg'];

    types.forEach(function (type, i) {
        spriteDirs(type);
    });

    function spriteDirs(type){
        var files = fs.readdirSync('src/client/images/sprites' + '/' + type);
        var dirs = [];

        files.forEach(function(file, i){
            var stat = fs.statSync('src/client/images/sprites' + '/' + type + '/' + file);

            if(stat.isDirectory()){
                dirs.push(file);
            }
        });

        dirs.forEach(function (dir, i) {
            spriteRender(dir, type);
        });
    }

    function spriteRender(dir, type){
        var spriteData = gulp.src('src/client/images/sprites' + '/' + type + '/' + dir + '/*.' + type)
            .pipe(gulpPlumber())

            .pipe(gulpSpritesmith({
                imgName: 'sprite-' + dir + '.' + type,
                cssName: 'sprite-' + dir + '.less',
                cssFormat: 'less',
                algorithm: 'top-down',
                padding: 20,
                cssVarMap: function (sprite) {
                    sprite.name = 'sprite-' + dir + '-' + sprite.name;
                },
                cssSpritesheetName: 'spritesheet-' + dir
            }));

        spriteData.img
            .pipe(gulp.dest('src/client/images'));

        spriteData.css
            .pipe(gulp.dest('src/client/styles/less/sprites'));
    }
});
/* end task: sprites */

/* start task: test */
gulp.task('test', function() {
    var execOptions = {
        continueOnError: false, // default = false, true means don't emit error event
        pipeStdout: true, // default = false, true means stdout is written to file.contents
        customTemplatingThing: "" // content passed to gulpUtil.template()
    };

    var reportOptions = {
        err: true, // default = true, false means don't write err
        stderr: true, // default = true, false means don't write stderr
        stdout: true // default = true, false means don't write stdout
    };

    return gulp.src(options.paths.test)
        .pipe(gulpPlumber())
        .pipe(gulpExec('node ./node_modules/mocha-phantomjs/bin/mocha-phantomjs ' + options.paths.test, execOptions))
        .pipe(gulpExec.reporter(reportOptions));
});
/* end task: test */

/* start task: browser-sync */
gulp.task('browser-sync', function() {
    browserSync({
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });
});
/* end: browser-sync */

/* start: gh-pages */
gulp.task('gh-pages', function () {
    return gulp.src('./dist/**/*')
        .pipe(gulpGhPages());
});
/* end: gh-pages */

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

/* custom plagins */
function lessRender() {
    var data = [];
    var content = new Buffer(0);
    var markerStart = '/*start file*/';
    var markerStartRegex = /(\/\*start file\*\/)/g;
    var markerEnd = '/*end file*/';
    var markerEndRegex = /(\/\*end file\*\/)/g;

    function bufferContents(file){
        if (file.isNull()) {
            return;
        }

        data.push(file);

        if (content.length !== 0) {
            content = Buffer.concat([content, new Buffer(0)]);
        }

        content = Buffer.concat([content, new Buffer(markerStart + '/* ' + path.basename(file.history) + ' */' + file.contents + markerEnd)]);
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
                var css = output.css;
                var markerStartIndex = [];
                var markerEndIndex = [];

                css.replace(markerStartRegex, function (a, b, index) {
                    markerStartIndex.push(index);
                });

                css.replace(markerEndRegex, function (a, b, index) {
                    markerEndIndex.push(index);
                });

                for(var i = 0; i <= data.length - 1; i++){
                    var cssPart = css.substring(markerStartIndex[i] + markerStart.length, markerEndIndex[i]);

                    data[i].contents = new Buffer(cssPart);
                    _this.emit('data', data[i]);

                    if(i == data.length - 1){
                        _this.emit('end');
                    }
                }
            },
            function(error) {
                console.log(error);
            }
        );
    }

    return es.through(bufferContents, endStream);
}

function mustacheRender(options) {
    var _this;
    var data = [];
    var templates = {};
    var views = {};
    var partials = {};

    var options = _.extend({
            extension: '.html',
            partials: {}
        }, options);

    function bufferContents(file){
        if (file.isNull()) {
            return;
        }

        data.push(file);
    }

    function endStream(){
        if (!data) {
            return this.emit('end');
        }

        _this = this;

        dataLoader();
    }

    function dataLoader(){
        var dataLength = data.length;
        var dataIndex = 0;

        data.forEach(function(el, i){
            var ext = path.extname(data[i].path);
            var name = path.basename(data[i].path).replace(ext, '');
            var viewPath = 'src/client/scripts/js/views/' + name + '.js';

            if(path.dirname(data[i].path).indexOf('partials') >= 0){
                partials[name] = data[i].contents.toString('utf8');
            }else{
                partials[name] = {};
            }

            templates[name] = data[i].contents.toString('utf8');

            fs.readFile(viewPath, function(err, d){
                if(d){
                    try{
                        d = eval(d.toString('utf8'));
                    }
                    catch(e){

                    }
                }else{
                    d = {};
                }

                views[name] = d;

                if(dataIndex == dataLength - 1){
                    render();
                }

                dataIndex++;
            });
        });
    }

    function render(){
        partials = _.extend(partials, options.partials);

        /* Load base view and add to all views */
        fs.readFile('src/client/scripts/js/views/data.js', function(err, d){
            Object.keys(templates).forEach(function(key, i){
                mustache.parse(templates[key]);
                var view =  _.extend(views[key], eval(d.toString('utf8')));
                var content = mustache.render(templates[key], view, partials);

                data[i].contents = new Buffer(content);
                data[i].path = gulpUtil.replaceExtension(data[i].path, options.extension);

                _this.emit('data', data[i]);

                if(i == data.length - 1){
                    _this.emit('end');
                }
            });
        });
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

            if(filename.indexOf('jpg') >= 0 || filename.indexOf('png') >= 0 || filename.indexOf('gif') >= 0 || filename.indexOf('jpeg') >= 0 || filename.indexOf('webp') >= 0){
                return "url(\"../../images/" + filename + "\")";
            }

            return match;
        });

        file.contents = new Buffer(content);

        callback(null, file);
    }

    return es.map(render);
}

function testPipe() {
    function render(file, callback) {
        console.log(file.path);

        callback(null, file);
    }

    return es.map(render);
}