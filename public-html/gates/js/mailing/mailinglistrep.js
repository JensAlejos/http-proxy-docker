/**
 * 
 *//**
 * 
 *//**
 * 
 *//**
 * 
 */
/*$(document).ready(function() {
	// configuration for multi select boxes
	$.configureBoxes({
		useFilters : false,
		useCounters : false,
		to1: 'to7',
		to2: 'to8',
		
		box1View: 'box7View',
        box1Storage: 'box7Storage',
        box1Counter: 'box7Counter',
        box2View: 'box8View',
        box2Storage: 'box8Storage',
        box2Counter: 'box8Counter'
	});
	
	
});*/

$(function(){
		
		$('#to7').click(function(){										
			$("#box8View option:selected").each(function(){
				//checl region is already selected if not copyregion to selected list box
				var code= $(this).val().split("-")[0];
				//alert($("#box8View option[value^='"+code+"-']").not(":selected").length);
				if ($("#box8View option[value^='"+code+"-']").not(":selected").length == 0){
					$("#box2View option[value='"+code+"']").remove().appendTo($("#box1View"));
					$("#box1View").sortList();
				}
			});
			$("#box8View option:selected").remove().appendTo($("#box7View"));
			$("#box7View").sortList();
			$("#box7View option").removeAttr("selected");				
			return true;	
		});	
	
		$('#to8').click(function(){										
			$("#box7View option:selected").each(function(){
				//checl region is already selected if not copyregion to selected list box
				var code= $(this).val().split("-")[0];
				if ($("#box2View option[value='"+code+"']").length ==0){
					$("#box1View option[value='"+code+"']").remove().appendTo($("#box2View"));
				}
			});
			$("#box7View option:selected").remove().appendTo($("#box8View"));
			$("#box8View option").removeAttr("selected");				
			return true;	
		});		
		

/*		$("#box7View option").dblclick(function(){
			$("#box7View option:selected").each(function(){
				//checl region is already selected if not copyregion to selected list box
				var code= $(this).val().split("-")[0];
				if ($("#box2View option[value='"+code+"']").length ==0){
					$("#box1View option[value='"+code+"']").remove().appendTo($("#box2View"));
				}
			});			
			$("#box7View option:selected").remove().appendTo($("#box8View"));
			$("#box8View option:selected").removeAttr("selected");			 
			return true;
		});*/
		
	 	$("#box7View").live("dblclick",function(){
			$("#box7View option:selected").each(function(){
				//checl region is already selected if not copyregion to selected list box
				var code= $(this).val().split("-")[0];
				if ($("#box2View option[value='"+code+"']").length ==0){
					$("#box1View option[value='"+code+"']").remove().appendTo($("#box2View"));
				}
			});						
			$("#box7View option:selected").remove().appendTo($("#box8View"));
			$("#box8View option:selected").removeAttr("selected");			 
			return true;
		});
	 	
	 	$("#box8View").live("dblclick",function(){
			$("#box8View option:selected").each(function(){
				var code= $(this).val().split("-")[0];
				if ($("#box8View option[value^='"+code+"-']").not(":selected").length == 0){
					$("#box2View option[value='"+code+"']").remove().appendTo($("#box1View"));
					$("#box1View").removeAttr("selected");
					$("#box1View").sortList();
				}
			});						
			$("#box8View option:selected").remove().appendTo($("#box7View"));
			$("#box7View").sortList();
			$("#box7View option:selected").removeAttr("selected");			 
			return true;
		});	 	

});	 	
	 	
//methods for selecting all values from multi select menu
function submitAllSelectReps() {
	
	selectAll(getControl('box8View'));
	
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