define(['chai', 'app'], function(chai, App) {
    var MyApp;

    describe('Testing "app.js"', function(done){
        before(function(){
            MyApp = new App();
        });

        it('App initialization class', function(){
            chai.expect(MyApp).to.be.an.instanceof(App);
        });
    });
});