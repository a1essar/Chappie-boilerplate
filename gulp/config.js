'use strict';

var config = {
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
    ],
    'paths': {
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
            'src/client/templates/*.html',
            'src/client/templates/**/*.html',
            'src/client/templates/*.mustache',
            'src/client/templates/**/*.mustache'
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
    }
};


module.exports = config;
