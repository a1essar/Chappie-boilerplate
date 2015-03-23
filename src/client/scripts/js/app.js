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
], function ( domReady, $, _, Backbone, Modernizr, Detectizr, config, utils, Form ) {
    'use strict';

    console.log('%cfile: app.js', 'color: #C2ECFF');

    /** private */
    var defaults = JSON.parse(config),
        self;

    /** constructor
     * @return {boolean}
     */
    function App(){
        console.log('%ctrace: App -> constructor', 'color: #ccc');

        self = this;

        /** public */
        this.options = _.extend({

            },
            defaults
        );

        utils.shims();

        var form = new Form();
        form.someMethod();

        domReady(function () {
            console.log('%ctrace: App -> constructor -> domReady', 'color: #ccc');
        });
    }

    return App;
});
