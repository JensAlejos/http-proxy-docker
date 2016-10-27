$(document).ready(function () {
	
	var specialServiceCol = [ 'NO','Special Service','Level','All','Equipment/<br>VINsight#','Units','Rate','Rate Basis','Date','Payee','Amount'];
	
	var specialServiceMod = [
	                         {name:'seqNo',index:'seqNo', width:55,editable:false, editoptions:{readonly:true,size:10}, hidden:true},
	                         {name:'specialServiceCode',index:'specialServiceCode', width:80,editable:false, formatter:'showlink', formatoptions : {
	                   				baseLinkUrl : "javascript:",
	                				showAction: "editSpecialService('",
	                				addParam: "');" }
	                               }, 
	                         {name:'processLevelCode',index:'processLevelCode', width:50,editable:false},
	                         {name:'isApplyToAll',index:'isApplyToAll', width:50,editable:false}, 
	                         {name:'equipmentVinsight',index:'equipmentVinsight', width:70,editable:false}, 
	                         {name:'numberOfUnit',index:'numberOfUnit', width:60,editable:false}, 
	                         {name:'manualUserRate',index:'manualUserRate', width:60,editable:false}, 
	                         {name:'rateBasisCode',index:'rateBasisCode', width:50,editable:false}, 
	                         {name:'specialServiceDate',index:'specialServiceDate', width:60,editable:false}, 
	                         {name:'payee',index:'payee', width:120,editable:false}, 
	                         {name:'amount',index:'amount', width:50,editable:false}, 
	                        ];
	
	var jsonReaderSpSvc = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo"
		};

	createGrid(
			"specialServiceGrid", // grid id for user
			"specialServicePager", // page id for user
			'/gates/containerVariance/loadSpecialService', 
			'', 
			'', 
			'', 
			'',
			specialServiceCol, 
			specialServiceMod, 
			"Special Services",
			70,
			3,
			[3,6,9],
			false,
			false,
			false, //load once
			true, jsonReaderSpSvc,true,true,true,true,true,false,false,false,specialServiceGridLoadComplete,false,true);
});

var specialServiceGridLoadComplete = function(){
	var specialServiceNumberCount = $("#specialServiceGrid").getGridParam("reccount");
	var specialServiceDisplayText = "Special Service ";
	if(specialServiceNumberCount>0){
		for(var i=1;i<=specialServiceNumberCount;i++){
			var specialService = $("#specialServiceGrid").jqGrid('getCell', i , "specialServiceCode" );
			if(i==1){
				if(null!=specialService && specialService!=undefined && specialService!=false){
					specialServiceDisplayText=specialServiceDisplayText+' - '+specialService;
				}
			}else{
				if(null!=specialService && specialService!=undefined && specialService!=false){
					specialServiceDisplayText=specialServiceDisplayText+', '+specialService;
				}
			}
		}
	}
	setAccordianTabDetails('splServicesHeader',specialServiceDisplayText);
};