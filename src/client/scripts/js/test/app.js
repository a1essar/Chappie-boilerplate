/**
 *
 * */
define(['chai', 'app'], function(chai, App) {
    'use strict';

    var MyApp;

    describe('Testing "app.js"', function() {
        before(function() {
            MyApp = new App();
        });

        it('App initialization class', function() {
            chai.expect(MyApp).to.be.an.instanceof(App);
        });
    });
});
