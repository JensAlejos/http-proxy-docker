$(document).ready(function () {
	 $('#trgtFromGrpName').gatesPopUpSearch({func:function() {fromGroupNamePopupSearch()}});
	 $('#trgtFromSrcTariff').gatesPopUpSearch({func:function() {fromSourceTariffPopupSearch()}});	
	 $('#trgtFromItemName').gatesPopUpSearch({func:function() {fromItemPopupSearch()}});	
	 $('#trgtFromRateDesc').gatesPopUpSearch({func:function() {fromRatePopupSearch()}});
});
function fromSourceTariffPopupSearch() {   
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#trgtFromGrpTypeHidden').val()+"&sourceTariff="+$('#trgtFromSrcTariff').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function fromGroupNamePopupSearch() {   
	var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#trgtFromGrpTypeHidden').val()+"&sourceTariff="+$('#trgtFromSrcTariff').val()+"&grpName="+$('#trgtFromGrpName').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'GroupNameSearch', windowStyle); 
	
}

function fromItemPopupSearch() {   
	var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+$('#trgtFromGrpTypeHidden').val()+"&sourceTariff="+$('#trgtFromSrcTariff').val()+"&grpName="+$('#trgtFromGrpName').val()+"&itemName="+$('#trgtFromItemName').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
}

function fromRatePopupSearch() {
	var rate=$('#trgtFromRateDesc').val()
	var rateDesc = rate.split("-");
	equipResult = rateDesc[0];
	odFlag = rateDesc[1];
	rateVal = rateDesc[2];
	if(rateVal==undefined){
		rateVal="ALL"
	}
	var actionUrl = _context+"/cas/replicateConditionRateLookup.do?grpTyp="+$('#trgtFromGrpTypeHidden').val()+"&sourceTariff="+$('#trgtFromSrcTariff').val()+"&grpName="+$('#trgtFromGrpName').val()+"&itemName="+$('#trgtFromItemName').val()+"&rateDesc="+encodeURIComponent(rateVal);
	
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'RateSearch', windowStyle);    
}



function sourceTariffSearchUpdate(id){

var values = id.split("|");
	$('#trgtFromSrcTariff').val(values[0]);
	var grpTypeCode = $("#trgtFromGrpTypeHidden").val();
	var srcTrf = $('#trgtFromSrcTariff').val();
	var grpNm = $('#trgtFromGrpName').val();
	if(srcTrf!=null && srcTrf!="" && srcTrf!="ALL")
	{
		if(grpNm!=null && grpNm!="" && grpNm!="ALL")
		{
				
			if(grpTypeCode=='01')
			{ 	
				$('#trgtFromGrpName').val(srcTrf);
			}

		}
	}

}

function groupNameSearchUpdate(id){
	var values = id.split("|");
	$('#trgtFromGrpName').val(values[0]);

}

function itemNameSearchUpdate(id){
	var values = id.split("|");
		$('#trgtFromItemName').val(values[0]);
		$("#trgtFromRateDesc").removeAttr("disabled");
}

function rateSearchUpdate(id){
	var selectedRates = id.split("~~");	
	if(selectedRates!=null && selectedRates!="" && selectedRates.length>1){
		for(var i=0;i<selectedRates.length-1;i++){
			var values = selectedRates[i].split(",");
			if(values!=null && values!="" && values!=undefined){
				 if(values[2]=="null"){
					 values[2] ="" ;
				 }
				 if(values[3]=="null"){
					 values[3] ="" ;
				 }
				 var delimited="";
				 for(var j=0;j<values.length;j++){
					 if(j>3){
						 if(delimited!=null && delimited!=""){
							 delimited=delimited+","+values[j];
						 }
						 else{
							 delimited=delimited+values[j];
						 }
					 }

				 }
				 var finalDesc="";
				 var isRateAvailable=false;
				 var split=delimited.split("\\");
				 for(var index=0;index<split.length;index++) {
					 finalDesc=finalDesc+split[index];
				 }
				var rateStr = values[1]+"-"+values[2]+" "+values[3]+"-"+finalDesc;
				var rateDescOptionsLength = $('select#rateDescList option').length;			
								
				if(rateDescOptionsLength == 0){
					$('#rateDescList') .append($('<option>', { value : values[0] }).text(rateStr));
				} else {
					var myOpts = document.getElementById('rateDescList').options;					
					for(var i=0;i<myOpts.length;i++){						
						if(myOpts[i].value == values[0]){
							isRateAvailable = true;
						} 
					}
					
					if(!isRateAvailable){
						$('#rateDescList') .append($('<option>', { value : values[0] }).text(rateStr));				
					}
					//alert(myOpts[0].text) //=> Value of the first option
				}
					//$('#rateDescList') .append($('<option>', { value : values[0] }).text(rateStr));
			}
		}
	}
	else{
		var values = id.split("|");
		 if(values[2]=="null"){
			 values[2] ="" ;
		 }
		 if(values[3]=="null"){
			 values[3] ="" ;
		 }
		 var delimited=values[4];
		 var finalDesc="";
		 var isRateAvailable=false;
		 var split=delimited.split("\\");
		 for(var index=0;index<split.length;index++) {
			 finalDesc=finalDesc+split[index];
		 }
		 
		var rateStr = values[1]+"-"+values[2]+" "+values[3]+"-"+finalDesc;
		var rateDescOptionsLength = $('select#rateDescList option').length;
		//alert("rateDescOptionsLength "+rateDescOptionsLength);
		if(rateDescOptionsLength == 0){
			$('#rateDescList') .append($('<option>', { value : values[0] }).text(rateStr));
		} else {
			var myOpts = document.getElementById('rateDescList').options;			
			for(var i=0;i<myOpts.length;i++){				
				if(myOpts[i].value == values[0]){
					isRateAvailable = true;
				} 
			}
			
			if(!isRateAvailable){
				$('#rateDescList') .append($('<option>', { value : values[0] }).text(rateStr));				
			}
			//alert(myOpts[0].text) //=> Value of the first option
		}
		
	}
}