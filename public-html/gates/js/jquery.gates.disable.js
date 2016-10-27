/**
 * 
 */


(function( $ ){
	var methods = {
		init: function() {
		
		}/*,
	
		isInsideGrid: function(element) {
			return $(element).parents('[id^="gbox"]').size() > 0;
		}*/
	};


	$.fn.gatesDisable = function(optionsParameter) {
		var defaults = {
			exclude: []
		};

		var options = $.extend({}, defaults, {}, optionsParameter);
		
		return this.each(function() {
			//- Disable form elements
			$('input[type != "hidden"]', $(this)).each(function() {
				if ($.inArray($(this).attr('id'), options.exclude) < 0 && $(this).parents('[id^="gbox"]').size() == 0) {
					$(this).attr({disabled: true});
				}
			});

			$('textarea', $(this)).each(function() {
				if ($.inArray($(this).attr('id'), options.exclude) < 0 && $(this).parents('[id^="gbox"]').size() == 0) {
					$(this).attr({disabled: true});
				}
			});

			$('select', $(this)).each(function() {
				if ($.inArray($(this).attr('id'), options.exclude) < 0 && $(this).parents('[id^="gbox"]').size() == 0) {
					$(this).attr({disabled: true});
				}
			});

			$('button', $(this)).each(function() {
				if ($.inArray($(this).attr('id'), options.exclude) < 0 && $(this).parents('[id^="gbox"]').size() == 0) {
					$(this).attr({disabled: true});
				}
			});

			$('a', $(this)).each(function() {
				var classValue=$(this).attr('class');
				if ($.inArray($(this).attr('id'), options.exclude) < 0 && classValue!='comments') {
					$(this).contents().unwrap();
				}
			});

			// TODO: Disable jqGrid
		});

	};
	

	//method does not handle hyperlinks
	$.fn.gatesEnable = function(optionsParameter) {
		var defaults = {
			exclude: []
		};

		var options = $.extend({}, defaults, {}, optionsParameter);
		
		return this.each(function() {
			//- Disable form elements
			$('input[type != "hidden"]', $(this)).each(function() {
				if ($.inArray($(this).attr('id'), options.exclude) < 0) {
					$(this).attr({disabled: false});
				}
			});

			$('textarea', $(this)).each(function() {
				if ($.inArray($(this).attr('id'), options.exclude) < 0) {
					$(this).attr({disabled: false});
				}
			});

			$('select', $(this)).each(function() {
				if ($.inArray($(this).attr('id'), options.exclude) < 0) {
					$(this).attr({disabled: false});
				}
			});

			$('button', $(this)).each(function() {
				if ($.inArray($(this).attr('id'), options.exclude) < 0) {
					$(this).attr({disabled: false});
				}
			});
		});

	};
	
})( jQuery );


