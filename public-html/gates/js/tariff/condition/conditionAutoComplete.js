 $(document).ready(function () {
var dataName=null;
$('#fromTariffServiceSourceCode').gatesAutocomplete({
	 source:  _context+'/cas/autocomplete.do',
	 extraParams: {
	 		 	 method: 'searchTariffSource',
	 		     searchType: '11',
	 		 	 groupType:  function () { return "01"; }
	 		 	},
		formatItem: function(data) {
			dataName=data.name;
		 	 $('#grpId').val(dataName);
			return data.name;
		},
		formatResult: function(data) {
			 dataName=data.name;
		 	 $('#grpId').val(dataName);
			return data.name;
		},
		select: function(data) {
			 dataName=data.name;
		 	 $('#grpId').val(dataName);
			$('#fromTariffServiceSourceCode').val(dataName);			
		}	
	});	
//Blurr the data for invalid group Id
$('#fromTariffServiceSourceCode').change(function(){
	if($('#grpId').val()==null || $('input[name="grpId"]').val()==""){
   	$("#fromTariffServiceSourceCode").val(""); 
   	$("#fromTariffServiceGroupName").val(""); 
	}
	else
	{
		$("#fromTariffServiceSourceCode").val(dataName); 
		 if($('#formGroup_type_Drop_down').val()=="01"){
			 $('#fromTariffServiceGroupName').val(dataName);
			 $('#fromTariffServiceGroupName').attr("readonly","readonly");
			 $('#fromTariffServiceGroupName').validationEngine('hidePrompt');
		 }
		$('#grpId').val("");
	}
}); 
$('#fromTariffServiceGroupName').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	extraParams: {
	 		 	 method: 'searchGroupName',
	 		     searchType: '10',
	 		     groupType:  function () { return "01"; },
 		 		 sourceTariff:  function () { return $('#fromTariffServiceSourceCode').val(); }		
	 		 	},
	formatItem: function(data) {
		dataName=data.name;
	 	 $('#grpId').val(dataName);
		return data.name;
	},
	formatResult: function(data) {
		 dataName=data.name;
	 	 $('#grpId').val(data.id);
		return data.name;
	},
	select: function(data) {
		 dataName=data.name;
	 	 $('#grpId').val(data.id);
		$('#fromTariffServiceGroupName').val(data.id);
		$('#fromTariffServiceGroupId').val(data.id);
		populateGroupCommentFromSection();
	}	
});	
//Blurr the data for invalid group Id


$('#fromItem').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	minLength: 1,
	extraParams: {
	 		 	 method: 'searchItemName',
	 		     searchType: '43',
	 		     groupType:  function () { return "01"; },
		 		 sourceTariff:  function () { return $('#fromTariffServiceSourceCode').val(); }	,
	 		     groupName:  function () { return $('#fromTariffServiceGroupName').val(); }
	 		 	},
	
	 formatItem: function(data) {
		 dataName=data.name;
	 	 $('#itemId').val(data.id);
	 		 return data.name;
	 },
	 formatResult: function(data) {
		 dataName=data.name;
	 	 $('#itemId').val(data.id);
	 		 return data.name;
	 },
	 select: function(data) {
		 dataName=data.name;
	 $('#fromItem').val(data.id);
	 $('#fromItemId').val(data.id);		 		 		 
	 }		 
});
//Blurr the data for invalid item Id
$('#fromItem').change(function(){
	if($('#fromItem').val()==null || $('#fromItem').val()==""){				
	$("#fromItem").val("");       	
	  }		
	else{
		$("#fromItem").val(dataName); 
		$('#fromItemId').val("");
	}
}); 	



$('#fromRate').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	extraParams: {
	 		 	 method: 'searchRateDescription',
	 		     searchType: '45',
	 		     groupType:  function () { return "01"; },
		 		 sourceTariff:  function () { return $('#fromTariffServiceSourceCode').val(); }	,
	 		     groupName:  function () { return $('#fromTariffServiceGroupName').val(); },
	 		     itemName:  function () { return $('#fromItem').val(); }
	 		},
	 
	 formatItem: function(data) {
		 var flag=data.flag
	 	 var city=data.city;
	 	 if(flag==undefined || flag==null){
	 		flag="";
	 	 }
	 	 if(city==undefined || city==null){
	 		city="";
		 }
	 	 var desc=data.desc;
	 	 if(desc==undefined || desc==null){
	 		desc="";
	 	 }
 		return data.name+"-"+flag+"-"+city+"-"+desc;
 		 
	 },
 	formatResult: function(data) {
 		 var flag=data.flag
	 	 var city=data.city;
	 	 if(flag==undefined || flag==null){
	 		flag="";
	 	 }
	 	 if(city==undefined || city==null){
	 		city="";
		 }
	 	 var desc=data.desc;
	 	 if(desc==undefined || desc==null){
	 		desc="";
	 	 }
 		return data.name+"-"+flag+"-"+city+"-"+desc;
 	},
	
	select: function(data) {
		$('#fromRate').val(data.id);
		$('#fromRateId').val(data.id);
	}	
});

