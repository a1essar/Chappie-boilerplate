'use strict';

(function (name, context, definition) {
    /*eslint-disable */
    if (typeof define === 'function' && define.amd) {
        define(['text!../../../json/competition.json'], definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        var fs = require('fs'),
            view = fs.readFileSync('src/client/json/competition.json', 'utf8');
        module.exports = definition(view);
    } else {
        var r = new XMLHttpRequest(),
            view;
        r.open('GET', '/json/competition.json', true);
        r.onreadystatechange = function () {
            if (r.readyState !== 4 || r.status !== 200) {
                return;
            }

            view = r.responseText;
            context[name] = definition(view);
        };
        r.send();
    }
    /*eslint-enable */
})('competition', this, function(view) {
    view = JSON.parse(view) || {};

    Object.keys(view.list).forEach(function (el, i) {
        view.list[i].name = view.list[i].name + ' ' + parseInt(i + 1, 10);
        view.list[i].index = i + 1;
    });

    return view;
});
