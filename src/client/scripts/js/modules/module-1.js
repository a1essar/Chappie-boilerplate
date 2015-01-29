define('modules/module-1', [
    'utils'
],  function (utils) {
    'use strict';

    console.log('%cfile: module-1.js', 'color: #C2ECFF');

    /** private */
    var _this;
    var _defaults = {};

    /** constructor */
    function Module(options){
        console.log('%ctrace: Module-1 -> constructor', 'color: #ccc');

        /** public */
        this.options = _.extend(_defaults, options);
        _this = this;

        utils.ajax({
            failCallback: function(){
                utils.callback.done({
                    type: 'success',
                    namespace: 'defaults',
                    code: 'success'
                });
            }
        });
    }

    var moduleApi = function moduleApi(){
        this.method1 = function(){

        };
    };

    Module.prototype = new moduleApi();

    return Module;
});