$(document).ready(
		function() {

			var errorGridColNames= ['Error Id', 'Cmdy Line', 'Sev', 'Error Text','YP','Source Tariff','Group Name','Item','Rate'];
			var errorGridColModel= [ 
			                        {name:'reErrorMessageId',index:'reErrorMessageId', hidden:true, formatter:'number'},
			          				{name:'commoditySeqNbr',index:'commoditySeqNbr', width:100, editable:false },
			        				{name:'messageSeverity',index:'messageSeverity', width:50, sorttype:'date', editable:false },
			        				{name:'messageTextValue',index:'messageTextValue', width:260, editable:false },
			        				{name:'typeValue',index:'typeValue', width:50, editable:false },
			        				{name:'courceTariffId',index:'sourceTariffId', width:127, editable:false },
			        				{name:'groupName',index:'groupName', width:127, editable:false },
			        				{name:'item',index:'item', width:80, editable:false },
			        				{name:'rate',index:'rate', width:80, editable:false },
			                         ];

			var jsonReaderError = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				repeatitems : false,
				cell : "cell",
				id : "reErrorMessageId"
			};

			createGrid("reErrorGrid", "pagerReErrorGrid",
					'/gates/maintainRate/loadReErrorGrid',
					'', '', '', '',
					errorGridColNames, errorGridColModel,
					"List Of Error/Warning Messages", 70, 5, [ 5, 10, 15 ], false, false, false, true,
					jsonReaderError,true,true,true,false,false,false,false,false,false,false,true);
					
		});