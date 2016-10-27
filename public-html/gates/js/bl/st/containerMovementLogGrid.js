
$("#containerMovementStatusForm").validationEngine('attach');
	
	tabSequence('#containerMovementStatusForm');
	

$(document).ready(function() {


	var cntrMovementLogCol = ['Movement Information','Date', 'Time','Location','Addn Information/Carrier','IM Event'];

	var cntrMovementLogMod = [

	                          {name:'movementInformation',index:'movementInformation', width:230, editable:true, editrules:{required:true}, editoptions:{size:20}},
	                      	  {name:'date',index:'date', width:100,editable:true, editrules:{required:true}, editoptions:{size:20}},
	                      	  {name:'time',index:'time', width:100, editable:true, editrules:{required:true}, editoptions:{size:20}},
	                          {name:'location',index:'location', width:100,editable:true, editrules:{required:true}, editoptions:{size:20}},
	                      	  {name:'addnInfoCarrier',index:'addnInfoCarrier', width:250,editable:true, editrules:{required:true}, editoptions:{size:20}},
	                      	  {name:'imEvent',index:'imEvent', width:70,editable:true, editrules:{required:true}, editoptions:{size:20}},
	                      	    
	                            ];
	
	
	var jsonReaderCmsLog = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell"
			
		};
 
	
	createGrid(
			"cntrmvmtloggrid1", // grid id for user
			"cntrmvmtlogpager1", // page id for user
			_context+'/containerMovement/load', 
			"", 
			"", 
			"", 
			"", 
			cntrMovementLogCol, 
			cntrMovementLogMod, 
			"",
			230,
			10,
			[5,10,15],
			false,
			false,
			false, //load once
			true, jsonReaderCmsLog,true,true,false,true,true,false,false,false,false,false,true);
	
		
	createGrid(
			"cntrmvmtloggrid2", // grid id for user
			"cntrmvmtlogpager2", // page id for user
			_context+'/containerMovement/loadNonIMMovementLog', 
			"", 
			"", 
			"", 
			"", 
			cntrMovementLogCol, 
			cntrMovementLogMod, 
			"",
			230,
			10,
			[5,10,15],
			false,
			false,
			false, //load once
			true, jsonReaderCmsLog,true,true,false,true,true,false,false,false,false,false,true);
	
	
		$("#cntrmvmtloggrid2").setGridParam({'rowNum':10}); // FOR DEFECT MANUALLY SET
		$("#cntrmvmtloggrid2").trigger('reloadGrid');
  	
});
 

