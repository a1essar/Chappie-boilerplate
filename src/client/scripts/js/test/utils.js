/**
 *
 * */
define(['chai', 'utils'], function(chai, utils) {
    'use strict';

    describe('Testing "utils.js"', function(){
        it('utils.test()', function(){
            chai.expect(utils.test()).to.be.not.ok();
        });
    });
});