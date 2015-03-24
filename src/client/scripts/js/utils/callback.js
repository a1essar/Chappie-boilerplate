/**
 *
 * */
define([
], function () {
    'use strict';

    console.log('%cfile: callback.js', 'color: #C2ECFF');

    var callback = {};

    callback.done = function(data) {
        console.log('%ctrace: callback.done', 'color: #ccc', data);

        var type = data.type,
            parameters = data.parameters || null,
            code = data.code,
            namespace = data.namespace || 'defaults',
            text = data.text;

        if (!this[namespace] || !this[namespace][code]) {
            console.warn('%cCallback -> done: undefined callback', 'color: #FF7000');
            return false;
        }

        this[namespace][code](type, text, parameters);

        return true;
    };

    callback.defaults = {
        'error': function() {
            console.log('%ctrace: callback.defaults.error', 'color: #ccc');
        },
        'success': function() {
            console.log('%ctrace: callback.defaults.success', 'color: #ccc');
        }
    };

    return callback;

});
