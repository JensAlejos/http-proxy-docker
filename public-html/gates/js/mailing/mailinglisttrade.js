/**
 * 
 *//**
 * 
 */$(document).ready(function() {
	// configuration for multi select boxes
	$.configureBoxes({
		useFilters : false,
		useCounters : false,
		to1: 'to5',
		to2: 'to6',
		
		box1View: 'box5View',
        box1Storage: 'box5Storage',
       // box1Filter: 'box1Filter',
       // box1Clear: 'box1Clear',
        box1Counter: 'box5Counter',
        box2View: 'box6View',
        box2Storage: 'box6Storage',
       // box2Filter: 'box2Filter',
       // box2Clear: 'box2Clear',
        box2Counter: 'box6Counter'
	});
	
	
});
//methods for selecting all values from multi select menu
function submitAllSelectTrades() {
	
	selectAll(getControl('box6View'));
	
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