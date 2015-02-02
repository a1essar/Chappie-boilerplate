define('modules/form', [
    'utils',
    'spin'
],  function (utils, Spinner) {
    'use strict';

    console.log('%cfile: module-1.js', 'color: #C2ECFF');

    /** private */
    var _this,
        el = '.js__ajax-form',
        _defaults = {
            'spinner': {
                lines: 13, // The number of lines to draw
                length: 6, // The length of each line
                width: 2, // The line thickness
                radius: 3, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 2, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 100500, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent
                left: '50%' // Left position relative to parent
            }
        };

    /** constructor */
    function Module(){
        console.log('%ctrace: Module-1 -> constructor', 'color: #ccc');

        /** public */
        _this = this;
    }

    function submit(e){
        var $el = utils.selector(e.currentTarget),
        $form = $el.parents('form'),
        action = $el.attr('data-action') || $form.attr('action'),
        data = $form.serialize(),
        caption = $el.html();

        $el.css('position', 'relative').css('width', $el.outerWidth()).css('height', $el.outerHeight()).html('&nbsp');

        var spinner = new Spinner(_defaults.spinner).spin($el[0]);

        $el.attr('disabled', 'disabled');

        utils.ajax({
            url: action,
            data: data,
            doneCallback: function(data){
                spinner.stop();
                $el.css('position', '').css('width', '').css('height', '').html(caption);
                $el.removeAttr('disabled', 'disabled');
                utils.callback.done(data);
            },
            failCallback: function(data){
                spinner.stop();
                $el.css('position', '').css('width', '').css('height', '').html(caption);
                $el.removeAttr('disabled', 'disabled');
            }
        });
    }

    var moduleApi = function moduleApi(){
        this.domInitialize = function(){
            utils.addEventListener('click', el, function(e){
                e.preventDefault();

                submit(e);
            });
        };
    };

    Module.prototype = new moduleApi();

    return Module;
});