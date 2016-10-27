$(document).ready(function () {
	 $('#trgtToGrpName').gatesPopUpSearch({func:function() {toGroupNamePopupSearch()}});
	 $('#trgtToSrcTariff').gatesPopUpSearch({func:function() {toSourceTariffPopupSearch()}});	
	 $('#trgtToItemName').gatesPopUpSearch({func:function() {toItemPopupSearch()}});	
	 $('#trgtToRateDesc').gatesPopUpSearch({func:function() {toRatePopupSearch()}});
});

function toSourceTariffPopupSearch() {   
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#toGroup_type_Drop_down').val()+"&sourceTariff="+$('#trgtToSrcTariff').val()+"&screen=to";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function toGroupNamePopupSearch() {   
	var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#toGroup_type_Drop_down').val()+"&sourceTariff="+$('#trgtToSrcTariff').val()+"&grpName="+$('#trgtToGrpName').val()+"&screen=to";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'GroupNameSearch', windowStyle); 
	
}

function toItemPopupSearch() {   
	var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+$('#toGroup_type_Drop_down').val()+"&sourceTariff="+$('#trgtToSrcTariff').val()+"&grpName="+$('#trgtToGrpName').val()+"&itemName="+$('#trgtToItemName').val()+"&screen=to";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
}

function toRatePopupSearch() {
	
	var actionUrl = _context+"/cas/ratelookup.do?grpTyp="+$('#toGroup_type_Drop_down').val()+"&sourceTariff="+$('#trgtToSrcTariff').val()+"&grpName="+$('#trgtToGrpName').val()+"&itemName="+$('#trgtToItemName').val()+"&rateDesc="+encodeURIComponent($('#trgtToRateDesc').val())+"&screen=to";
	
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'RateSearch', windowStyle);    
}
function sourceTariffSearchUpdateTo(id,scr){

	var values = id.split("|");
		$('#trgtToSrcTariff').val(values[0]);
		var grpTypeCode = $("#toGroup_type_Drop_down").val();
		var srcTrf = $('#trgtToSrcTariff').val();
		var grpNm = $('#trgtToGrpName').val();
		if(srcTrf!=null && srcTrf!="" && srcTrf!="ALL")
		{
			if(grpNm!=null && grpNm!="" && grpNm!="ALL")
			{
					
				if(grpTypeCode=='01')
				{ 	
					$('#trgtToGrpName').val(srcTrf);
				}

			}
		}

	}

	function groupNameSearchUpdateTo(id){
		var values = id.split("|");
		$('#trgtToGrpName').val(values[0]);

	}

	function itemNameSearchUpdateTo(id){
		var values = id.split("|");
			$('#trgtToItemName').val(values[0]);
			$("#trgtToRateDesc").removeAttr("disabled");
	}

	function rateSearchUpdateTo(id){
		var values = id.split("|");
		 if(values[2]=="null"){
			 values[2] ="" ;
		 }
		 if(values[3]=="null"){
			 values[3] ="" ;
		 }
		 var delimited=values[4];
		 var finalDesc="";
		 var split=delimited.split("\\");
		 for(var index=0;index<split.length;index++) {
			 finalDesc=finalDesc+split[index];
		 }
		 
		var rateStr = values[1]+"-"+values[2]+" "+values[3]+"-"+finalDesc;
			$('#trgtToRateDesc').val(rateStr);
			$('#rateId').val(values[0]);
			$('#trgtToRateId').val(values[0]);
			
	}