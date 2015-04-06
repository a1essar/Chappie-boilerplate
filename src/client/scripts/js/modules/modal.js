/**
 *
 * */
define([
    'domReady',
    'jquery',
    'jquery.happymodal'
], function(domReady, $) {
    'use strict';

    console.log('%cfile: modal.js', 'color: #C2ECFF');

    var show;

    function Modal() {
        console.log('%ctrace: module modal: Modal()', 'color: #ccc');

        domReady(function () {
            console.log('%ctrace: module modal: Modal() -> domReady', 'color: #ccc');
        });
    }

    show = function modal(id, hideCallback) {
        console.log('%ctrace: module modal: modal()', 'color: #ccc');

        var $modal = $('[data-happymodal="' + id + '"]'),
            api;

        hideCallback = hideCallback || function() {

        };

        if ($modal.length <= 0) {
            return false;
        }

        api = $.data($modal[0], 'plugin_happymodal');

        if (!api) {
            if (window.location.hash.indexOf('modal') >= 0) {
                window.location.hash = '';
            }

            return false;
        }

        api.show();

        api.options.hideCallback = function() {
            var top = $(window).scrollTop();

            window.location.hash = '';

            if (top > 0) {
                $(window).scrollTop(top);
            }

            hideCallback();

            console.log('%ctrace: modal hide', 'color: #ccc');
        };

        console.log('%ctrace: modal show', 'color: #ccc');
    };

    Modal.prototype.show = show;

    return Modal;
});
