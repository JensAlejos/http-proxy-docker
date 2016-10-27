/*$(document).ready(function() {
	// configuration for multi select boxes
	$.configureBoxes({
		useFilters : false,
		useCounters : false
	});
	

	
});*/
$(function(){
		$('#to1').click(function(){
			$("#box2View option:selected").each(function() {
				var code = $(this).val();
				$("#box8View option[value^='"+$(this).val()+"']").remove().appendTo($("#box7View"));
				//$("#box8View option").each(function(i,opt){					
				//	if ($(opt).val().indexOf(code) === 0){
				//		$(opt).attr("selected","selected");
				//	}					
				//});					
			});
			$("#box7View").sortList();
			//$("#box8View").trigger("dblclick");			
			$("#box2View option:selected").remove().appendTo($("#box1View"));
			$("#box1View").sortList();
			//$("#box7View option:selected").remove().appendTo($("#box1View"));
			$("#box1View option").removeAttr("selected");
		});
		
		
		$('#to2').click(function(){						
			$("#box1View option:selected").each(function(i,opt){				
				var code = $(this).val();
				$("#box7View option[value^='"+$(this).val()+"']").remove().appendTo($("#box8View"));	
				//$("#box7View option").each(function(i,opt){					
				//	if ($(opt).val().indexOf(code) === 0){
				//		$(opt).attr("selected","selected");
				//	}					
				//});			
				//$("#box7View").trigger("dblclick");	
				$("#box1View option:selected").remove().appendTo($("#box2View"));
				$("#box8View option").removeAttr("selected");
				$("#box2View option").removeAttr("selected");				
				//alert($(opt).val());
				
			});
			return true;	
		});		
		
		$("#box1View").live("dblclick",function(data){
			$("#box1View option:selected").each(function() {
				$("#box7View option[value^='"+$(this).val()+"']").remove().appendTo($("#box8View"));			
			});
			//$("#box7View").trigger("dblclick");			

			$("#box1View option:selected").remove().appendTo($("#box2View"));
			$("#box2View option:selected").removeAttr("selected");
			 //alert($(this).attr("selected"));
			return true;
		});
		
	 	$("#box2View").live("dblclick",function(){
			
			$("#box2View option:selected").each(function() {
				$("#box8View option[value^='"+$(this).val()+"']").remove().appendTo($("#box7View"));
			});
			$("#box7View").sortList();
			$("#box8View").trigger("dblclick");			
			$("#box2View option:selected").remove().appendTo($("#box1View"));
			$("#box1View").sortList();
			$("#box1View option:selected").removeAttr("selected");						
			return true;
		});
	});
//methods for selecting all values from multi select menu
function submitAllSelectRegion() {
	selectAll(getControl('box2View'));
	
}


function selectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;
	
	for ( var i = 0; i < selObj.options.length; i++) {
		tmpOptObj = selObj.options[i];
		if (!tmpOptObj.selected)
			tmpOptObj.selected = true;
	}
}

var getControl = function(id) {
	var control = document.getElementById(id);
	if (!control)
		control = document.getElementById(getNetuiTagName(id, this));
	return control;
};