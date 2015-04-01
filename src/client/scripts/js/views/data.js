'use strict';

(function (name, context, definition) {
    /*eslint-disable */
    if (typeof define === 'function' && define.amd) {
        return define(['text!../../../json/data.json'], definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        var fs = require('fs'),
            view = fs.readFileSync('src/client/json/data.json', 'utf8');
        module.exports = definition(view);
        return module.exports;
    } else {
        var r = new XMLHttpRequest(),
            view;
        r.open('GET', '/json/data.json', true);
        r.onreadystatechange = function () {
            if (r.readyState !== 4 || r.status !== 200) {
                return;
            }

            view = r.responseText;
            context[name] = definition(view);
        };
        r.send();
        return context[name];
    }
    /*eslint-enable */
})('data', this, function(view) {
    view = JSON.parse(view) || {};

    return view;
});
