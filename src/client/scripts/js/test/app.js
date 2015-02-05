define(['chai', 'app'], function(chai, App) {
    var app = new App();

    describe('Testing "Main"', function(done){
        beforeEach(function(done){
            done();
        });

        // start 1st suite
        describe('#1 Main Suite:', function(){
            it('App.test', function(){
                chai.expect(app.test()).to.equal(true);
            });
        });
    });
});