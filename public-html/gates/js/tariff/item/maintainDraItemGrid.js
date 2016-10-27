$(document).ready(function() {
			var addFlag=true;
			colNamesForZipCode = [ 'id', 'Zip Code', 'Action' ];
			colModelForZipCode = [ {
				name : 'id',
				index : 'id',
				width : 100,
				editable : false,
				hidden : true
			}, {
				name : 'zipCode',
				index : 'zipCode',
				width : 150,
				align : "center",
				editable : true,
				sortable : true,
				hidden : false,
				editoptions: { maxlength : 7,			
                dataEvents: [
                   {  type: 'blur',
                      fn: function(e) {
                    	var v=$(e.target).val();
                    	 $(e.target).val($(e.target).val().trim());
                         var portZone=$('#portZoneNumber').val();
                         if(portZone==null || portZone=='' && v!=null && v!='')
                        	 {
                        	 alert('Zip code cannot be created with a null value for Port Zone');
                        	 $(e.target).val('');
                        	 }
                      }
                   }
                ]
				}
			}, {
				name : 'actions',
				index : 'actions',
				width : 50,
				align : "center",
				editable : false,
				search : false,
				sortable : true,
				formatter : 'actions',
				formatoptions : {
					keys : false
			},
			} ];

			var jsonReader = {
					root : "rows",
					page : "page",
					total : "total",
					records : "records",
					repeatitems : false,
					cell : "cell",
					id : "id"
				};

		    var _isdel=false;
		    if(_displayonly)
		    {
		    	var _isdel=true;
		    }
		    if(_readonlyItemModify)
		    {
		    	var _isdel=true;
		    }
			$('#gridIdForZipCode').gatesGrid({
				caption: "ZipCode",
				colNames: colNamesForZipCode,
				colModel: colModelForZipCode,
				jsonReader: jsonReader,
				pager: '#pagerIdForZipCode',
				rowNum: 10,
				rowList: [10, 20, 30,100],
				height: 280,
				width: 400,
				multiselect:false,
				autowidth: false,
				gatesOptions: {
					urls: {load: _context+'/tariff/itemDra/loadZipCodeGrid',add : _context+'/tariff/itemDra/addZipCodeGrid',del: _context+'/tariff/itemDra/deleteZipCodeGrid'},
					controls: {
						navBarAdd: false,
						navBarEdit: false,
						navBarDelete: false,
						inlineAdd: true, //- hideCustomAddRow
						inlineEdit: false, //- hideEdit
						inlineDelete: true, //- hideDelete
						hidePagerRow: false
					},
					loadComplete: function(){
						$("#pagerIdForZipCode_left").css("width","10px");
					},
					gridComplete: function() {
					    var rows = $("#gridIdForZipCode").getDataIDs(); 
					    for (var i = 0; i < rows.length; i++) {
					            $("#gridIdForZipCode").jqGrid('setRowData',rows[i],false, {background:'#f3f3f3'});            
					    }
					},
				}
			});
		});

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}
