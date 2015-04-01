/**
 *
 * */
define([
    'domReady',
    'jquery',
    'underscore',
    'backbone',
    'modernizr',
    'detectizr',
    'text!../../json/config.json',
    'utils',
    'modules/form'
], function (domReady, $, _, Backbone, Modernizr, Detectizr, config, utils, form) {
    'use strict';

    console.log('%cfile: app.js', 'color: #C2ECFF');

    var defaults = JSON.parse(config);

    function app() {
        console.log('%ctrace: app()', 'color: #ccc');

        utils.shims();
        form(defaults);

        domReady(function () {
            console.log('%ctrace: app() -> domReady', 'color: #ccc');
        });
    }

    return app;
});
