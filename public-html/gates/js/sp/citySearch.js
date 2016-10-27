$(function() {
	
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
			
			$("#cityForm").attr("action", "searchCity");
        	$("#cityForm").submit();	
	    });
		
		$('#reset').click(function(){
			document.getElementById('cityCode').value="";
			$("#displaydiv").hide();			
	    });

	
		
	
		
 });

function setCityValue(id) {	
	self.opener.cityUpdate(id);
	window.close();         
}
