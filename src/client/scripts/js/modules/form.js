/**
 *
 * */
define([
    'domReady',
    'jquery',
    'utils',
    'spin'
],  function (domReady, $, utils, Spinner) {
    'use strict';

    console.log('%cfile: form.js', 'color: #C2ECFF');

    /** private */
    var _this,
        el = '.js__ajax-form',
        _defaults = {
            'spinner': {
                lines: 13,
                length: 6,
                width: 2,
                radius: 3,
                corners: 1,
                rotate: 0,
                direction: 1,
                color: '#000',
                speed: 2,
                trail: 60,
                shadow: false,
                hwaccel: true,
                className: 'spinner',
                zIndex: 100500,
                top: '50%',
                left: '50%'
            }
        };

    /** constructor */
    function Module(){
        console.log('%ctrace: Form -> constructor', 'color: #ccc');

        /** public */
        _this = this;

        domReady(function () {
            console.log('%ctrace: Form -> constructor -> domReady', 'color: #ccc');

            $('body').off('click', el).on('click', el, function(e){
                e.preventDefault();

                submit(e);
            });
        });
    }

    function submit(e){
        console.log('%ctrace: Form -> submit', 'color: #ccc');

        var $el = $(e.currentTarget),
        $form = $el.parents('form'),
        action = $el.attr('data-action') || $form.attr('action'),
        data = $form.serialize(),
        caption = $el.html();

        $el.css('position', 'relative').css('width', $el.outerWidth()).css('height', $el.outerHeight()).html('&nbsp');

        var spinner = new Spinner(_defaults.spinner).spin($el[0]);

        $el.attr('disabled', 'disabled');

        utils.ajax({
            url: action,
            data: data,
            doneCallback: function(data){
                spinner.stop();
                $el.css('position', '').css('width', '').css('height', '').html(caption);
                $el.removeAttr('disabled', 'disabled');

                if(!data.hasOwnProperty('parameters')){
                    data.parameters = {};
                }

                data.parameters.$form = $form;

                utils.callback.done(data);
            },
            failCallback: function(){
                spinner.stop();
                $el.css('position', '').css('width', '').css('height', '').html(caption);
                $el.removeAttr('disabled', 'disabled');
            }
        });
    }

    var ModuleApi = function ModuleApi(){
        this.someMethod = function(){

        };
    };

    Module.prototype = new ModuleApi();

    return Module;
});