'use strict';

var _ = require('underscore'),
    es = require('event-stream'),
    fs = require('fs'),
    path = require('path'),
    mustache = require('mustache'),
    gulpUtil = require('gulp-util'),
    mustacheRender;

mustacheRender = function mustacheRender(options) {
    var self,
        data = [];

    options = _.extend({
        extension: '.html',
        partials: {}
    }, options);

    function bufferContents(file) {
        if (file.isNull()) {
            return;
        }

        data.push(file);
    }

    function endStream() {
        if (!data) {
            return this.emit('end');
        }

        self = this;

        var promise = new Promise(function(resolve, reject) {
            getViews(resolve);
        });

        promise.then(function(args) {
            args.templates = getTemplates();
            return args;
        }).then(function(args) {
            render(args.templates, args.views);
        });
    }

    function render(templates, views) {
        templates.partials = _.extend(templates.partials, options.partials);

        Object.keys(templates.full).forEach(function(key, i) {
            mustache.parse(templates.full[key]);
            var content = mustache.render(templates.full[key], views, templates.partials);

            data[i].contents = new Buffer(content);
            data[i].path = gulpUtil.replaceExtension(data[i].path, options.extension);

            self.emit('data', data[i]);

            if (i == data.length - 1) {
                self.emit('end');
            }
        });
    }

    function getViews(resolve) {
        var views = {},
            files;

        files = getFiles('src/client/views');

        files.forEach(function(el, i) {
            var ext = path.extname(el),
                viewName = path.basename(el, ext),
                view;

            if (ext === '.js') {
                try {
                    delete require.cache[require.resolve('../../' + el)];
                    view = require('../../' + el);
                } catch (err) {
                    console.log(err);
                }
            }

            if (ext === '.json' && !views[viewName]) {
                try {
                    view = fs.readFileSync(el, 'utf8');
                    view = JSON.parse(view);
                } catch (err) {
                    console.log(err);
                }
            }

            if (view) {
                views[viewName] = view;
            }
        });

        resolve({
            views: views
        });
    }

    function getTemplates() {
        var templates = {
                full: [],
                partials: []
            };

        data.forEach(function(el, i) {
            var ext = path.extname(data[i].path),
                name = path.basename(data[i].path).replace(ext, '');

            if (path.dirname(data[i].path).indexOf('partials') < 0) {
                templates.full[name] = data[i].contents.toString('utf8');
            } else {
                templates.partials[name] = data[i].contents.toString('utf8');
            }
        });

        return templates;
    }

    function getFiles(dir, data, allFiles) {
        dir = dir || '.';
        data = data || {};
        allFiles = allFiles || [];

        var files = fs.readdirSync(dir);

        files.forEach(function(el, i) {
            var name = dir + '/' + files[i];

            if (fs.statSync(name).isDirectory()){
                getFiles(name, data, allFiles);
            } else {
                allFiles.push(name);
            }
        });

        return allFiles;
    }

    return es.through(bufferContents, endStream);
};

module.exports = mustacheRender;
