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
    var getSitemap;

    getSitemap = function getSitemap() {
        var links = {};

        Object.keys(view.sitemap).forEach(function(key, i) {
            links[view.sitemap[i].name] = view.sitemap[i];
        });

        return links;
    };

    view.getSitemap = getSitemap;

    return view;
})(view);
