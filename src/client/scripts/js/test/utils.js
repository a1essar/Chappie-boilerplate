define(['chai', 'utils'], function(chai, utils) {
    describe('Testing "utils.js"', function(done){
        it('utils.test()', function(){
            chai.expect(utils.test()).to.be.not.ok();
        });
    });
});