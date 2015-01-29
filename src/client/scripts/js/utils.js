define('utils', [
    'utils/callback'
],  function (callback) {
    'use strict';

    console.log('%cfile: utils.js', 'color: #C2ECFF');

    var utils = {};
    utils.callback = callback;

    utils.shims = function(){
        console.log('%ctrace: utils.shims', 'color: #ccc');

        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }
    };

    utils.query = function(selector, context){
        var context = context || 'body';
        return $(selector);
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