$('#toTariffServiceSourceCode').gatesAutocomplete({
	 source:  _context+'/cas/autocomplete.do',
	 extraParams: {
	 		 	 method: 'searchTariffSource',
	 		     searchType: '11',
	 		 	 groupType:  function () {return $('#toGroup_type_Drop_down').val();  }
	 		 	},
		formatItem: function(data) {
			 dataName=data.name;
		 	 $('#grpId').val(data.id);
			return data.name;
		},
		formatResult: function(data) {
			 dataName=data.name;
		 	 $('#grpId').val(data.id);
			return data.name;
		},
		select: function(data) {
	
			 dataName=data.name;
			 $('#grpId').val(data.id);
						
		}	
	});	
//Blurr the data for invalid group Id
$('#toTariffServiceSourceCode').change(function(){
	if($('#grpId').val()==null || $('input[name="grpId"]').val()==""){
  	$("#toTariffServiceSourceCode").val(""); 
	}
	else
	{
		$("#toTariffServiceSourceCode").val(dataName); 
		$('#grpId').val("");
	}
}); 

$('#toTariffServiceGroupName').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	extraParams: {
	 		 	 method: 'searchGroupName',
	 		     searchType: '10',
	 		     groupType:  function () { return "01"; },
 		 		 sourceTariff:  function () { return $('#toTariffServiceSourceCode').val();},
 		 		groupType:  function () { return $('#toGroup_type_Drop_down').val(); }	
	 		 	},
	formatItem: function(data) {
		 dataName=data.name;
	 	 $('#grpId').val(data.id);
		return data.name;
	},
	formatResult: function(data) {
		 dataName=data.name;
	 	 $('#grpId').val(data.id);
		return data.name;
	},
	select: function(data) {
		 dataName=data.name;
	 	 $('#grpId').val(data.id);
		$('#toTariffServiceGroupName').val(data.id);
		$('#toTariffServiceGroupId').val(data.id);
		$('#toTariffServiceGroupName').trigger('change');
	}	
});	
//Blurr the data for invalid group Id
//$('#toTariffServiceGroupName').blur(function(){	
$('#toTariffServiceGroupName').change(function(){
	if($('#grpId').val()==null || $('#grpId').val()==""){		
 	$("#toTariffServiceGroupName").val("");       	
	}
	else{
		$("#toTariffServiceGroupName").val(dataName);
		$('#grpId').val("");
		calculateExpDate();
	}
}); 


//code for item predictive
$('#toItem').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	minLength: 1,
	 extraParams: {
	 		 		 	 method: 'searchItemName',
	 		 		     searchType: '43',
	 		 		 	 groupType:  function () { return $('#toGroup_type_Drop_down').val(); },
	 		 		 	 sourceTariff:  function () { return $('#toTariffServiceSourceCode').val(); },
	 		 		 	 groupName:  function () { return $('#toTariffServiceGroupName').val(); }		
	 		 		 },
	
	 formatItem: function(data) {
		 dataName=data.name;
	 	 $('#toItemId').val(data.id);
	 		 return data.name;
	 },
	 formatResult: function(data) {
		 dataName=data.name;
	 	 $('#toItemId').val(data.id);
	 		 return data.name;
	 },
	 select: function(data) {
		 dataName=data.name;
	 		$('#toItem').val(data.id);	
	 		$('#toItemId').val(data.id);			
			$('#toItem').trigger('change');	
	 }		 
});	

//Blurr the data for invalid item Id
 $('#toItem').change(function(){
	if($('#toItemId').val()==null || $('#toItemId').val()==""){				
 	$("#toItem").val("");       	
	  }		
	else{
		$("#toItem").val(dataName); 
		$('#toItemId').val("");
	}
	calculateExpDate();
}); 	
 $('#toRate').change(function(){
	if($('#toRateId').val()==null || $('#toRateId').val()==""){				
 	$("#toRate").val("");       	
	  }	
	calculateExpDate();
}); 

