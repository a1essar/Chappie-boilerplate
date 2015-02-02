define('utils', [
    'utils/callback'
],  function (callback) {
    'use strict';

    console.log('%cfile: utils.js', 'color: #C2ECFF');

    var utils = {};
    utils.callback = callback;

    utils.webpTest = function(){
        var a=new Image;
        a.onerror=function(){Modernizr.addTest("webp",!1)};
        a.onload=function(){Modernizr.addTest("webp",
            function(){
                return a.width==1
            })};
        a.src="data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==";
    };

    utils.locationOrigin = function(){
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }
    };

    utils.shims = function(){
        console.log('%ctrace: utils.shims', 'color: #ccc');

        this.locationOrigin();
        this.webpTest();
    };

    utils.selector = function(selector, context){
        /*return context && context.querySelectorAll(selector) || document.querySelectorAll(selector);*/

        return $(selector, context) || $(selector);
    };

    utils.addEventListener = function(event, el, callback, context){
        return $('body').off(event, el).on(event, el, function (e) {
            callback(e);
        });
    };

    utils.ajax = function(options){
        console.log('%ctrace: utils.ajax', 'color: #ccc');

        var settings = _.extend({
            url : '/',
            data : {},
            type: 'post',
            dataType: 'json',
            doneCallback: function(data){

            },
            failCallback: function(data){

            }
        }, options);

        $.ajax({
            url: settings.url,
            cache : false,
            data: settings.data,
            type: settings.type,
            dataType: settings.dataType
        }).done(function(data, textStatus) {
            console.log('%cajax done textStatus: ' + textStatus, 'color: #9FE59F');
            settings.doneCallback(data);
        }).fail(function(data, textStatus) {
            console.warn('%cajax fail textStatus: ' + textStatus, 'color: #FF7000');
            settings.failCallback(data);
        });
    };

    return utils;
});