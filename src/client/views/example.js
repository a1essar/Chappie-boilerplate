'use strict';

var fs = require('fs'),
    path = require('path'),
    data,
    view = {},
    filename = path.basename(module.filename, path.extname(module.filename));

try {
    data = fs.readFileSync('src/client/views/' + filename + '.json', 'utf8');
    view = JSON.parse(data);
} catch (err) {
    console.log(err);
}

module.exports = (function(view) {
    Object.keys(view.list).forEach(function (el, i) {
        view.list[i].name = view.list[i].name + ' ' + parseInt(i + 1, 10);
        view.list[i].index = i + 1;
    });

    return view;
})(view);