$('#toRate').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	extraParams: {
		 	 method: 'searchRateDescription',
	 		     searchType: '45',
	 		 	 groupType:  function () { return $('#toGroup_type_Drop_down').val(); },
	 		 	 sourceTariff:  function () { return $('#toTariffServiceSourceCode').val(); },
	 		 	 groupName:  function () { return $('#toTariffServiceGroupName').val(); },		
	 		 	 itemName:  function () { return $('#toItem').val(); }		
	 		 },
	 
	 formatItem: function(data) {
 		 return data.name;
	 },
 	formatResult: function(data) {
 		 var flag=data.flag
	 	 var city=data.city;
	 	 if(flag==undefined || flag==null){
	 		flag="";
	 	 }
	 	 if(city==undefined || city==null){
	 		city="";
		 }
	 	 var desc=data.desc;
	 	 if(desc==undefined || desc==null){
	 		desc="";
	 	 }
 		return data.name+"-"+flag+"-"+city+"-"+desc;
 	},
	select: function(data) {
		$('#toRate').val(data.id);			
		$('#toRateId').val(data.id);
		populateRateComment();
		calculateExpDate();
	}	
});


$('#conditionCode').click(function(){
$('#conditionCityPortCity').gatesAutocomplete({
	source: _context+'/tm/Autocomplete/autoCompCityWithParameter?param=withCode',
	formatItem: function(item) {
		return item.cityCode+" "+item.cityName+","+item.stateCode+" "+item.isPort;
	},
	formatResult: function(item) {
		return item.cityCode;
	},
	select: function(item) {
		$('#conditionCityPortCity').val(item.id);
		$('#conditionCityPortCityHidden').val(item.cityCode);
	}	
});	
});
$('#conditionName').click(function(){
	$('#conditionCityPortCity').gatesAutocomplete({
		source: _context+'/tm/Autocomplete/autoCompCityWithParameter?param=withName',
		formatItem: function(item) {
			return item.cityCode+" "+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
			return  item.cityName;
		},
		select: function(item) {
			$('#conditionCityPortCity').val(item.id);
			$('#conditionCityPortCityHidden').val(item.cityCode);
		}	
	});	});
