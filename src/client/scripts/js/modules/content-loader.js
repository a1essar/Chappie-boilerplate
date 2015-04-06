define([
    'domReady',
    'jquery',
    'lodash',
    'utils',
    'spin',
    'mustache',
    'velocity',
    'velocity.ui'
], function (domReady, $, _, utils, Spinner, Mustache) {
    'use strict';

    console.log('%cfile: content-loader.js', 'color: #C2ECFF');

    var initialize,
        loader,
        loaderHandler,
        templateLoader,

        defaults = {
            spinner: {
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

        element = '[data-content-loader]',
        templates = {},

        $elements;

    loaderHandler = function loaderHandler(event) {
        var $this = $(event.target),
            $container,
            caption = $this.html(),
            template,
            options,
            spinner;

        options = JSON.parse($this.attr('data-content-loader'));

        $container = $(options.container);
        template = templates[options.id];
        Mustache.parse(template);

        $this.css('position', 'relative').css('width', $this.outerWidth()).css('height', $this.outerHeight()).html('&nbsp');

        spinner = new Spinner(defaults.spinner).spin($this[0]);

        $this.attr('disabled', 'disabled');

        utils.ajax({
            url: options.action,
            data: options.data,
            type: options.type,
            doneCallback: function(ajaxData) {
                spinner.stop();
                $this.css('position', '').css('width', '').css('height', '').html(caption);
                $this.removeAttr('disabled', 'disabled');

                if (!ajaxData.hasOwnProperty('parameters')) {
                    ajaxData.parameters = {};
                }

                if (options.data.offset + options.data.limit >= options.count) {
                    $this.css('display', 'none');
                } else {
                    $this.css('display', 'inline-block');
                }

                var rendered = Mustache.render(template, ajaxData.content);

                if (options.appendType === 'html') {
                    $container.html(rendered);
                }

                if (options.appendType === 'append') {
                    $container.append(rendered);
                }

                options.data.offset += options.data.limit;
                $this.attr('data-content-loader', JSON.stringify(options));

                return true;
            },
            failCallback: function() {
                spinner.stop();
                $this.css('position', '').css('width', '').css('height', '').html(caption);
                $this.removeAttr('disabled', 'disabled');
            }
        });
    };

    templateLoader = function templateLoader($this) {
        var options = JSON.parse($this.attr('data-content-loader'));

        utils.ajax({
            url: options.template,
            data: {},
            type: 'get',
            dataType: 'html',
            doneCallback: function(ajaxData) {
                templates[options.id] = ajaxData;
            },
            failCallback: function() {
            }
        });
    };

    loader = function loader(el) {
        templateLoader($(el));

        $(el).off('click').on('click', function (event) {
            loaderHandler(event);
        });
    };

    initialize = function initialize() {
        console.log('%ctrace: content-loader', 'color: #ccc');

        domReady(function () {
            $elements = $(element);

            if ($elements.length <= 0) {
                console.warn('%ctrace: content-loader: not found dom elements', 'color: #ccc');
                return false;
            }

            $elements.each(function(i, el) {
                loader($(el));
            });
        });
    };

    return initialize;
});
