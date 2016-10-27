$(document).ready(function () {
	var isSupplementHidden=true;
	if($('#isSupplementDefaultFilteredOptions').val()=="true"){
		isSupplementHidden=false;
		}
	var hideCustomAddRow = true; 
	if($('#hideCustomAddRow').val() == 'false'){
		hideCustomAddRow = false; 
	}
	var hidePagerRow = true;
	if($('#hidePagerRow').val() == 'false'){
		hidePagerRow = false; 
	}
	
	var readOnlyGrid =true;
	var hidePagerRow =true;
	if($('#searchOn').val() == "true"){
		readOnlyGrid = false;
		hidePagerRow = false;
	}
	
	var colNamesForOverride = ['Id','Trade','Form Type','Rated', 'Copies', 'Location', 'Hold', 'Mail SVC','Print Option Id','Arol Id', 'Print Option Charge', 'Actions'];
	var colModelForOverride = [
	                          	{name:'id',index:'id', width:30, editable:true, hidden:true},
	                          	{name:'tradeId',index:'tradeId', width:50,edittype:'select', editoptions: {value: getTradeCodeString},editrules:{required:true},editable:true,formatter:'select'},
	                          	{name:'formTypeCode',index:'formTypeCode', width:50,edittype:'select', editoptions: {value: getFormTypeCodesString,
	                          		dataEvents: [
							                      {  type: 'change',
							                         fn: function(e) {
							                        	 var rowId = $(e.target).closest("tr.jqgrow").attr("id");
							                        	 var tradeIdValue = $('#tradeId').val();
							                        	 if(tradeIdValue == '' || tradeIdValue == 'undefined'){
							                        		    tradeIdValue = $('#'+rowId+'_'+'tradeId').val();
							                                  } else {
							                                	  tradeIdValue = $('#tradeId').val();
							                                  } 
							                        	 
							                       if(tradeIdValue == 'A'){							                        	 
							                        	 if(typeof rowId=='undefined'){
							                        		 if(this.value=='FB'){
									                        		 this.form.rateCode[0].checked = true;
										                        	 this.form.rateCode[0].disabled = true;
										                        	 this.form.numberOfCopies[0].value = '';
									                        		 this.form.numberOfCopies[0].disabled = false;
									                        	 }else{
									                        		 this.form.rateCode[0].checked = false;
									                        		 this.form.rateCode[0].disabled = true;
									                        		 this.form.numberOfCopies[0].value = '';
									                        		 this.form.numberOfCopies[0].disabled = true;
									                        	 }
							                        	 }else{
							                        		 if(this.value=='FB'){
									                        		 $('input#'+rowId+"_"+'rateCode').attr('checked',true);
										                        	 $('input#'+rowId+"_"+'rateCode').attr('disabled',true);
										                        	 $('input#'+rowId+"_"+'numberOfCopies').attr('value','');
									                        		 $('input#'+rowId+"_"+'numberOfCopies').attr('disabled',false);
									                        	 }else{
									                        		 $('input#'+rowId+"_"+'rateCode').attr('checked',false);
									                        		 $('input#'+rowId+"_"+'rateCode').attr('disabled',true);
									                        		 $('input#'+rowId+"_"+'numberOfCopies').attr('value','');
									                        		 $('input#'+rowId+"_"+'numberOfCopies').attr('disabled',true);
									                        	 }
							                        	    }	
							                        	 
							                        	 } else {
							                        		 
							                        	  	 if(typeof rowId=='undefined'){
								                        		 if(this.value=='FB'){
										                        		 this.form.rateCode[0].checked = true;
											                        	 this.form.rateCode[0].disabled = true;
										                        	 }else{
										                        		 this.form.rateCode[0].disabled = false;
										                        	 }
								                        	 }else{
								                        		 if(this.value=='FB'){
										                        		 $('input#'+rowId+"_"+'rateCode').attr('checked',true);
											                        	 $('input#'+rowId+"_"+'rateCode').attr('disabled',true);
										                        	 }else{
										                        		 $('input#'+rowId+"_"+'rateCode').attr('disabled',false);
										                        	 }
								                        	 }
							                        		 
							                        	 }  
							                        	 
							                        	 var isValueSetup = false;
							                        	 var formTypeCodeValue = "";
							                        	
							                        	 if(typeof rowId=='undefined'){
							                        		 formTypeCodeValue = this.value;							                        		 
							                        	 } else {
							                        		 formTypeCodeValue = $('#'+rowId+'_'+'formTypeCode').val();							                        		 
							                        	 }							                        		
							                        		 //tradeIdValue = $('#tradeId').val();
							                        		 //alert("tradeIdValue  "+tradeIdValue);
							                        	 
							                        	
							                        	//alert("formTypeCodeValue "+formTypeCodeValue);
							                        	 if(formTypeCodeValue=='FB'){
							                        			$.ajax({
							                        				url: _context + "/contact/emailAuthorization/isAddRoleSetupForSelTradeAndDocumentType",
							                        				type: 'GET',
							                        				dataType: 'json',
							                        				cache: false,
							                        				async: false,
							                        				data: 'arolId='+$('#addressRoleId').val()+'&tradeCode='+tradeIdValue+'&documentType='+'FP',
							                        				beforeSend: function () { 
							                        				},
							                        				error: function () { 							                        					  
							                        				},
							                        				success: function (data) {
							                        				},
							                        				complete: function (response, textStatus) { 							                        					
							                        					var result = eval('(' + response.responseText + ')');							                        					
							                        					isValueSetup = result.data;
							                        				}							                        			
							                        				
							                        			}); 
							                        			
							                        			if(isValueSetup == true){
							                        				getCityCodes(rowId);
							                        			} else {
							                        				
							                        				$.ajax({
								                        				url: _context + "/contact/emailAuthorization/isAddRoleSetupForSelTradeAndDocumentType",
								                        				type: 'GET',
								                        				dataType: 'json',
								                        				cache: false,
								                        				async: false,
								                        				data: 'arolId='+$('#addressRoleId').val()+'&tradeCode='+tradeIdValue+'&documentType='+'FC',
								                        				beforeSend: function () { 								                        				

								                        				},
								                        				error: function () {
								                        				},
								                        				success: function (data) {
								                        				},
								                        				complete: function (response, textStatus) {
								                        					var result1 = eval('(' + response.responseText + ')');
								                        					isValueSetup = result1.data;
								                        				}								                        			
								                        				
								                        			}); 
							                        				
							                        				if(isValueSetup == true){
							                        					getCityCodes(rowId);
							                        				} else {
							                        					getCityCodes1(rowId);
							                        				}							                        				
							                        			}
							                        		 
							                        	 } else {
							                        		 getCityCodes1(rowId);
							                        	 }						                        	
							                        	 
							                         }
							                      }
							                   ]	
	                          	},editrules:{required:true},editable:true,formatter:'select'},
	                          	{name:'rateCode',index:'rateCode', width:20,edittype:'checkbox',editable:true,editoptions: { value:"R:U" }},
	                          	{name:'numberOfCopies',index:'numberOfCopies', width:30,edittype:'text',editable:true,editrules:{required:false,integer:true,custom:true,custom_func:onlyPositiveValues},editoptions: {size:6, maxlength:2,
	                          		dataEvents: [
							                      {  type: 'change',
							                         fn: function(e) {
							                        	 var val=e.target.value.trim();
							                        	 e.target.value=val;
							                         }
							                      }
							                   ]}},
	                          	{name:'cityCode',index:'cityCode', width:30,edittype:'select', editoptions: {dataUrl: "/gates/addressRole/billPrint/location"},editrules:{required:false},editable:true},
	                          	{name:'holdValue',index:'holdValue', width:20,edittype:'checkbox',editable:true,editoptions: { value:"Y:N" }},
	                          	{name:'mailServiceCode',index:'mailServiceCode', width:30,edittype:'select', editoptions: {value: getMailSVCTypeCodesString},editrules:{required:false},editable:true,formatter:'select'},
	                          	{name:'addressRolePrintOptId',index:'addressRolePrintOptId', width:30,edittype:'text',editable:true,hidden:true},
	                          	{name:'arolId',index:'arolId', width:30,edittype:'text',editable:true,hidden:true},
	                          	{name:'printOptionCharge',index:'printOptionCharge', width:10,edittype:'text',editable:true,editoptions:{defaultValue:true}, hidden:true},
	                          	{name:'actions', index:'actions', width:30, align:"center", editable:false, search:false, sortable:false,formatter:'actions',  formatoptions:{keys:true}}

	                          	];
	
	createGrid(
			"overrideDefaultGridId", // grid id 
			"overrideDefaultGridPager", // pager id 
			'/gates/addressRole/billPrint/loadOverrideDefaultOptions', 
			'/gates/addressRole/billPrint/addOverrideDefaultOptions',
			'/gates/addressRole/billPrint/editOverrideDefaultOptions',
			'/gates/addressRole/billPrint/deleteOverrideDefaultOptions',
			'/gates/addressRole/billPrint/multipleDeleteOverrideDefaultOptions',
			colNamesForOverride, 
			colModelForOverride, 
			"Override Default",100
			,10 ,[10,20,30] ,
			!_readonly, /* multiselect */
			!_readonly, /* multidelete */
			true, /* loadOnce */
			readOnlyGrid, /* readOnlyGrid */
			null, /* jsonReader */
			_readonly, /* hideEdit */
			_readonly, /* hideDelete */
			true, /* autowidth */
			true, /* rownumbers */
			_readonly || hideCustomAddRow, /* hideCustomAddRow */
			hidePagerRow /* hidePagerRow */
	);


	
	var colNamesForSupplement = ['Id','Trade','Form Type','Rated', 'Copies', 'Location', 'Hold', 'Mail SVC','Print Option Id','Arol Id', 'Print Option Charge', 'Actions'];
	var colModelForSupplement = [
	                            {name:'id',index:'id', width:30, editable:true, hidden:true},
	                            {name:'tradeId',index:'tradeId', width:50,edittype:'select', editoptions: {value: getTradeCodeString},editrules:{required:true},editable:true,formatter:'select'},
								{name:'formTypeCode',index:'formTypeCode', width:50,edittype:'select', editoptions: {value: getFormTypeCodesString,
									dataEvents: [
							                      {  type: 'change',
							                         fn: function(e) {
							                        	 var rowId = $(e.target).closest("tr.jqgrow").attr("id");
							                        	 var tradeIdValue = $('#tradeId').val();
							                        	 if(tradeIdValue == '' || tradeIdValue == 'undefined'){
							                        		    tradeIdValue = $('#'+rowId+'_'+'tradeId').val();
							                                  } else {
							                                	  tradeIdValue = $('#tradeId').val();
							                                  }							                        	 
							                        	 
							                if(tradeIdValue == 'A'){ 	 
							                       if(typeof rowId=='undefined'){
							                        		 if(this.value=='FB'){
								                        		 this.form.rateCode[1].checked = true;
									                        	 this.form.rateCode[1].disabled = true;
									                        	 this.form.numberOfCopies[1].value = '';
								                        		 this.form.numberOfCopies[1].disabled = false;
								                        	 }else{
								                        		 this.form.rateCode[1].checked = false;
								                        		 this.form.rateCode[1].disabled = true;
								                        		 this.form.numberOfCopies[1].value = '';
								                        		 this.form.numberOfCopies[1].disabled = true;
								                        	 }
						                        	 }else{
						                        		 if(this.value=='FB'){
							                        		 $('input#'+rowId+"_"+'rateCode').attr('checked',true);
								                        	 $('input#'+rowId+"_"+'rateCode').attr('disabled',true);
								                        	 $('input#'+rowId+"_"+'numberOfCopies').attr('value','');
							                        		 $('input#'+rowId+"_"+'numberOfCopies').attr('disabled',false);
							                        	 }else{
							                        		 $('input#'+rowId+"_"+'rateCode').attr('checked',false);
							                        		 $('input#'+rowId+"_"+'rateCode').attr('disabled',true);
							                        		 $('input#'+rowId+"_"+'numberOfCopies').attr('value','');
							                        		 $('input#'+rowId+"_"+'numberOfCopies').attr('disabled',true);
							                        	 }
					                        	 }
							                } else {
							                 	 if(typeof rowId=='undefined'){
					                        		 if(this.value=='FB'){
							                        		 this.form.rateCode[1].checked = true;
								                        	 this.form.rateCode[1].disabled = true;
							                        	 }else{
							                        		 this.form.rateCode[1].disabled = false;
							                        	 }
					                        	 }else{
					                        		 if(this.value=='FB'){
							                        		 $('input#'+rowId+"_"+'rateCode').attr('checked',true);
								                        	 $('input#'+rowId+"_"+'rateCode').attr('disabled',true);
							                        	 }else{
							                        		 $('input#'+rowId+"_"+'rateCode').attr('disabled',false);
							                        	      }
					                        	           }							                	
							                            }
							                         }
							                      }
							                   ]		
								},editrules:{required:true},editable:true,formatter:'select'},
								{name:'rateCode',index:'rateCode', width:20,edittype:'checkbox',editable:true,editoptions: { value:"R:U" }},
								{name:'numberOfCopies',index:'numberOfCopies', width:30,edittype:'text',editable:true,editrules:{required:false,integer:true,custom:true,custom_func:onlyPositiveValues},editoptions: {size:6, maxlength:2,
									dataEvents: [
							                      {  type: 'change',
							                         fn: function(e) {
							                        	 var val=e.target.value.trim();
							                        	 e.target.value=val;
							                         }
							                      }
							                   ]	}},
							                   
								{name:'cityCode',index:'cityCode', width:30,edittype:'select', editoptions: {dataUrl: "/gates/addressRole/billPrint/location"},editrules:{required:false},editable:true},
								{name:'holdValue',index:'holdValue', width:20,edittype:'checkbox',editable:true,editoptions: { value:"Y:N" }},
								{name:'mailServiceCode',index:'mailServiceCode', width:30,edittype:'select', editoptions: {value: getMailSVCTypeCodesString},editrules:{required:false},editable:true,formatter:'select'},
								{name:'addressRolePrintOptId',index:'addressRolePrintOptId', width:30,edittype:'text',editable:true,hidden:true},
								{name:'arolId',index:'arolId', width:30,edittype:'text',editable:true,hidden:true},
								{name:'printOptionCharge',index:'printOptionCharge', width:10,edittype:'text',editable:true,editoptions:{defaultValue:true}, hidden:true},
								{name:'actions', index:'actions', width:30, align:"center", editable:false, search:false, sortable:false,formatter:'actions',  formatoptions:{keys:true}}
							
								];
	
	createGrid(
			"supplementDefaultGridId", // grid id 
			"supplementDefaultGridPager", // pager id 
			'/gates/addressRole/billPrint/loadSupplementDefaultOptions', 
			'/gates/addressRole/billPrint/addSupplementDefaultOptions',
			'/gates/addressRole/billPrint/editSupplementDefaultOptions',
			'/gates/addressRole/billPrint/deleteSupplementDefaultOptions',
			'/gates/addressRole/billPrint/multipleDeleteSupplementDefaultOptions',
			colNamesForSupplement, 
			colModelForSupplement, 
			"Supplement Default",100
			,10 ,[10,20,30] ,
			!_readonly, /* multiselect */
			!_readonly, /* multidelete */
			true, /* loadOnce */
			readOnlyGrid, /* readOnlyGrid */
			null, /* jsonReader */
			_readonly, /* hideEdit */
			_readonly, /* hideDelete */
			true, /* autowidth */
			true, /* rownumbers */
			false, /* hideCustomAddRow */
			hidePagerRow, /* hidePagerRow */
			false,	/*customEditMethod*/
			false,	/*customGridComplete*/
			false,	/*customLoadComplete*/
			isSupplementHidden	/*defaultHidden*/
			
	);


});

