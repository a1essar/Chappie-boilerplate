/**
 *
 * */

'use strict';

require.config({
    baseUrl: '../',
    paths: {
        'chai': '../../../../node_modules/chai/chai',
        'domReady': '../../../../vendor/requirejs-domready/domReady',
        'text': '../../../../vendor/requirejs-text/text',
        'jquery': '../../../../vendor/jquery/dist/jquery',
        'underscore': '../../../../vendor/underscore/underscore',
        'backbone': '../../../../vendor/backbone/backbone',
        'modernizr': '../../../../vendor/modernizr/modernizr',
        'detectizr': '../../../../vendor/detectizr/dist/detectizr',
        'spin': '../../../../vendor/spin.js/spin'
    }
});

require([
    'test/app',
    'test/utils'
], function() {
    if (typeof mochaPhantomJS !== 'undefined'){
        mochaPhantomJS.run();
    }else{
        mocha.run();
    }
});