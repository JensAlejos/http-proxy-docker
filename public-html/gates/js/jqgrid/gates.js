$(document).ready(function () {
	/*
	$.getJSON("getdata", function(data) {
		$('form').loadJSON(data);
		if ( $("#disableFields").length > 0 && $("#disableFields").val().length > 0){
			$.each($("#disableFields").val().split(","), function(intIndex, objValue) {
	            $("#" + objValue).attr("disabled", true);
	        });
		}
	});			
	*/

	/*$('#myForm').ajaxForm({ 
        // dataType identifies the expected content type of the server response 
        dataType:  'json', 
        // success identifies the function to invoke when the server response 
        // has been received 
        success:   processJson 
    }); 

	function processJson(data) { 
	    // 'data' is the json object returned from the server 
		$('form').loadJSON(data);
		if ( $("#disableFields").length > 0 && $("#disableFields").val().length > 0){
			$.each($("#disableFields").val().split(","), function(intIndex, objValue) {
	            $("#" + objValue).attr("disabled", true);
	        });
		}
	}*/

});

var defaultJsonReader = {
        root: "rows",
        page: "page",
        total: "total",
        records: "records",
        repeatitems: false,
        cell: "cell",
        id: "id"
    };

// Added footer row to the end of the call, hope that works
function createGrid(gridId, pagerId, getUrl, addUrl, editUrl, deleteUrl,
		deleteSelectedUrl, colNames, colModel, caption, height, rowNum,
		rowList, multiselect, multidelete, loadOnce, readOnlyGrid, jsonReader,
		hideEdit, hideDelete, autowidth, rownumbers, hideCustomAddRow, hidePagerRow, 
		customEditMethod, customGridComplete, customLoadComplete,defaultHidden,
		rowColorBasedOnStatus,cellEdit, deleteAfterSubmit,isSearch,delExtraParam, footerrow) {
	
	var lazy = false;
	
	var gatesCheetah = window.gatesCheetah || {};
	
	// D028986: 	EDI booking - HAZ info did not pulling in when approving booking 
	// This is a work around, the loading/init of the grid should be restructured.
	if (gatesCheetah && gatesCheetah.lazyLoadGrid === true) {
		var arrayLength = gatesCheetah.lazyGrids.length;
		for (var i = 0; i < arrayLength; i++) {
		    if (gatesCheetah.lazyGrids[i] === gridId && 'hazGrid' != gridId) {
		    	lazy = true;
		    }
		}
	} 

	// addfooterrow
	if(!footerrow) footerrow = false;
	
	console.log('gridId:' + gridId + " lazyLoad:" + lazy+" footer="+footerrow);
	if(isSearch == undefined){
		isSearch = false;
	}
	if (!jsonReader){
		jsonReader = defaultJsonReader;
	}
	$("#"+gridId).jqGrid({
		lazy: lazy,
	   	url: getUrl,
	   	editurl: editUrl,
		datatype: 'json',
		mtype: 'GET',
	   	colNames: colNames,
	   	colModel: colModel,
	   	footerrow: footerrow,
	    userDataOnFooter: footerrow,
	   	postData: { 
		},
		rowNum:rowNum,
	   	rowList:rowList,
	   	height: height,
	   	cellEdit: cellEdit == undefined ? false : cellEdit,
	   	autowidth: autowidth == undefined ? true : autowidth,
		rownumbers: rownumbers == undefined ? true : rownumbers,
	   	pager: '#'+pagerId,
	    viewrecords: true,
	    caption: caption,
	    emptyrecords: "Empty records",
	    loadonce: loadOnce,
	    ignoreCase: true,
	    delOptions: {url: deleteUrl, caption: "Confirmation", msg: "Do you want to delete record(s)?",
	    	afterShowForm: function($form) {    
	 		   	var $dialog = $form.closest('div.ui-jqdialog'),
	 		    idOfDeletedRow = $("#DelData>td:first").text(),
	 		    selRowCoordinates = $('#'+idOfDeletedRow, $('#'+gridId)).offset();
	 		   	$dialog.offset(selRowCoordinates);
		    },
		    delData : delExtraParam == undefined ? {} : delExtraParam,
		    afterSubmit : function(response, postdata)
			{
		    	var result = eval('(' + response.responseText + ')');
				
				if($.isFunction(deleteAfterSubmit)) {
					deleteAfterSubmit(result);
				}
				
				if(!result.success)
				{
					if(result.messages!=null && result.messages.length!=0 && result.messages[0]!=null)
						return [false, result.messages[0]];
					else
						return [false, ""];
				}
				else
					return [true,""];
			}
	    },
	    editOptions: {url: editUrl},
        altRows:true,
        altclass:'uiAltRowClass',
	    loadComplete: function() {
	    	if(!readOnlyGrid){
		    	if($("#sData", "#gbox_" + gridId).length == 0){
		    		$("#"+gridId).jqGrid('editGridRowCustom','new', { url: addUrl });
			    }
	    	}
	    	/* D014209 when control is in grid enter key is attached to add button of the grid */
			$("#" + "gbox_" + gridId + "> div > div > div > table > thead > tr" + " :input").bind("keydown", function(e){
					var code = (e.keyCode ? e.keyCode : e.which); 
					if(code == 13) {
							$("#sData", "#" + "gbox_" + gridId).click();
							e.stopImmediatePropagation();
							return false;
					}
				}
			);
			if($.isFunction(customLoadComplete)) {
				customLoadComplete();
			}
	    },
	    jsonReader : jsonReader,
		gridComplete: function(){
			isAnyChangeInGrid();
	    	$("#"+"del_"+gridId, "#"+"gbox_"+gridId).hover(
	    			function() { jQuery("#" + gridId).jqGrid('setGridParam', {editurl: deleteSelectedUrl}); }
	    		);
	    	if (hideEdit){$("div.ui-pg-div.ui-inline-edit", "#"+"gbox_"+gridId).hide();}
	    	if (hideDelete){$("div.ui-pg-div.ui-inline-del", "#"+"gbox_"+gridId).hide();}
	    	if (hideCustomAddRow){$("#gview_"+gridId).find("#tr_id").hide();}
	    	if (hidePagerRow){$("#pg_"+pagerId).hide();}
	    	if ($.isFunction(customEditMethod)) {
				$("div.ui-pg-div.ui-inline-edit",
						"#" + "gbox_" + gridId).each(
						function() {
							$(this).attr(
									"onclick",
									$(this).attr("onclick").replace(
											"$.fn.fmatter.rowactions",
											"customEditMethod"));

						});
			}
			if($.isFunction(customGridComplete)) {
				customGridComplete();
			}
			
			//row coloring
			if(rowColorBasedOnStatus){
				
				 var rowIDs = jQuery("#"+gridId).getDataIDs(); 
					
			      for (var i=0;i<rowIDs.length;i=i+1){ 
			        rowData=jQuery("#"+gridId).getRowData(rowIDs[i]);
			        
			        var trElement = jQuery("#"+ rowIDs[i],jQuery('#'+gridId));
			        
			        //D025368
			        if(getUrl == "../spotpull/loadDispatchLocationGrid" && rowData.isLocationChng == "Y"){
			        	 trElement.addClass('rowred');
			        }else if (rowData.status=="E") {			        	
			           // trElement.removeClass('ui-widget-content');
			            trElement.addClass('rowred');
			        }else 
			        	if (rowData.status=="F")
			        		trElement.addClass('rowyellow');
			        	else if(rowData.isCheckVoid=="Voided")
			        		trElement.addClass('rowred');
			        }
			      }
			
			
			try{
			if(isNumeric(selectedId+'')){
			
				//jQuery("#accesrialChargeGrid tr#"+selectedId+"").addClass("ui-state-highlight selected-row ui-state-hover");
				
				
				jQuery("#accesrialChargeGrid tr#"+selectedId+" .cbox").click();
				jQuery("#accesrialChargeGrid tr#"+selectedId+" .cbox").attr("checked","checked");
				
				setTimeout(function(){
					if(jQuery("#info_dialog") != null)
						jQuery('#info_dialog').attr("style","display:none");
				}, 200);		
				
				
			}
			}catch(e){}
			
		}
		,
		multiselect:multiselect,
		hiddengrid: defaultHidden
	});
	$("#"+gridId).jqGrid('navGrid',"#"+pagerId,
			{edit:false,add:false,del:multidelete,search:isSearch,refresh:isSearch},
			{ },
	        { },
	        { 
	        	afterShowForm: function($form) {    
		 		   	var $dialog = $form.closest('div.ui-jqdialog'),
		 		    idOfDeletedRow = $("#DelData>td:first").text(),
		 		    selRowCoordinates = $('#'+idOfDeletedRow, $('#'+gridId)).offset();
		 		   	$dialog.offset(selRowCoordinates);
			    },
			    delData : delExtraParam == undefined ? {} : delExtraParam,
			    afterSubmit : function(response, postdata)
				{
			    	var result = eval('(' + response.responseText + ')');
					
					if($.isFunction(deleteAfterSubmit)) {
						deleteAfterSubmit(result);
					}
					
					if(!result.success)
					{
						if(result.messages!=null && result.messages.length!=0 && result.messages[0]!=null)
							return [false, result.messages[0]];
						else
							return [false, ""];
					}
					else
						return [true,""];
				}
	        }, 
			{ 
	        	afterShowSearch: function($form) {  
	        		
	        		var searchDialog = $("#searchmodfbox_"+gridId);
	        		position = $('#search_'+gridId).offset();
	        		position.top = position.top -130;
	        		searchDialog.offset(position);
			    },
		    	sopt:['cn',  'eq'/*,'bw', 'ew', 'lt', 'gt', 'ne'*/],
		        closeOnEscape: true, 
		        multipleSearch: false,
		        closeAfterSearch: true
		        //,overlay:false
		        
		        
		    }
	);
}


function enableGrid(gridId, pagerId){
	$("#gview_"+gridId).find("#tr_id").show();
	$("#pg_"+pagerId).show();
}