//getLocatoin city codes based on Form Type
function getCityCodes(rowId){	
	$.ajax({
		url: _context+"/addressRole/billPrint/location1",
		type: 'GET',
		dataType: 'json',
		cache: false,
		data: '',
		beforeSend: function () {
		},
		error: function () {
		},
		success: function (data) { 
			//alert('success');
			//alert(data);

		},
		complete: function (response, textStatus) { 
			
			var result = eval('(' + response.responseText + ')');
			//alert("result*** "+result.data);
			var allValues = result.data.split(';');
			//var allValues = result.data;
			if(typeof rowId=='undefined'){
				$('#cityCode').empty();
				$('#cityCode')
			      .append($('<option>',{value : ''})
			      .text(''));
			} else {				
				 $('#'+rowId+"_"+'cityCode').empty();
				 $('#'+rowId+"_"+'cityCode')
			      .append($('<option>',{value : ''})
			      .text(''));
			}			
			
			if(typeof rowId=='undefined'){ 
			 for ( var i = 0; i < allValues.length; i++) {
				var codes = allValues[i].split(':');
				//var codes = allValues[i];
				if(allValues[i] != ''){
					$('#cityCode')
					      .append($('<option>',{value : codes[0],'title' :codes[1],'role':'option'}).text(codes[0]));
				}
			}
			
			} else {
				 for ( var i = 0; i < allValues.length; i++) {
						var codes = allValues[i].split(':');
						//var codes = allValues[i];
						if(allValues[i] != ''){
							$('#'+rowId+"_"+'cityCode')
							.append($('<option>',{value : codes[0],'title' :codes[1],'role':'option'}).text(codes[0])); 
						}
					}
				
			}	
			
			
		}
	});
	
}

