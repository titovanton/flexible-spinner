(($) ->
    $.fn.flexibleSpinner = (jsInit) ->

        doDec = () ->
            value = $(@).val()
            if value > 1
                value = value*1 - 1
            $(@).val value

        doInc = () ->
            value = $(@).val()
            value = value*1 + 1
            $(@).val value

        init = ($spinner) ->

            # default init
            settings =

                # could be init from data-<name> attrs
                dec: '.dec-spinner'
                inc: '.inc-spinner'
                stickyKeyDelay: 500
                stickyChangeSpeed: 50

                # delay, after which an afterDone.flexibleSpinner event will happen
                afterDone: 1000

                # could be init from javascript only
                doInc: doInc
                doDec: doDec

            # HTML attr init
            except = ['doInc', 'doDec']
            for k of settings
                if $.inArray(k, except) is -1
                    attr = "data-#{k}"
                    if typeof($spinner.attr attr) != 'undefined'
                        settings[k] = $spinner.attr attr

            # init from js
            $.extend settings, jsInit

            # stor the data for future needs
            $spinner.data 'flexibleSpinnerSettings', settings
            $(settings.inc).data 'flexibleSpinnerTarget', $spinner
            $(settings.dec).data 'flexibleSpinnerTarget', $spinner
            settings

        doMouseDown = ($spinner, action) ->
            settings = $spinner.data 'flexibleSpinnerSettings'
            $spinner.data 'inUse.flexibleSpinner', true
            $spinner.trigger "#{action}MouseDown.flexibleSpinner"
            if settings.stickyKeyDelay
                timeOutId = setTimeout () ->
                    intervalId = setInterval () ->
                        $spinner.trigger "#{action}MouseDown.flexibleSpinner"
                    , settings.stickyChangeSpeed
                    $spinner.data 'intervalId', intervalId
                , settings.stickyKeyDelay
                $spinner.data 'timeOutId', timeOutId

        incMouseDownHandler = () ->
            doMouseDown $(@).data('flexibleSpinnerTarget'), 'inc'

        decMousedownHandler = () ->
            doMouseDown $(@).data('flexibleSpinnerTarget'), 'dec'

        mouseUpHandler = () ->
            $spinner = $(@).data 'flexibleSpinnerTarget'
            $spinner.trigger 'mouseUp.flexibleSpinner'

        @.each () ->
            $spinner = $ @ # an input with class .flexible-spinner
            settings = init $spinner

            $ settings.inc
                .mousedown incMouseDownHandler
                .mouseup mouseUpHandler
                .mouseleave mouseUpHandler
            $ settings.dec
                .mousedown decMousedownHandler
                .mouseup mouseUpHandler
                .mouseleave mouseUpHandler

            $spinner.data 'inUse.flexibleSpinner', false
            $spinner.bind 'incMouseDown.flexibleSpinner', settings.doInc
            $spinner.bind 'decMouseDown.flexibleSpinner', settings.doDec
            $spinner.bind 'mouseUp.flexibleSpinner', () ->
                $spinner = $(@)

                if $spinner.data('inUse.flexibleSpinner')
                    timeOutId = $spinner.data 'timeOutId'
                    intervalId = $spinner.data 'intervalId'
                    afterTimeOutId = $spinner.data 'afterTimeOutId'

                    $spinner.data 'inUse.flexibleSpinner', false

                    if timeOutId != 'undefined'
                        clearTimeout(timeOutId)
                    if afterTimeOutId != 'undefined'
                        clearTimeout(afterTimeOutId)
                    if intervalId != 'undefined'
                        clearInterval(intervalId)

                    afterTimeOutId = setTimeout () ->
                        $spinner.trigger 'afterDone.flexibleSpinner'
                    , settings.afterDone

                    $spinner.data 'afterTimeOutId', afterTimeOutId

    $ () ->
        $('.flexible-spinner').flexibleSpinner()

)(jQuery)
