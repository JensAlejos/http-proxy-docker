$(function() {
		document.getElementById('depotLongDescr').value="ALL";
		$('.displaytagtable tbody tr:not([th]):odd').addClass("odd");
		$('.displaytagtable tbody tr:not([th]):even').addClass("even");
		$('#depotSearch').click(function(){
			$("#action").val("search");
			$("input[name='doSearch']").val('N');
			$("#depotLookupForm").attr("action", "searchDepot");
        	$("#depotLookupForm").submit();	
	    });
		
		//added to remove Result list table header on pageload.	
		if(($('#displaybase tbody tr').length)> 3)
			{
			}
		else
			{
			$("#displaydiv").hide();
			$('#msgDiv').html("No Match Found");
			}
		
		$('#reset').click(function(){
			$("input[name='doSearch']").val('Y');
			document.getElementById('depotShortDescr').value="ALL";
			document.getElementById('depotLongDescr').value="ALL";
			$("#action").val("search");
			$("#displaydiv").hide();	
			$('#msgDiv').remove();
	    });
		
 });
function showNextRecords(){
	$("input[name='doSearch']").val('N');
	$("#action").val("next");
	$("#depotLookupForm").attr("action", "searchDepot");
	$("#depotLookupForm").submit();
}
function showPreviousRecords(){
	$("input[name='doSearch']").val('N');
	$("#action").val("previous");
	$("#depotLookupForm").attr("action", "searchDepot");
	$("#depotLookupForm").submit();
}
function setDepotValue(id) {	
	self.opener.depotUpdate(id);
	window.close();         
}
