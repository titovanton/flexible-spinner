(function($){
    $.fn.flexibleSpinner = function(jsInit) {
        var doDec, doInc

        doDec = function() {
            var value = $(this).val()
            if (value > 1) value = value*1 - 1
            $(this).val(value)
        }

        doInc = function() {
            var value = $(this).val()
            value = value*1 + 1
            $(this).val(value)
        }

        function init($spinner) {

            // default init
            var settings = {

                    // could be init from data-<name> attrs
                    inc: '.inc-spinner',
                    dec: '.dec-spinner',
                    stickyKeyDelay: 500,
                    stickyChangeSpeed: 50,

                    // delay, after which an afterDone.flexibleSpinner event will happen
                    afterDone: 1000,

                    // could be init from javascript only
                    doInc: doInc,
                    doDec: doDec
                }

            // HTML attr init
            var except = ['doInc', 'doDec']
            for (var k in settings) {
                if ($.inArray(k, except) === -1) {
                    var attr = 'data-' + k
                    if (typeof($spinner.attr(attr)) != 'undefined') {
                        settings[k] = $spinner.attr(attr)
                    }
                }
            }

            // init from js
            $.extend(settings, jsInit)

            // stor the data for future needs
            $spinner.data('flexibleSpinnerSettings', settings)
            $(settings.inc).data('flexibleSpinnerTarget', $spinner)
            $(settings.dec).data('flexibleSpinnerTarget', $spinner)
            return settings
        }

        function doMouseDown($spinner, action) {
            var settings = $spinner.data('flexibleSpinnerSettings'),
                timeOutId,
                intervalId
            $spinner.data('inUse.flexibleSpinner', true)
            $spinner.trigger(action + 'MouseDown.flexibleSpinner')
            if (settings.stickyKeyDelay) {
                timeOutId = setTimeout(function(){
                    intervalId = setInterval(function(){
                        $spinner.trigger(action + 'MouseDown.flexibleSpinner')
                    }, settings.stickyChangeSpeed)
                    $spinner.data('intervalId', intervalId)
                }, settings.stickyKeyDelay)
                $spinner.data('timeOutId', timeOutId)
            }
        }

        function incMouseDownHandler() {
            doMouseDown($(this).data('flexibleSpinnerTarget'), 'inc')
        }

        function decMousedownHandler() {
            doMouseDown($(this).data('flexibleSpinnerTarget'), 'dec')
        }

        function mouseUpHandler() {
            var $spinner = $(this).data('flexibleSpinnerTarget')
            $spinner.trigger('mouseUp.flexibleSpinner')
        }

        return this.each(function() {
            var $spinner = $(this), // an input with class .flexible-spinner
                settings = init($spinner)

            $(settings.inc)
                .mousedown(incMouseDownHandler)
                .mouseup(mouseUpHandler)
                .mouseleave(mouseUpHandler)
            $(settings.dec)
                .mousedown(decMousedownHandler)
                .mouseup(mouseUpHandler)
                .mouseleave(mouseUpHandler)

            $spinner.data('inUse.flexibleSpinner', false)
            $spinner.bind('incMouseDown.flexibleSpinner', settings.doInc)
            $spinner.bind('decMouseDown.flexibleSpinner', settings.doDec)
            $spinner.bind('mouseUp.flexibleSpinner', function(){
                var $spinner = $(this)

                if ($spinner.data('inUse.flexibleSpinner')) {
                    var timeOutId = $spinner.data('timeOutId'),
                        intervalId = $spinner.data('intervalId'),
                        afterTimeOutId = $spinner.data('afterTimeOutId')

                    $spinner.data('inUse.flexibleSpinner', false)
                    if (timeOutId != 'undefined') clearTimeout(timeOutId)
                    if (afterTimeOutId != 'undefined') clearTimeout(afterTimeOutId)
                    if (intervalId != 'undefined') clearInterval(intervalId)

                    var afterTimeOutId = setTimeout(function(){
                        $spinner.trigger('afterDone.flexibleSpinner')
                    }, settings.afterDone)

                    $spinner.data('afterTimeOutId', afterTimeOutId)
                }
            })
        })
    }

    $(function(){
        $('.flexible-spinner').flexibleSpinner()
    })
})(jQuery);