$('#fromTariffServiceGroupName').gatesPopUpSearch({func:function() {groupNameFromPopupSearch()}});
$('#fromTariffServiceSourceCode').gatesPopUpSearch({func:function() {SourceTariffFromPopupSearch()}});	
$('#fromItem').gatesPopUpSearch({func:function() {ItemFromPopupSearch()}});	
$('#toTariffServiceGroupName').gatesPopUpSearch({func:function() {groupNameToPopupSearch()}});
$('#toTariffServiceSourceCode').gatesPopUpSearch({func:function() {SourceTariffToPopupSearch()}});	
$('#toItem').gatesPopUpSearch({func:function() {ItemToPopupSearch()}});	
$('#toRate').gatesPopUpSearch({func:function() {RatePopToupSearch()}});	
$('#fromRate').gatesPopUpSearch({func:function() {RatePopFromupSearch()}});	
hideMandatoryWhenDisabled();
});
 
 function SourceTariffFromPopupSearch() { 
	 this.sourceTariff="From";
		var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#formGroup_type_Drop_down').val()+"&sourceTariff="+$('#fromTariffServiceSourceCode').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
	}

	function groupNameFromPopupSearch() {
		this.groupName="From";
		var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#formGroup_type_Drop_down').val()+"&sourceTariff="+$('#fromTariffServiceSourceCode').val()+"&grpName="+$('#fromTariffServiceGroupName').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		if($('#formGroup_type_Drop_down').val()!="01"){
			window.open(actionUrl, 'GroupNameSearch', windowStyle); 
		}
	}

	function ItemFromPopupSearch() { 
		this.item="From";
		var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+$('#formGroup_type_Drop_down').val()+"&sourceTariff="+$('#fromTariffServiceSourceCode').val()+"&grpName="+$('#fromTariffServiceGroupName').val()+"&itemName="+$('#fromItem').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'ItemNameSearch', windowStyle);    
	}
	function RatePopFromupSearch() {
		this.rat="From";
		rate =  $('#fromRate').val();
//		alert($('#fromGroup_type_Drop_down').val());
		if(rate=='ALL' || rate=='All' || rate=='all' )
		{
			var actionUrl = _context+"/cas/ratelookup.do?grpTyp=01&sourceTariff="+$('#fromTariffServiceSourceCode').val()+"&grpName="+$('#fromTariffServiceGroupName').val()+"&itemName="+$('#fromItem').val()+"&rateDesc="+encodeURIComponent(rate);
		}
		else if(rate!='ALL' || rate!='All' || rate!='all' )
		{
			var rateDesc = rate.split("-");
			equipResult = rateDesc[0];
			odFlag = rateDesc[1];
			rateVal = rateDesc[2];
			if(rateVal==undefined){
				rateVal="ALL"
			}
			var actionUrl = _context+"/cas/ratelookup.do?grpTyp=01&sourceTariff="+$('#fromTariffServiceSourceCode').val()+"&grpName="+$('#fromTariffServiceGroupName').val()+"&itemName="+$('#fromItem').val()+"&rateDesc="+encodeURIComponent(rateVal);
		}		
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'RateSearch', windowStyle);    
	}
	function SourceTariffToPopupSearch() { 
		this.sourceTariff="To";
		var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#toGroup_type_Drop_down').val()+"&sourceTariff="+$('#toTariffServiceSourceCode').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
	}

	function groupNameToPopupSearch() { 
		this.groupName="To";
		var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#toGroup_type_Drop_down').val()+"&sourceTariff="+$('#toTariffServiceSourceCode').val()+"&grpName="+$('#toTariffServiceGroupName').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'GroupNameSearch', windowStyle); 
	}

	function ItemToPopupSearch() {
		this.item="To";
		var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+$('#toGroup_type_Drop_down').val()+"&sourceTariff="+$('#toTariffServiceSourceCode').val()+"&grpName="+$('#toTariffServiceGroupName').val()+"&itemName="+$('#toItem').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'ItemNameSearch', windowStyle);    
	}
	
	function RatePopToupSearch() {
		this.rat="To";
		rate =  $('#toRate').val();
		if(rate=='ALL' || rate=='All' || rate=='all' )
		{
			var actionUrl = _context+"/cas/ratelookup.do?grpTyp="+$('#toGroup_type_Drop_down').val()+"&sourceTariff="+$('#toTariffServiceSourceCode').val()+"&grpName="+$('#toTariffServiceGroupName').val()+"&itemName="+$('#toItem').val()+"&rateDesc="+encodeURIComponent(rate);
		}
		else if(rate!='ALL' || rate!='All' || rate!='all' )
		{
			var rateDesc = rate.split("-");
			equipResult = rateDesc[0];
			odFlag = rateDesc[1];
			rateVal = rateDesc[2];
			if(rateVal==undefined){
				rateVal="ALL"
			}
			var actionUrl = _context+"/cas/ratelookup.do?grpTyp="+$('#toGroup_type_Drop_down').val()+"&sourceTariff="+$('#toTariffServiceSourceCode').val()+"&grpName="+$('#toTariffServiceGroupName').val()+"&itemName="+$('#toItem').val()+"&rateDesc="+encodeURIComponent(rateVal);
		}		
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'RateSearch', windowStyle);    
	}
	
	function sourceTariffSearchUpdate(str){
		if(sourceTariff=="From"){
			$('#fromTariffServiceSourceCode').val(str);
			$('#fromTariffServiceGroupName').val(str);
		}
		else if(sourceTariff=="To"){
			$('#toTariffServiceSourceCode').val(str);
		}
	}
	function groupNameSearchUpdate(str){
		if(groupName=="From"){
			$('#fromTariffServiceGroupName').val(str);
		}
		else if(groupName=="To"){
			$('#toTariffServiceGroupName').val(str);
			populateGroupComment();
			calculateExpDate();
		}
	}
	function itemNameSearchUpdate(str){
		if(item=="From"){
			$('#fromItem').val(str);
		}
		else if(item=="To"){
			$('#toItem').val(str);
			populateItemComment();
			calculateExpDate();
		}
	}
	function rateSearchUpdate(id){
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
		if(rat=="From"){
			$('#fromRate').val(rateStr);
			$('#fromRateId').val(values[0]);
		}
		else
			if(rat=="To"){
				$('#toRate').val(rateStr);
				$('#toRateId').val(values[0]);
				populateRateComment();
				calculateExpDate();
			}
	}
	function populateGroupCommentFromSection(){
		document.getElementById("grp_to_comment_link").style.display="block";
		var groupId = $('#toGroup_type_Drop_down').val();
		var sourceName = $('#toTariffServiceSourceCode').val();
		var groupName = $('#toTariffServiceGroupName').val();
		$.ajax({
			   type: "GET",
			   url: _context +"/condition/populateGroupComment?",
			   data: {
				   groupId:  groupId,
				   sourceName:  sourceName,
				   groupName:  groupName
			   },
			   success: function(msg){
				   $('#toTariffServiceGroupId').val(msg[0]);
				   var comment1=	"<input type='hidden' id = 'toGroupCommentId' /><span id ='count'></span>" ;
					var comment2 = "<a class='comments' href='#' ></a>";
					if($('#toTariffServiceGroupId').val()!=null){
						$('#grp_to_comment_link').html(comment2).append(comment1);
						$('#toGroupCommentId').val(msg[1]);
					}
				  var args4 = {
							entityType: 'TRSV',
							entityId:  $('#toTariffServiceGroupId').val(),
							commentId: "toGroupCommentId",
							viewOnly: true,
							commentsFrame: 'togrpCommentsFrame'
						};
					$("#grp_to_comment_link").comments(args4);
			   }
		 });
	}
	function populateGroupComment(){
		document.getElementById("grp_to_comment_link").style.display="block";
		var groupId = $('#toGroup_type_Drop_down').val();
		var sourceName = $('#toTariffServiceSourceCode').val();
		var groupName = $('#toTariffServiceGroupName').val();
		$.ajax({
			   type: "GET",
			   url: _context +"/condition/populateGroupComment?",
			   data: {
				   groupId:  groupId,
				   sourceName:  sourceName,
				   groupName:  groupName
			   },
			   success: function(msg){
				   $('#toTariffServiceGroupId').val(msg[0]);
				   var comment1=	"<input type='hidden' id = 'toGroupCommentId' /><span id ='count'></span>" ;
					var comment2 = "<a class='comments' href='#' ></a>";
					if($('#toTariffServiceGroupId').val()!=null){
						$('#grp_to_comment_link').html(comment2).append(comment1);
						$('#toGroupCommentId').val(msg[1]);
					}
				  var args4 = {
							entityType: 'TRSV',
							entityId:  $('#toTariffServiceGroupId').val(),
							commentId: "toGroupCommentId",
							viewOnly: true,
							commentsFrame: 'togrpCommentsFrame'
						};
					$("#grp_to_comment_link").comments(args4);
			   }
		 });
	}
	
