define('app', [
    'jquery',
    'underscore',
    'backbone',
    'modernizr',
    'detectizr'
],  function ( $, _, Backbone, Modernizr, Detectizr ) {
    'use strict';

    var _this;
    
    var defaults = {
        language: 'ru'
    };

    function App(options){
        console.log('%ctrace: App', 'color: #ccc');

        this.options = $.extend({
        }, defaults, options);

        this.dom = {};

        this.dom.$body = $('body');

        _this = this;

        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }

        _this.initialize();
    }
    
    App.prototype = {
        initialize: function(){
            console.log('%ctrace: App -> initialize', 'color: #ccc');
        },
    };
    
    return App;
});