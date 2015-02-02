define('app', [
    'domReady',
    'jquery',
    'underscore',
    'backbone',
    'modernizr',
    'detectizr',
    'text!../../json/config.json',
    'utils',
    'modules/form'
],  function ( domReady, $, _, Backbone, Modernizr, Detectizr, config, utils, Form ) {
    'use strict';

    console.log('%cfile: app.js', 'color: #C2ECFF');

    /** private */
    var _this;
    var _defaults = JSON.parse(config);

    /** constructor */
    function App(){
        console.log('%ctrace: App -> constructor', 'color: #ccc');

        _this = this;

        /** public */
        this.options = _.extend({

            },
            _defaults
        );

        utils.shims();

        var form = new Form();

        domReady(function () {
            console.log('%ctrace: App -> constructor -> domReady', 'color: #ccc');

            form.domInitialize();
        });
    }
    
    return App;
});