//getLocatoin city codes based on Form Type
function getCityCodes1(rowId){
	$.ajax({
		url: _context+"/addressRole/billPrint/location2",
		type: 'GET',
		dataType: 'json',
		cache: false,
		data: '',
		beforeSend: function () {
		},
		error: function () {
		},
		success: function (data) { 
			//alert('success');
			//alert(data);
		},
		complete: function (response, textStatus) { 
			
			var result = eval('(' + response.responseText + ')');
			//alert("result*** "+result.data);
			var allValues = result.data.split(';');
			
			if(typeof rowId=='undefined'){
				$('#cityCode').empty();
				$('#cityCode')
			      .append($('<option>',{value : ''})
			      .text(''));
			} else {				
				 $('#'+rowId+"_"+'cityCode').empty();
				 $('#'+rowId+"_"+'cityCode')
			      .append($('<option>',{value : ''})
			      .text(''));
			}
			
			if(typeof rowId=='undefined'){ 
				 for ( var i = 0; i < allValues.length; i++) {
					var codes = allValues[i].split(':');
					//var codes = allValues[i];
					if(allValues[i] != ''){
						$('#cityCode')
						.append($('<option>',{value : codes[0],'title' :codes[1],'role':'option'}).text(codes[0])); 
					}
				}
				
				} else {
					 for ( var i = 0; i < allValues.length; i++) {
							var codes = allValues[i].split(':');
							//var codes = allValues[i];
							if(allValues[i] != ''){
								$('#'+rowId+"_"+'cityCode')
							      .append($('<option>',{value : codes[0],'title' :codes[1],'role':'option'}).text(codes[0])); 
							}
						}
					
				}
		}
	}); 
}



//validate if copies is a positive integer
function onlyPositiveValues(value, colname) {
	if (value < 0) 
	   return [false,"Please enter value greater than 0"];
	else 
	   return [true,""];
	}
//to focus the grid on clicking search button

window.onload=function(){
	if($('#searchOn').val() == "true")
	{
		$('#tradeId').focus();
	}
};

