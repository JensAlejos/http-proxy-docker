$(document).ready(function() {
	
	// attach validation engine with form
	$("#contactA").validationEngine('attach');
	
	// style buttons
	$('input[type="button"]').removeClass("formButton").addClass("buttonNoFloat");
	/*var $resetButton = $('td input[type="button"][value="Reset"]');
	$resetButton.removeClass("formButton").addClass("buttonNoFloat");
	var $cancelButton = $('td input[type="button"][value="Cancel"]');
	$cancelButton.removeClass("formButton").addClass("buttonNoFloat");
	var $searchButton = $('td input[type="button"][value="Search"]');
	$searchButton.removeClass("formButton").addClass("buttonNoFloat");*/
	
	
	
});  // ready method end

//hide all inline validation error messages
function removeErrorPointers(){
	   $('#contactA').validationEngine('hideAll');
}



(function($) {

		$.fn.gatesPopUpSearch = function(o) {

			var o = $.extend({}, $.fn.gatesPopUpSearch.defaults, {}, o);
			
			return this.each(function() {		
				var f = this;
				var id = 'popupSearch'+f.id;
				var $button = $('<img src="'+o.imagePath+'/'+o.imgOut+'"  border="0" style="vertical-align:text-bottom;">');
				if (f.button && f.button == true) return false;
				$button.attr({id:id,name:id,alt:o.alt}).css('cursor',o.cursor);
				$button.click(function(){ 
					if (f.disabled == true){
						return false;
					}
					o.func();
				});
				$button.mouseover(function(){ 
					if (f.disabled == true){
						return false;
					}
					this.src = this.src.replace(o.imgOut,o.imgOver); 
				});
				$button.mouseout(function(){ 
					this.src = this.src.replace(o.imgOver,o.imgOut); 
				});
				$(f).after($button);
				f.button = true;
			});
		};
		$.fn.gatesPopUpSearch.defaults = {
				imagePath: '/gates/resources/images',
				imgOver: 'search.png', 
				imgOut: 'search.png',
				cursor: 'pointer',
				alt: 'Search',
				func: function() {}
			};
		})(jQuery);