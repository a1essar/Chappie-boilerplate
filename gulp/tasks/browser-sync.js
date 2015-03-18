'use strict';

var browserSync = require('browser-sync');

var gulp = require('gulp');

/* start task: browser-sync */
gulp.task('browser-sync', function() {
    browserSync({
        notify: false,
        server: {
            baseDir: 'dist'
        },
        'no-online': true
    });
});
/* end: browser-sync */