function populateItemComment(){
	document.getElementById("toitem_comment_link").style.display="block";
		var groupId = $('#toTariffServiceGroupId').val();
		var itemName = $('#toItem').val();
		$.ajax({
			   type: "GET",
			   url: _context +"/condition/populateItemComment?",
			   data: {
				   groupId:  groupId,
				   itemName:  itemName
			   },
			   success: function(msg){
				   $('#toItemId').val(msg[0]);
				   var comment1=	"<input type='hidden' id = 'toItemCommentId' /><span id ='count'></span>" ;
					var comment2 = "<a class='comments' href='#' ></a>";
					
					if(msg[0]!=null){
						$('#toitem_comment_link').html(comment2).append(comment1);
						$('#toItemCommentId').val(msg[1]);
					}
				  var args4 = {
							entityType: 'TRSI',
							entityId:   $('#toItemId').val(),
							commentId: "toItemCommentId",
							viewOnly: true,
							commentsFrame: 'toitemCommentsFrame'
						};
					$("#toitem_comment_link").comments(args4);
			   }
		 });
	}
	
function populateRateComment(){
	document.getElementById("to_rate_comment_link").style.display="block";
	var rateId = $('#toRateId').val();
	$.ajax({
		   type: "GET",
		   url: _context +"/condition/populateRateComment?",
		   data: {
			   rateId: rateId
		   },
		   success: function(msg){
			   var comment1=	"<input type='hidden' id = 'toRateCommentId' /><span id ='count'></span>" ;
				var comment2 = "<a class='comments' href='#' ></a>";
				if($('#toRateId').val()!=null){
					$('#to_rate_comment_link').html(comment2).append(comment1);
					$('#toRateCommentId').val(msg);
				}
			  var args4 = {
						entityType: 'TRRD',
						entityId:  $('#toRateId').val(),
						commentId: "toRateCommentId",
						viewOnly: true,
						commentsFrame: 'torateCommentsFrame'
					};
				$("#to_rate_comment_link").comments(args4);
		   }
	 });
}
function calculateExpDate(){
	var data=$('#tariffConditonForm').formSerialize();
	   $.ajax({
			   type: "GET",
			   url: _context +"/condition/calculateExpDate",
			   data: data,
			   success: function(responseText){
				       $("#expirationDate").val(responseText.data);
				       $.unblockUI();
			   }
			   });
}
