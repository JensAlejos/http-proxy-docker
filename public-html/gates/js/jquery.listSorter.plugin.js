(function($){
    $.fn.extend({                 
       sortList: function() {
		  var elementsArrayr = $(this).children("option");     
		    elementsArrayr.sort(function(first, second) {         
		    	return (first.text == second.text) ? 0 : (first.text > second.text) ? 1 : -1;
		    }); 
		    $(elementsArrayr).remove(); 
		    $(this).append($(elementsArrayr)); 
		   }
	    });     
})(jQuery);