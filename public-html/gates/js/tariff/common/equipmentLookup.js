$(function() {
	
	if(document.getElementById('planEquipFunctionCode').value == "")
		{
		document.getElementById('planEquipFunctionCode').value="ALL";
		}
	if(document.getElementById('planEquipLengthFeet').value == "")
	{
		document.getElementById('planEquipLengthFeet').value="ALL";
	}
	if(document.getElementById('planEquipHeightCode').value == "")
	{
		document.getElementById('planEquipHeightCode').value="ALL";
	}
	
		$('.displaytagtable tbody tr:not([th]):odd').addClass("odd");
		$('.displaytagtable tbody tr:not([th]):even').addClass("even");
	
		$('#equipSearch').click(function(){
			$("input[name='doSearch']").val('N');
			$("#euipLookupForm").attr("action", "searchEquipment");
        	$("#euipLookupForm").submit();	
	    });
		
		$('#reset').click(function(){
		$("input[name='doSearch']").val('Y');
			document.getElementById('planEquipFunctionCode').value="";
			document.getElementById('planEquipLengthFeet').value="";
			document.getElementById('planEquipHeightCode').value="";
			$("#displaydiv").hide();			
			
	    });
		
		//added to fill Result list table grid on pageload.	
		if(($('#displaybase tbody tr').length)> 3)
			{
			}
		else
			{
			$("#displaydiv").hide();
			$('#msgDiv').html("No Equipment Found");
			}
		
		
	
		
	
		
 });

function setEquipValue(id) {	
	self.opener.equipUpdate(id);
	window.close();         
}
