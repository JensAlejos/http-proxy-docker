$(document).ready(function () {
	
	
	var ediEquipmentCol = [ 'Equipment#','Seal#','EDI Equip<br>Type/Size','Temp/<br>Scale','Pieces','Kind','Wgt','Cubic'];
	
	var ediEquipmentMod = [
	                         {name:'equipmentCheckDigit',index:'equipmentCheckDigit', width:100,editable:false},
	                         {name:'sealNumber',index:'sealNumber', width:100,editable:false}, 
	                         {name:'ediEquipmentTypeSize',index:'ediEquipmentTypeSize', width:100,editable:false}, 
	                         {name:'tempScalel',index:'tempScalel', width:100,editable:false}, 
	                         {name:'pieceCount',index:'pieceCount', width:100,editable:false}, 
	                         {name:'pieceCountUnitOfMeasure',index:'pieceCountUnitOfMeasure', width:60,editable:false}, 
	                         {name:'weight',index:'weight', width:100,editable:false}, 
	                         {name:'volume',index:'volume', width:100,editable:false}, 
	                        ];
	
	var jsonReaderSpSvc = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell"
		};

	createGrid(
			"ediEquipmentDetailGrid", // grid id for user
			"ediEquipmentDetailPager", // page id for user
			_context+'/ediShipment/loadEquipment', 
			"", 
			"", 
			"", 
			"",
			ediEquipmentCol, 
			ediEquipmentMod, 
			"EDI Equipment",
			150,
			5,
			[5,10,15],
			false,false,false,true,jsonReaderSpSvc,
			false,true,	true,false,
			true,false,false,false,
			false,false,true);
	
	
});

/*
function unloadSpecialServiceGrid(){
	$('#specialServiceGrid').jqGrid('GridUnload');
}

function loadSpecialServiceGrid(){
	$('#specialServiceGrid').trigger("reloadGrid");
}*/