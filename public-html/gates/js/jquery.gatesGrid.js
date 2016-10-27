/*
 * Wrapper over jqGrid
 * - standard conventions
 * 
 */
(function ($) {
	/*
	 * caption, 
	 * height, width, 
	 * rowNum, // how many rows to show
	 * rowList, // [10,20,50,100] 
	 * gridId, // no longer need; $('#gridId').gatesGrid({}); 
	 * pagerId, // can be avoided by following some naming convention based on gridId
	 * colNames, colModel, // can limit to colModel by using its 'label' attribute for colNames
	 * getUrl, addUrl, editUrl, deleteUrl, deleteSelectedUrl, //+ 
	 * multiselect, 
	 * multidelete, //+ delete option in navigation/pager bar
	 * loadOnce, 
	 * readOnlyGrid, //+ used to decide if custom add row is to be displayed
	 * jsonReader,
	 * hideEdit, hideDelete, //+ hides corresponding inline action icons 
	 * autowidth, 
	 * rownumbers, 
	 * hideCustomAddRow, //+ intended to hide custom add row (does NOT work!) 
	 * hidePagerRow, //+ hide navigation/pager bar
	 * customEditMethod, //+ ???? 
	 * customGridComplete, customLoadComplete, //+ called inside gridComplete in the same order 
	 * 												(actually should be data-load followed by grid-complete)
	 * defaultHidden, //+ maps to 'hiddengrid' option
	 * rowColorBasedOnStatus //+ should be really a customGridComplete thing specific to a grid
	 * 
	 * //--------- additional ---------
	 * extraData (extraPostParams) 
	 *   //+ extra parameters to be posted on load, add/edit/delete; can be function or object
	 *   //  (postdata; editData)
	 */
	$.fn.gatesGrid = function(optionsParameter) {
		//- Support all jqGrid options, and an option called gatesOptions, which will override jqGrid options
		
		var gridId = $(this).attr('id');
		var gatesDefaults = {
			urls: {load: null, add: null, edit: null, del: null, delMultiple: null},
			extraData: {},
			//editData: {},
			//delData: {},
			//addData: {},
			readOnly: false,
			controls: {
				navBar: true,
				navBarAdd: true,
				navBarEdit: true,
				navBarDelete: true, //- multiDelete
				
				inlineAdd: true, //- hideCustomAddRow
				inlineEdit: true, //- hideEdit
				inlineDelete: true //- hideDelete
			},
			loadComplete: function() {},
			gridComplete: function() {},
			customEditMethod: function() {}
		};
		var gatesOptions = $.extend({}, gatesDefaults, {}, optionsParameter.gatesOptions);
		gatesOptions.controls = $.extend({}, gatesDefaults.controls, {}, optionsParameter.gatesOptions.controls);
	
		var serializeData = function(data, extraData) {
			return $.extend({}, data, {}, extraData);
		};
		
		var jqGridDefaults = {
			datatype: 'json',
			jsonReader: {
				root: "rows",
				page: "page",
				total: "total",
				records: "records",
				repeatitems: false,
				cell: "cell",
				id: "id"
			},
			url: gatesOptions.urls.load,
			editUrl: gatesOptions.urls.add,
			mtype: 'GET',
			autowidth: true,
			rownumbers: true,
			viewrecords: true,
			emptyrecords: "Empty records",
	        altRows:true,
	        altclass:'uiAltRowClass',
	        postData: gatesOptions.extraData, //- load
			serializeRowData: function(data) { //- inline edit
				return serializeData(data, gatesOptions.extraData);
			},
		    delOptions: { 
		    	url: gatesOptions.urls.del, caption: "Confirmation", msg: "Do you want to delete record(s)?",
				serializeDelData: function(data) { //- inline delete
					return serializeData(data, gatesOptions.extraData);
				},
				afterShowForm: function($form) {    
		 		   	var $dialog = $form.closest('div.ui-jqdialog'),
		 		    idOfDeletedRow = $("#DelData>td:first").text(),
		 		    selRowCoordinates = $('#'+idOfDeletedRow, $('#'+gridId)).offset();
		 		   	$dialog.offset(selRowCoordinates);
			    }				
		    },
		    editOptions: { 
		    	url: gatesOptions.urls.edit,
		    	editData: gatesOptions.extraData, // add/edit item through overlay
		    	delData: gatesOptions.extraData,
		    	serializeDelData: function(data) { //- delete
					return serializeData(data, gatesOptions.extraData);
				}
	    	},
	    	serializeDelData: function(data) { //- delete
				return serializeData(data, gatesOptions.extraData);
			}
		};

		var jqGridOptions = $.extend({}, jqGridDefaults, {}, optionsParameter);
		var pagerId = $(jqGridOptions.pager).attr('id');
		
		// modify jqGridOptions based on gatesOptions
		jqGridOptions.url = gatesOptions.urls.load;
		jqGridOptions.editUrl = gatesOptions.urls.add;
		
		var controls = gatesOptions.controls;
		
	    jqGridOptions.loadComplete = function() {
	    	if(!gatesOptions.readOnly && controls.inlineAdd) {
		    	if($("#sData", "#gbox_" + gridId).length == 0){
		    		$("#"+gridId).jqGrid('editGridRowCustom','new', { 
		    			url: gatesOptions.urls.add, 
		    			editData: gatesOptions.extraData // needs to fix "postdata = $.extend(postdata,rp_ge.editData,onCS);"
		    			// serializeEditData
	    			});
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
			
			if ($.isFunction(gatesOptions.loadComplete)) {
				gatesOptions.loadComplete();
			}
	    },

		jqGridOptions.gridComplete = function(){
	    	$("#"+"del_"+gridId, "#"+"gbox_"+gridId).hover(
	    			function() { jQuery("#" + gridId).jqGrid('setGridParam', {editurl: gatesOptions.urls.delMultiple}); }
	    		);
	    	if (gatesOptions.readOnly || !controls.inlineEdit){
	    		$("div.ui-pg-div.ui-inline-edit", "#"+"gbox_"+gridId).hide();
    		}
	    	if (gatesOptions.readOnly || !controls.inlineDelete){
	    		$("div.ui-pg-div.ui-inline-del", "#"+"gbox_"+gridId).hide();
    		}
	    	/* -- redundant, as already done in loadComplete; moreover, the code is not correct
	    	if (gatesOptions.hideCustomAddRow){
	    		$("#gview_"+gridId).find("#tr_id").hide();
    		}
    		*/
	    	if (!controls.navBar){
	    		$("#pg_"+pagerId).hide();
    		}
			/*if ($.isFunction(gatesOptions.customEditMethod)) {
				$("div.ui-pg-div.ui-inline-edit",
						"#" + "gbox_" + gridId).each(
						function() {
							$(this).attr(
									"onclick",
									$(this).attr("onclick").replace(
											"$.fn.fmatter.rowactions",
											gatesOptions.customEditMethod));

						});
			}*/
			if($.isFunction(gatesOptions.gridComplete)) {
				gatesOptions.gridComplete();
			}
			
			//row coloring
			if(gatesOptions.rowColorBasedOnStatus){
				
				 var rowIDs = jQuery("#"+gridId).getDataIDs(); 
				
			      for (var i=0;i<rowIDs.length;i=i+1){ 
			        rowData=jQuery("#"+gridId).getRowData(rowIDs[i]);
			        var trElement = jQuery("#"+ rowIDs[i],jQuery('#'+gridId));
			        if (rowData.status=="E") {			        	
			           // trElement.removeClass('ui-widget-content');
			            trElement.addClass('rowred');
			        }else{ 
			          if (rowData.status=="F"){
			          // trElement.removeClass('ui-widget-content');
			            trElement.addClass('rowyellow');
			          }
			        }
			      }
			}
		      
		};
		
		/*
		 * Iterate jqGridOptions.colModel
		 * 	- if formatter = "actions"
		 *	- update formatoptions {
		 *		//- also consider readOnly flag ...
		 *		editbutton: gatesOptions.controls.inlineEdit
		 *		addbutton: gatesOptions.controls.inlineAdd
		 *	}
		 *
		 *	// remove "hide" logic on loadComplete()
		 */
		 for (var i=0;i<jqGridOptions.colModel.length;i=i+1){
			 if(jqGridOptions.colModel[i].formatter=="actions")
				 {
				 
				 }
		 }
		
	    
		// jqGridOptions.url = gatesOptions.urls.load;
		 
		return this.each(function() {
			$(this).jqGrid(jqGridOptions);
			
			if (jqGridOptions.pager) {
				$(this).jqGrid('navGrid', jqGridOptions.pager,
						{edit:controls.navBarEdit,add:controls.navBarAdd,del:controls.navBarDelete,search:false,refresh:false},
						{ }, //- prmEdit
				        { }, //- prmAdd
				        {   
				        	onclickSubmit:function(response, postdata, formid) {
				        		    // D024154, update grid before delete
						        	if(gatesOptions.delFunction) {
						        		gatesOptions.delFunction();
						        	}
						    },
				        	afterShowForm: function($form) {  
				        		
				        		
					 		   	var $dialog = $form.closest('div.ui-jqdialog'),
					            idOfDeletedRow = $("#DelData>td:first").text(),
					            selRowCoordinates = $('#'+idOfDeletedRow, $('#'+gridId)).offset();
					 		   	$dialog.offset(selRowCoordinates);
					 		   if(somethingChanged == true || somethingChanged == 'true')
								{
									somethingChanged=true;
								}
				        		else if (somethingChanged == false || somethingChanged == 'false') 
								{
									somethingChanged=false;
								}
						    }
				        }, //- prmDel
						{ //- prmSearch 
					    	sopt:['eq', 'ne', 'lt', 'gt', 'cn', 'bw', 'ew'],
					        closeOnEscape: true, 
					        multipleSearch: true, 
					        closeAfterSearch: true 
				        }
				);
			}

		});
	};
	
})(jQuery);
