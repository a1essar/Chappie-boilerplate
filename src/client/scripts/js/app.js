define('app', [
    'domReady',
    'jquery',
    'underscore',
    'backbone',
    'modernizr',
    'detectizr',
    'text!../../json/config.json',
    'utils',
    'modules/module-1'
],  function ( domReady, $, _, Backbone, Modernizr, Detectizr, config, utils, Module1 ) {
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

        var module1 = new Module1({
            'foo': 'bar'
        });

        domReady(function () {
            console.log(utils.query('body'));
        });
    }
    
    return App;
});