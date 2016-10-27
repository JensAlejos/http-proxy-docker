
function showQuotesGrid(){
	$("#quoteShowDialog" ).dialog( "option", "title", 'Quotes' );
	createQuoteExistsGrid();
	$("#quoteShowDialog").dialog('open'); 
}
		
function createQuoteExistsGrid(){
	var quoteExistsColNames = ['quoteId', 'Quote No', 'Version', 'Customer','Commodity Description','PLR','POL','POD','PLD','Quote Date','Expiration Date','Load'];
	var quoteExistsColModels = [
	               {name:'quoteId', hidden:true},
	               {
	            	    name:'quoteNumber', 
	            	    width:65, 
	            	    editable:false,
	            	    formatter : 'showlink',
		   					formatoptions : {
			   					baseLinkUrl : "javascript:",
			   					showAction : "getQuote('",
			   					addParam: "');"
		   					}
	               },
	               //{name:'quoteNumber', width:80, editable:false},
	               {name:'quoteVersion', width:50, editable:false},
	               {name:'customer', width:200, editable:false},
	               {name:'commodityDescription', width:180, editable:false},
	               {name:'placeOfReceipt', width:30, editable:false},
	               {name:'portOfLoading', width:30, editable:false},
	               {name:'portOfDischarge', width:33, editable:false},
	               {name:'placeOfDelivery', width:30, editable:false},
	               {name:'quoteDate', width:75, editable:false},
	               {name:'expirationDate', width:98, editable:false},
	               {name:'load', width:35, editable:false}
			   	];

	var jsonReaderQuoteExists = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"quoteId"
		};
	
	$('#quoteShowGrid').gatesGrid({
		caption: "Quotes",
		colNames: quoteExistsColNames,
		colModel: quoteExistsColModels,
		jsonReader: jsonReaderQuoteExists,
		pager: '#quoteShowPager',
		rowNum: 3,
		rowList: [ 3, 6, 9 ],
		height: 83,
		gatesOptions: {
			urls: {load:_context+'/booking/quote/showQuotes'},
			extraData: {
				aroleId: function(){
					return $("#showQuoteForAroleOnTemplatePull").val();
				},
				trade: function() {
					return $('#tradeCode').val();
				},
				placeOfReceipt: function(){
					return $('#blOriginCityCode').val();
				},
				placeOfDelivery: function(){
					return $('#blDestinationCityCode').val();
				},
				pol: function(){
					return $('#originPortCityCode').val();
				},
				pod: function(){
					return $('#destinationPortCityCode').val();
				},
				loadService: function(){
					return $('#loadServiceCode').val();
				},
				dischargeService: function(){
					return $('#dischargeServiceCode').val();
				},
				tariffNumber: function(){
					return $('#tariffNumber').val();
				},
				tariffItemNumber: function(){
					return $('#tariffItemNumber').val();
				},
				commodityDescription: function(){
					return $('#commodityDescription').val();
				}
			},
			controls: {
				navBarAdd: false,
				navBarEdit: false,
				navBarDelete: false
			}
		}
	});
}

function loadQuoteShowGrid(){
	$('#quoteShowGrid').trigger("reloadGrid");
}

function unloadQuoteShowGrid(){
	$('#quoteShowGrid').jqGrid('GridUnload');
}