$(document).ready(function () {

	var colNames = ['Id', 'DODAAC', 'Actions'];
	var colModels = [
	               {name:'dodaacSeqNo', index:'dodaacSeqNo',hidden:true},	                               
	               {name:'dodaacCode',index:'dodaacCode', width:150, editable:true, editoptions: {maxlength: 6}, editrules:{required:true}},
			   	   {name:'actions', index:'actions', width:70, align:"center", editable:false, search:false, sortable:false, formatter:'actions',
	            	   formatoptions : {keys : true,
	            		   afterSave:function()
	                	   {
	                		   isBookingChanged = "Y";
	                		   return true;
	                	   }
	               }}
			   	];

	var jsonReaderReference = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "dodaacSeqNo"
		};
	
	/*createGrid(
			"dodaacGrid", // grid id for DODAAC
			"dodaacGridPager", // page id for DODAAC
			_context+'/booking/loadDODAACGrid', 
			_context+'/booking/addDODAAC', 
			_context+'/booking/updateDODAAC', 
			_context+'/booking/deleteDODAAC', 
			_context+'/booking/deleteDODAAC',
			colNames, 
			colModels, 
			"DODAAC",
			83,
			3,
			[3,6,9],
			true,
			true,
			false, //load once
			false, jsonReaderReference, false, false, false, true, 
			false, false, false, false, false, false, true);*/
	
	/*Booking Security*/
	var pagerMultiDelete = true;
	if(isMilitaryDisplayOnly && !isMilitaryModifiable){
		pagerMultiDelete = false;
	}
	
	/*Booking Security*/
	if(isMilitaryDisplayOnly || isMilitaryModifiable){
		/*$('#dodaacGrid').gatesGrid({
			caption: "DODAAC",
			colNames: colNames,
			colModel: colModels,
			jsonReader: jsonReaderReference,
			pager: '#dodaacGridPager',
			rowNum: 3,
			rowList: [ 3, 6, 9 ],
			height: 83,
			multiselect:true,
			gatesOptions: {
				urls: {load:_context+'/booking/loadDODAACGrid', add:_context+'/booking/addDODAAC', edit:_context+'/booking/updateDODAAC', del: _context+'/booking/deleteDODAAC', delMultiple:_context+'/booking/deleteDODAAC'},
				extraData: {
					some: 'thing',
					trade: function() {
						return $('#tradeCode').val();
					}
				},
				controls: {
					navBarAdd: false,
					navBarEdit: false,
					navBarDelete:pagerMultiDelete
				},
				loadComplete: dodaacLoadComplete,
				deleteAfterSubmit: dodaacAfterSubmit
			}
		});*/
		
		createGrid("dodaacGrid", // grid id for party
				"dodaacGridPager", // page id for party
				_context+'/booking/loadDODAACGrid', // geturl
				_context+'/booking/addDODAAC', // addurl
				_context+'/booking/updateDODAAC', // edit url
				_context+'/booking/deleteDODAAC', //delete URL
				_context+'/booking/deleteDODAAC',// delete selected URL
				colNames, colModels, "DODAAC",// caption
				83,// height
				3,// row num
				[ 3, 6, 9 ],// row list
				true,// multiselect
				pagerMultiDelete,// multidelete
				false,// load once
				false, // read only grid
				jsonReaderReference, // json reader
				false, // hide edit
				false, // hide delete
				true, // autowidth
				true, // rownumbers
				true, // hide custom add row
				false,// hide pager row
				null,// custom edit method
				null,// custom grid complete
				dodaacLoadComplete,// custom load complete
				false,// default hidden
				true,// row Color Based On status
				false,// celledit
				dodaacAfterSubmit);//After submit function on delete
	}
});

var dodaacLoadComplete = function(){
	/*Booking Security*/
	if((isMilitaryDisplayOnly && !isMilitaryModifiable)  || $('#bookingStatusCode').val()=='CANC'){
		$("div.ui-pg-div.ui-inline-del").hide();
		$("div.ui-pg-div.ui-inline-edit").hide();
		$('#gview_dodaacGrid input').attr("disabled", true);
		$('table[aria-labelledby="gbox_dodaacGrid"] thead tr[id="tr_dodaacSeqNo"] td a[id="sData"]').hide();
	}else{
		$("div.ui-pg-div.ui-inline-del").show();
		$("div.ui-pg-div.ui-inline-edit").show();
		$('#gview_dodaacGrid input').attr("disabled", false);
		$('table[aria-labelledby="gbox_dodaacGrid"] thead tr[id="tr_dodaacSeqNo"] td a[id="sData"]').show();
	}
	
	$('#gbox_dodaacGrid #sData').click(function(){
		isBookingChanged = "Y";
	});
	
	return true;
};

var dodaacAfterSubmit = function(result)
{
	if(result.success)
		isBookingChanged = "Y";
};
