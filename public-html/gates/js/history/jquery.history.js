/**
 *    
 * 
 * jquery plugin for history functionality.
 * It handle history for all the screens
 *   
 * 
 */

(function( $ ){
	var methods = {
		init: function() {
		
		}
	};


	$.fn.history = function(optionsParameter) {
		var defaults = {
			entityId: null,
			entity: null,
			property: "",
			displayMode: "normal",
			url: _context+'/history',
			historyFrame: 'historyFrame'
		};
		
		// Replacing options parameters to default values
		var options = $.extend({}, defaults, {}, optionsParameter);
		

		return this.each(function() {
			
			$(this).click(function() {
				//- launch history dialog
				//creating URL to open history dialog
				var link = options.url + "/revisions/?entityId="+options.entityId		
							+ "&entity=" +options.entity
							+ "&propertyName=" +options.property
							+ "&historyFrame=" + options.historyFrame
							+ "&displayMode=" + options.displayMode;
				
				$("#"+options.historyFrame)
				.attr('src', link)
				.dialog({
					width : 840,
					height : 550,
					title : 'History',
					autoResize : true,
					modal: true
				})
				.width(840 - 10)
				.height(550 - 10);

			});

		});

	};
})( jQuery );


