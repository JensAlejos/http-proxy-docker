/**
 * 
 */$(document).ready(function() {
	// configuration for multi select boxes
	$.configureBoxes({
		useFilters : false,
		useCounters : false,
		to1: 'to3',
		to2: 'to4',
		
		box1View: 'box3View',
        box1Storage: 'box3Storage',
       // box1Filter: 'box1Filter',
       // box1Clear: 'box1Clear',
        box1Counter: 'box3Counter',
        box2View: 'box4View',
        box2Storage: 'box4Storage',
       // box2Filter: 'box2Filter',
       // box2Clear: 'box2Clear',
        box2Counter: 'box4Counter'
	});
/*$('#cancel').click(function(){
		
		document.location.href="/gates/cas/organizationSearch.do";
		});
	*/
	
});
//methods for selecting all values from multi select menu
function submitAllSelectTypes() {
	
	selectAll(getControl('box4View'));
	
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