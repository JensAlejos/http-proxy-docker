/**
 * 
 *//**
 * 
 *//**
 * 
 */$(document).ready(function() {
	// configuration for multi select boxes
	$.configureBoxes({
		useFilters : false,
		useCounters : false,
		to1: 'to9',
		to2: 'to10',
		
		box1View: 'box9View',
        box1Storage: 'box9Storage',
       // box1Filter: 'box1Filter',
       // box1Clear: 'box1Clear',
        box1Counter: 'box9Counter',
        box2View: 'box10View',
        box2Storage: 'box10Storage',
       // box2Filter: 'box2Filter',
       // box2Clear: 'box2Clear',
        box2Counter: 'box10Counter'
	});
	
	
});
//methods for selecting all values from multi select menu
function submitAllSelectSegment() {
	
	selectAll(getControl('box10View'));
	
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