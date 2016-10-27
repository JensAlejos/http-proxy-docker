$(function() {
	    //D026241
		//document.getElementById('cityName').value="ALL";
		$('.displaytagtable tbody tr:not([th]):odd').addClass("odd");
		$('.displaytagtable tbody tr:not([th]):even').addClass("even");
		$('#citySearch').click(function(){
		/*var cityCode=document.getElementById('cityCode').value;
			var cityName=document.getElementById('cityName').value;
			var min=2;
			
			if(cityCode=="" && cityName==""){
				alert("Please provide City Code or City Name to start the search !");
				return;
			}
			if(cityCode.length<min && cityName.length<min){
				alert("Please provide atleast 2 characters for search criteria !");
				return;
			}*/
			$("#action").val("search");
			$("input[name='doSearch']").val('N');
			$("#cityLookupForm").attr("action", "searchCity");
        	$("#cityLookupForm").submit();	
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
			document.getElementById('cityCode').value="ALL";
			document.getElementById('cityName').value="ALL";
			$("#action").val("search");
			$("#displaydiv").hide();	
			$('#msgDiv').remove();
			$("#isPortFlag").attr("checked", false);
	    });
		
 });
function showNextRecords(){
	$("input[name='doSearch']").val('N');
	$("#action").val("next");
	$("#cityLookupForm").attr("action", "searchCity");
	$("#cityLookupForm").submit();
}
function showPreviousRecords(){
	$("input[name='doSearch']").val('N');
	$("#action").val("previous");
	$("#cityLookupForm").attr("action", "searchCity");
	$("#cityLookupForm").submit();
}
function setCityValue(id) {	
	self.opener.cityUpdate(id);
	window.close();         
}
