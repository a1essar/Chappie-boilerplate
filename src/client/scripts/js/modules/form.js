/**
 *
 * */
define([
    'domReady',
    'jquery',
    'utils',
    'spin'
], function (domReady, $, utils, Spinner) {
    'use strict';

    console.log('%cfile: form.js', 'color: #C2ECFF');

    /** private */
    var el = '.js__ajax-form',
        defaults = {
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
        },
        submit,
        ModuleApi;

    /** constructor */
    function Module() {
        console.log('%ctrace: Form -> constructor', 'color: #ccc');

        /** public */
        var self = this;

        domReady(function () {
            console.log('%ctrace: Form -> constructor -> domReady', 'color: #ccc');

            $('body').off('click', el).on('click', el, function(e) {
                e.preventDefault();

                submit(e, self);
            });
        });
    }

    submit = function submit(e) {
        console.log('%ctrace: Form -> submit', 'color: #ccc');

        var $el = $(e.currentTarget),
        $form = $el.parents('form'),
        action = $el.attr('data-action') || $form.attr('action'),
        data = $form.serialize(),
        caption = $el.html(),
        spinner;

        $el.css('position', 'relative').css('width', $el.outerWidth()).css('height', $el.outerHeight()).html('&nbsp');

        spinner = new Spinner(defaults.spinner).spin($el[0]);

        $el.attr('disabled', 'disabled');

        utils.ajax({
            url: action,
            data: data,
            doneCallback: function(ajaxData) {
                spinner.stop();
                $el.css('position', '').css('width', '').css('height', '').html(caption);
                $el.removeAttr('disabled', 'disabled');

                if (!ajaxData.hasOwnProperty('parameters')) {
                    ajaxData.parameters = {};
                }

                ajaxData.parameters.$form = $form;

                utils.callback.done(ajaxData);
            },
            failCallback: function() {
                spinner.stop();
                $el.css('position', '').css('width', '').css('height', '').html(caption);
                $el.removeAttr('disabled', 'disabled');
            }
        });
    };

    ModuleApi = function ModuleApi() {
        this.someMethod = function() {

        };
    };

    Module.prototype = new ModuleApi();

    return Module;
});
