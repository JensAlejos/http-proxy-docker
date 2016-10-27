$(function() {
	
		document.getElementById('cityName').value="ALL";
	
		$('.displaytagtable tbody tr:not([th]):odd').addClass("odd");
		$('.displaytagtable tbody tr:not([th]):even').addClass("even");
		
		
	$('#citySearch').click(function(){
			if($('#cityName').val()=="")
				{
					$('#cityName').val("ALL");
				}
			if($('#cityCode').val()=="")
			{
				$('#cityCode').val("ALL");
			}
			$("#cityLookupForm").attr("action", "searchCityForQTWithOutPort");
        	$("#cityLookupForm").submit();
	    });
		
		//added to remove Result list table header on pageload.	
		if(($('#displaybase tbody tr').length)> 3)
			{
			}
		else
			{
			$("#displaydiv").hide();
			if($('#searchClicked').val()=="Y")
				{
					$('#msgDiv').html("No Match Found");
				}
			}
		
		$('#reset').click(function(){
			document.getElementById('cityCode').value="ALL";
			document.getElementById('cityName').value="ALL";
			$('#searchClicked').val('');
			$("#displaydiv").hide();	
			$('#msgDiv').html('');
	    });

	
		
	
		
 });

function showNextRecords(){
	$("input[name='doSearch']").val('N');
	$("#action").val("next");
	$("#cityLookupForm").attr("action", "searchCityForQTWithOutPort");
	$("#cityLookupForm").submit();

}
function showPreviousRecords(){
	$("input[name='doSearch']").val('N');
	$("#action").val("previous");
	$("#cityLookupForm").attr("action", "searchCityForQTWithOutPort");
	$("#cityLookupForm").submit();

}


function setCityValue(id) {	
	self.opener.cityUpdate(id);
	window.close();         
}
