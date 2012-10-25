(function($){
    $.fn.flexible_spinner = function (init) {
    	var time_out_id = null
    	var interval_id = null
    	var target 	    = this
    	settings = {
			inc              : 'inc-selector',
			dec              : 'dec-selector',
			sticky_key       : true,
			sticky_key_delay : 500,
			change_speed     : 50
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
	    target.bind('flexible-spinner-inc', function(){
	        var value = $(target).val()
	        value = value * 1 + 1
	        $(target).val(value)
	    })
	    target.bind('flexible-spinner-dec', function(){
	        var value = $(target).val()
	        if (value > 1) value = value * 1 - 1
	        $(target).val(value)
	    })
	    target.bind('flexible-spinner-done', function(){
	        if (time_out_id) clearTimeout(time_out_id)
	        if (interval_id) clearInterval(interval_id)
	        time_out_id = null
	        interval_id = null
	    })
    }
})(jQuery)