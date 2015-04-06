/**
 *
 * */
define([
    'domReady',
    'jquery',
    'lodash',
    'modernizr',
    'text!../../json/config.json',
    'utils',
    'modules/form-sender',
    'modules/modal',
    'director'
], function (domReady, $, _, Modernizr, config, utils, formSender, Modal) {
    'use strict';

    console.log('%cfile: app.js', 'color: #C2ECFF');

    var defaults = JSON.parse(config),

        Router = Router || window.Router,
        appRouter,
        modal;

    function app() {
        console.log('%ctrace: app()', 'color: #ccc');

        modal = new Modal();

        defaults.routes = {
            '/modal/:id': modal.show
        };

        appRouter = new Router(defaults.routes);
        utils.shims();
        formSender(defaults);

        domReady(function () {
            console.log('%ctrace: app() -> domReady', 'color: #ccc');

            appRouter.init();
        });
    }

    return app;
});
