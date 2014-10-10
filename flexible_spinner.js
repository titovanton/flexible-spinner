(function($){
    $.fn.flexibleSpinner = function (jsInit) {
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
            return settings
        }

        function incMouseDownHandler() {
            var $spinner = $(this),
                settings = $spinner.data('flexibleSpinnerSettings'),
                timeOutId,
                intervalId
            $spinner.trigger('incMouseDown.flexibleSpinner')
            if (settings.stickyKeyDelay) {
                timeOutId = setTimeout(function(){
                    intervalId = setInterval(function(){
                        $spinner.trigger('incMouseDown.flexibleSpinner')
                    }, settings.stickyChangeSpeed)
                    $spinner.data('intervalId', intervalId)
                }, settings.stickyKeyDelay)
                $spinner.data('timeOutId', timeOutId)
            }
        }

        function decMousedownHandler() {
            var $spinner = $(this),
                settings = $spinner.data('flexibleSpinnerSettings'),
                timeOutId,
                intervalId
            $spinner.trigger('decMouseDown.flexibleSpinner')
            if (settings.stickyKeyDelay) {
                timeOutId = setTimeout(function(){
                    intervalId = setInterval(function(){
                        $spinner.trigger('decMouseDown.flexibleSpinner')
                    }, settings.stickyChangeSpeed)
                    $spinner.data('intervalId', intervalId)
                }, settings.stickyKeyDelay)
                $spinner.data('timeOutId', timeOutId)
            }
        }

        function mouseUpHandler() {
            var $spinner = $(this),
                settings = $spinner.data('flexibleSpinnerSettings')
            $spinner.trigger('mouseUp.flexibleSpinner')
        }

        return this.each(function() {
            var $spinner = $(this), // an input with class .flexible-spinner
                settings = init($spinner)

            $(settings.inc).mousedown(incMouseDownHandler)
            $(settings.dec).mousedown(decMousedownHandler)
            $(settings.inc).mouseup(mouseUpHandler)
            $(settings.dec).mouseup(mouseUpHandler)

            $spinner.bind('incMouseDown.flexibleSpinner', settings.doInc)
            $spinner.bind('decMouseDown.flexibleSpinner', settings.doDec)
            $spinner.bind('mouseUp.flexibleSpinner', function(){
                var $spinner = $(this),
                    timeOutId = $spinner.data('timeOutId'),
                    intervalId = $spinner.data('intervalId'),
                    afterTimeOutId = $spinner.data('afterTimeOutId')
                if (timeOutId != 'undefined') clearTimeout(timeOutId)
                if (afterTimeOutId != 'undefined') clearTimeout(afterTimeOutId)
                if (intervalId != 'undefined') clearInterval(intervalId)
                var afterTimeOutId = setTimeout(function(){
                    $spinner.trigger('afterDone.flexibleSpinner')
                }, settings.afterDone)
                $spinner.data('afterTimeOutId', afterTimeOutId)
            })
        })
    }

    $(function(){
        $('.flexible-spinner').flexibleSpinner()
    })
})(jQuery);
