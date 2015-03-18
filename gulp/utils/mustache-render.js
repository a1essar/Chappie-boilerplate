'use strict';

var _ = require('underscore');
var es = require('event-stream');
var fs = require('fs');
var path = require('path');
var mustache = require('mustache');

var gulpUtil = require('gulp-util');

var mustacheRender = function mustacheRender(options) {
    var _this;
    var data = [];
    var templates = {};
    var views = {};
    var partials = {};

    var options = _.extend({
        extension: '.html',
        partials: {}
    }, options);

    function bufferContents(file){
        if (file.isNull()) {
            return;
        }

        data.push(file);
    }

    function endStream(){
        if (!data) {
            return this.emit('end');
        }

        _this = this;

        dataLoader();
    }

    function dataLoader(){
        var dataLength = data.length;
        var dataIndex = 0;

        data.forEach(function(el, i){
            var ext = path.extname(data[i].path);
            var name = path.basename(data[i].path).replace(ext, '');
            var viewPath = 'src/client/scripts/js/views/' + name + '.js';

            if(path.dirname(data[i].path).indexOf('partials') >= 0){
                partials[name] = data[i].contents.toString('utf8');
            }else{
                partials[name] = {};
            }

            templates[name] = data[i].contents.toString('utf8');

            fs.readFile(viewPath, function(err, d){
                if(d){
                    try{
                        d = eval(d.toString('utf8'));
                    }
                    catch(e){

                    }
                }else{
                    d = {};
                }

                views[name] = d;

                if(dataIndex == dataLength - 1){
                    render();
                }

                dataIndex++;
            });
        });
    }

    function render(){
        partials = _.extend(partials, options.partials);

        /* Load base view and add to all views */
        fs.readFile('src/client/scripts/js/views/data.js', function(err, d){
            Object.keys(templates).forEach(function(key, i){
                mustache.parse(templates[key]);
                var view =  _.extend(views[key], eval(d.toString('utf8')));
                var content = mustache.render(templates[key], view, partials);

                data[i].contents = new Buffer(content);
                data[i].path = gulpUtil.replaceExtension(data[i].path, options.extension);

                _this.emit('data', data[i]);

                if(i == data.length - 1){
                    _this.emit('end');
                }
            });
        });
    }

    return es.through(bufferContents, endStream);
};

module.exports = mustacheRender;