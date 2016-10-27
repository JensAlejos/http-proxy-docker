/*
 * $('form [name=ltlQuoteSearchForm]').formatCasSearchForm
 */
(function($) {
	
	$.fn.mandatory = function() {
	        
		var startTxt = this.html().substring(0,this.html().indexOf(':'));
		var endTxt = this.html().substring(this.html().indexOf(':'));
		
	    this.html(startTxt + '<span class="mandatory" style="font-size: 8pt" >*</span>'+ endTxt);

	  };
	  
	$.fn.formatCasSearchForm = function(o) {

		var o = $.extend({}, $.fn.formatCasSearchForm.defaults, {}, o);

		var resetForm = function(frm) {
			resetFileds(frm);
			
			if (o.defaultValues) {
				for(var i=0; i<o.defaultValues.length; i++) {
					$('#' + o.defaultValues[i].id, frm).val(o.defaultValues[i].value);
				}
			}
			
		};
		
		this.each(function() {				
			var f = this, $f = $(this);
			
			// set default values
			$(':text', this).DefaultValue('ALL');
			
			// Include "custom action" buttons after the "Search" button
			var $tdSearch = $('td input[type="button"][value="Search"]', this).parent('td');
			$tdSearch.append('&nbsp;&nbsp;');
			$tdSearch.next('td').remove();
			
			var $td=$tdSearch;
			for (var i=0; i<o.customActions.length; i++) {
				var buttonTag = '<input type="button" ';
				
				buttonTag += 'class="formButton ';
				if (o.customActions[i].clazz) {
					buttonTag += o.customActions[i].clazz;
				}
				buttonTag += '" ';
				
				if (o.customActions[i].alt) {
					buttonTag += 'alt="' + o.customActions[i].alt + '" ';
				}
				buttonTag += 'value="' + o.customActions[i].value + '" />';
				
				var $button = $(buttonTag);
				
				if (o.customActions[i].fn) {
					$button.click(o.customActions[i].fn);
				}
				
				var $buttonCell = $('<td>&nbsp;&nbsp;</td>');
				$buttonCell.prepend($button);
				
				$td.after($buttonCell);
				$td = $buttonCell;
			}
			
			// Swap reset and search buttons
			var $resetButton = $('td input[type="button"][value="Reset"]');
			$resetButton.val('Clear');
			var $tdReset = $resetButton.parent('td');
			$tdSearch.after($tdReset);
			
			// Change reset onclick handler to clear search results also
			$resetButton.click(function() {
				$('#displaybase').remove();	
			});
			
			// Hide "saved search" feature
			// : configure all searches to have a finite value for "displayColumns"
			// : hide the row (<tr>) enclosing "My Saved View:" <td>
			if (!o.hasSavedSearchFeature) {
				var $saved_search_td = $('td.formLabel:contains("My Saved View:")');
				$saved_search_td.parent('tr').hide();
			}else {
				var $saved_search_td = $('td.formLabel:contains("My Saved View:")');
				$saved_search_td.parent("tr").parent("tbody").parent("table").attr("align","right");
			}
				
			
			if (o.defaultValues) {
				var input = document.createElement("input");
				input.setAttribute("type", "hidden");
				input.setAttribute("id", "nullFieldIds");
				input.setAttribute("value", "");
				document.body.appendChild(input);
				
				for(var i=0; i<o.defaultValues.length; i++) {
					var $e = $('#' + o.defaultValues[i].id, this);
					
					if ($e.val() == 'ALL') {
						$e.val(o.defaultValues[i].value);
						input.value += o.defaultValues[i].id + ',';
					}
				}
				
				$('input[type="button"][value="Reset"]').click(function() { resetForm(f); });
			}
			
			// style buttons
			$('input[type="button"]').removeClass("formButton").addClass("buttonNoFloat");
			
		});
		
		// ...
		
		return null;

	};

	$.fn.formatCasSearchForm.defaults = {
		hasSavedSearchFeature: true
		// customActions: [ { value: "Add", fn: "addFunction" }, { value: "Another Add", fn: "addFunction" } ]
		// defaultValues: [ { id: "EXPIRATION_DATE", value: 'default.value' } ] 
	};
	
	
	
	

})(jQuery);

$(document).ready(function() {
	if ($('form').attr('id') == null || $('form').attr('id') == '') {
		$('form').attr('id', $('form').attr('name'));
	}
});
