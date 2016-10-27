
	$(document).ready(function() {
		
		$('#cities').jqGrid({
			caption: 'Cities/Ports',
			url:  _context + '/ports/grid',
			datatype : 'json',
			mtype: 'GET',
			colModel: [
				{ id: 'cityCodeDisplay', name: 'cityCodeDisplay', index: 'cityCodeDisplay', label: 'Code'}, 
				{ id: 'cityName', name: 'cityName', index: 'cityName', label: 'Name', width: 125 },
				{ id: 'cityCode', hidden:true, name: 'cityCode', index: 'cityCode', label: 'Code', width: 50 }, 
			],
			pager: '#citiesPager',
			rowNum: 25, 
			rowList: [ 25, 50, 75, 100],
			height: 800,
			width: 300, // 'auto',
			sortname: 'cityCodeDisplay',
			sortorder: 'acs',
			//- viewrecords: true,
			gridview: true,
			loadonce: true,
			loadtext: "Loading data...",
			/* //- postData: "", // avoid sending random number to the server; required to leverage browser caching*/
			prmNames: {nd: null}, 
			multiple: true,
			multiselect: true,
			jsonReader: {
				repeatitems: false, id: "0"
			},
			gridComplete: function() {
				/*$("#cities").setGridParam({datatype:'json',sortname: 'cityName'});*/
				if(_readonly){//D023445
					//alert('readOnly');
					$('#sData').hide();
					$('#gview_cities input').attr("disabled", true);
					$('#gview_cities select').attr("disabled", true);
				} else {
					//alert('Not readOnly');
					$('#sData').show();
					$('#gview_cities input').attr("disabled", false);
					$('#gview_cities select').attr("disabled", false);
				}
			},	
			ignoreCase: true
		})	
		 .jqGrid('filterToolbar',{stringResult: true, searchOnEnter: false, defaultSearch: 'ge', beforeSearch: beforeCitySearch});
		
		
		$('input:text').live('keyup', function() {

			var el = $(this);
				var text = $(el).val();
				if (text.trim()=="") {

					$(el).val("");

				}
		});
	});
	
	function beforeCitySearch() {
		console.log("beforeCitySearch");
		
		if($("#gs_cityCodeDisplay").val() != "") {
			console.log("code sort");
			$("#cities").jqGrid("sortGrid", "cityCodeDisplay", true);
		} else if( $("#gs_cityName").val() != "" ) {
			console.log("name sort");
			$("#cities").jqGrid("sortGrid", "cityName", true);
		}
	}
	
	function callLoad(){
	var selectedArr =[];
    selectedArr =  jQuery("#cities").jqGrid('getGridParam','selarrrow');
      
      for (var i = 0; i < selectedArr.length; i++) {
	 var cityCode = $('#cities').getCell(selectedArr[i], 'cityCodeDisplay');
	 var cityName = $('#cities').getCell(selectedArr[i], 'cityName');
	 $('#table3')
     .append($('<option>',{style:"color:blue" ,  value : cityCode })
     .text(cityName)); 
      }
	}
