(function($){
    $.fn.flexible_spinner = function (init) {
        var time_out_id       = null
        var after_time_out_id = null
        var interval_id       = null
        var target            = this
        var settings = {
            inc              : 'inc-selector',
            dec              : 'dec-selector',
            sticky_key       : true,
            sticky_key_delay : 500,
            change_speed     : 50,
            after_done       : 1000,

            inc_handler: function(){
                var value = $(target).val()
                value = value * 1 + 1
                $(target).val(value)
            },
            dec_handler: function(){
                var value = $(target).val()
                if (value > 1) value = value * 1 - 1
                $(target).val(value)
            }
        }
        $.extend(settings, init)
        $(settings.inc).mousedown(function(){
            target.trigger('flexible-spinner-inc')
            if (settings.sticky_key) {
                time_out_id = setTimeout(function(){
                    interval_id = setInterval(function(){
                        target.trigger('flexible-spinner-inc')
                    }, settings.change_speed)
                }, settings.sticky_key_delay)
            }
        })
        $(settings.inc).mouseup(function(){
            target.trigger('flexible-spinner-done')
        })
        $(settings.dec).mousedown(function(){
            target.trigger('flexible-spinner-dec')
            if (settings.sticky_key) {
                time_out_id = setTimeout(function(){
                    interval_id = setInterval(function(){
                        target.trigger('flexible-spinner-dec')
                    }, settings.change_speed)
                }, settings.sticky_key_delay)
            }
        })
        $(settings.dec).mouseup(function(){
            target.trigger('flexible-spinner-done')
        })
        target.bind('flexible-spinner-inc', settings.inc_handler)
        target.bind('flexible-spinner-dec', settings.dec_handler)
        target.bind('flexible-spinner-done', function(){
            if (time_out_id) clearTimeout(time_out_id)
            if (after_time_out_id) clearTimeout(after_time_out_id)
            if (interval_id) clearInterval(interval_id)
            after_time_out_id = setTimeout(function(){
                target.trigger('flexible-spinner-after-done')
            }, settings.after_done)
        })

        return target
    }
})(jQuery);
