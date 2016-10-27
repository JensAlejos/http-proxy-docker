var temp=[]; 
var temp1=[]; 
var values=[]; 
var isReqSent="" ; 
$(document).ready(function() { 

	//code to add row color on the basis of column value 
	var table = document.getElementById("casQuickSearch");
	if(table!=null){
		
	for (var i = 0, row; row = table.rows[i]; i++) {
		  //check ur condition here
		row.cells[2].style.display="none";
		row.cells[3].style.display="none";
		  if(row.cells[2].innerHTML=='N') {
		   for (var j = 0, col; col = row.cells[j]; j++) {
		     if(col.innerHTML.search("tooltip")>0) {
		       var index=col.innerHTML.search("rel");
		       var value=col.innerHTML;
		       var finalValue=value.substring(0,index);
		       finalValue=finalValue+" style='color:red'";
		       finalValue=finalValue+value.substring(index);
		       col.innerHTML=finalValue;
		       
		     }
		     col.style.color = "red";
		     
		   }
		}  
		  else 
		  	{
			  if(row.cells[3].innerHTML=='Y') {
				  
				  for (var j = 0, col; col = row.cells[j]; j++) {
					     if(col.innerHTML.search("tooltip")>0) {
					       var index=col.innerHTML.search("rel");
					       var value=col.innerHTML;
					       var finalValue=value.substring(0,index);
					       finalValue=finalValue+" style='color:blue'";
					       finalValue=finalValue+value.substring(index);
					       col.innerHTML=finalValue;
					     }
					     col.style.color = "blue";
					   }
			  		}
			  else
				  {
				  
				  }
		}
	}
		
	}
	
	//adding default value to record type code 
	$('#recType').append($('<option></option>').val('ALL').html('ALL')); 
	
        $('form[name="ediLineDataSearchForm"]').formatCasSearchForm({ 
                hasSavedSearchFeature: false, 
                customActions: [ ] 
                }); 
        
        $('td.dataField:contains("in_shipment_no:")').hide(); 
        $('#in_shipment_no').hide(); 
        $('td.dataField:contains("in_shipment_seq_no:")').hide(); 
        $('#in_shipment_seq_no').hide(); 
        
        $('#lineDataDiv').hide(); 
        
        //code to hide cas generated original fields
         $('div.searchTable').hide(); 
        
        $('div.searchTable').parent().parent().after( 
                        '<div id="showFields">' +         
                        '<table id="abc">' + 
                        '<tr class="span-25">' +                                 
                            '<td class="span-14">'+ 
                                            '<label class="span-4 label">Billing#<span class="mandatory" style="font-size:8pt">*</span></label>'+ 
                                                    '<div style="margin-right:0px;" class="span-5">'+ 
                                                            '<input type="text" size="5" maxlength="7" id="shipNo" value="" name="shipNo" class="fieldText">'+        "   "+                                     
                                                            '<input type="text" size="1" maxlength="3" id="shipSeqNo" value="" name="shipSeqNo" class="fieldText">' +                           
                                                    '</div>'+ 
                                           '<div class="fieldText" >' + 
                                            '<input type="button" onclick="javascript:fillEdiIdDropdown();" value="Go" name="go" id="goButton" class="buttonNoFloat">'+ 
                                    '</div>'+ 
                            '</td>'+                             
                            '<td class="span-10">'+ 
                                    '<label class="span-4 label">EDI ID</label>'+ 
                                              '<select id="ediId" >' + 
                                            '</select>' +                                 
                        '</td>' + 
            '</tr>'+ 
                        '<tr class="span-25">' + 
                                '<td class="span-8">'+ 
                                        '<label class="span-4 label">Version</label><span id="versionNo" class="fieldText span-2"></span>' + 
                            '</td>' + 
                            '<td class="span-8">'+ 
                                            '<label class="span-3 label">Current Rec</label><span id="currRec" class="fieldText span-2"></span>' + 
                                   '</td>'+ 
                                '<td class="span-8">'+ 
                                            '<label class="span-2 label">Bills Exists</label><span id="isBillExist" class="fieldText span-2"></span>' + 
                                   '</td>'+                                   
                '</tr>'+ 
                '<tr class="span-25">' + 
                        '<td class="span-8">'+ 
                                        '<label class="span-4 label">Status</label><span id="statusCd" class="fieldText span-2"></span>' + 
                            '</td>' +         
                            '<td class="span-7">'+ 
                                        '<label class="span-3 label">Trade Partner</label><span id="tradeP" class="fieldText span-2"></span>' + 
                            '</td>' + 
                                '<td class="span-9">'+ 
                                            '<label class="span-3 label">Txn Control#</label><span id="txnControlNo" class="fieldText span-2"></span>' + 
                                   '</td>'+                                   
                '</tr>'+ 
                '<tr class="span-25">' + 
                        '<td class="span-8">'+ 
                                        '<label class="span-4 label">Shippers Shipment Id</label><span id="shipperShipId" class="fieldText span-2"></span>' + 
                                   '</td>'+ 
                                '<td class="span-8">'+ 
                                            '<label class="span-3 label">Record Type</label>'+ 
                                            '<select id="recType">' + 
                                            '</select>' +                                             
                                   '</td>'+         
                                   '<td class="span-6"></td>'+ 
            '</tr>'+             
                        '</table>' + 
                          '</div>'         
                  ); 
        

        $('#ediId').change(function() 
        {        
        	 $('#lineDataDiv').hide(); 
        	 $('#resultdiv').remove(); 
        		getRecordType();                 
                if(isReqSent==false) 
                        { 
                           getEDIReqHeaderData(); 
                        } 
                
    }); 
        
         // div for "Search" and "Clear" buttons 
        $('div.searchTable').parent().parent().parent().children('tr:nth-child(5)').after( 
                        '<div id="showButtons">' +         
                        '<table>' + 
                        '<tr>' + 
                          '<td><input type="button" onclick="javascript:searchValue();" value="Search" name="search" id="search" class="buttonNoFloat"></td>' + 
                          '<td><input type="button" onclick="javascript:resetForm();" value="Clear" name="clear"  id="clear" class="buttonNoFloat"></td>' + 
                          '<td><input type="button" onclick="javascript:exitForm();" value="Exit" name="exit"  id="exit" class="buttonNoFloat"></td>' + 
                        '</tr>' + 
                          '</table>' + 
                          '</div>'         
                  ); 
          
          
         // hide CAS generated "Search" and "Clear" Button 
                $('div.searchTable').parent().parent().parent().children('tr:nth-child(5)').hide(); 
        
                 //shipment no predictive search                 
                 var url =        _context+'/cas/autocomplete.do?method=searchShpmntNoForEDI&searchType=375'; 
                 $('#shipNo').gatesAutocomplete({ 
                                source: url, 
                                //minLength: 7, 
                                formatItem: function(data) { 
                                        return data.shpmntNo; 
                                }, 
                                formatResult: function(data) { 
                                        return data.shpmntNo; 
                                }, 
                                select: function(data) { 
                                        $('#shipNo').val(data.shpmntNo); 
                                        $('#shipSeqNo').val(''); 
                                        $.ajax({						//select default seq num on select
                                        	async: false,
                                        	type : "POST",
                                        	url : _context + "/shipment/defaultShipmentSequenceNumberForEDI",
                                        	data : {
                                        		shipment_number:$('#shipNo').val(),
                                        		},
                                        		success : function(responseText){
                                        			shipmentSequenceNumber=responseText.data;
                                        			 $('#shipSeqNo').val(shipmentSequenceNumber); 
                                        		}
                                        });
                               
                                       
                                } 
                        }); 
                 //(shipment sequence no predictive search) 
                 //code to get filtered shipment sequence no for selected shipment No                                 
                  var url1 =        _context+'/cas/autocomplete.do'; 
                  $('#shipSeqNo').gatesAutocomplete({ 
                                 source: url1, 
                                 extraParams: {
         							method : "searchShpmntSeqNoForEDI",
         							searchType : "376",
         							parentSearch : function() {return $('#shipNo').val();}
         						},
                                 //minLength: 7, 
                                 formatItem: function(data) { 
                                         return data.sequenceNo; 
                                 }, 
                                 formatResult: function(data) { 
                                         return data.sequenceNo; 
                                 }, 
                                 select: function(data) { 
                                         $('#shipSeqNo').val(data.sequenceNo);                                                         
                                 } 
                 }); 

                $('#shipNo').val($('#in_shipment_no').val()); 
                $('#shipSeqNo').val($('#in_shipment_seq_no').val()); 
                $('#ediId').val($('#in_edi_id').val());                 
                
                $('#edi_process').attr("disabled","disabled"); 
                if ($('#temp_linedata').val() == 'ASSIGNED') 
                { 
                        $('#edi_process').removeAttr("disabled"); 
                } 
                if($('#selected_edi_id').val()!= null && $('#selected_edi_id').val()!= "ALL" && $('#selected_edi_id').val()!= "") { 
                        
                        var ajaxURL = _context+'/cas/autocomplete.do?method=searchEDIHeader&searchType=329&parentSearch=' + $('#selected_edi_id').val() +" - "+$('#versionNo').val(); 
                        $.getJSON(ajaxURL, function(json) { 
                                if(json.length !=0){ 
                                        $('#versionNo').text(json[0].versionNo);                                 
                                        $('#currRec').text(json[0].currRec); 
                                        $('#isBillExist').text(json[0].isBillExist); 
                                        $('#statusCd').text(json[0].statusCd);
                                        $('#tradeP').text(json[0].tradeP);
                                        $('#txnControlNo').text(json[0].txnControlNo); 
                                        $('#shipperShipId').text(json[0].shipperShipId); 
                                        if (json[0].statusCd == 'ASSIGNED') 
                                        { 
                                                $('#edi_process').removeAttr("disabled"); 
                                                $('#temp_linedata').val(json[0].statusCd); 
                                        }$('#temp_linedata').val(json[0].statusCd); 
                                }                                 
                          }); 
                } 
                
                //code for populating drop down from client side(different from cas generated drop downs so used hidden fields in SP as well) 
                if(!($('#temp_edi_id').val()=="ALL" || $('#temp_edi_id').val()== null || $('#temp_edi_id').val()=='')) 
                {                 
                         values =$('#temp_edi_id').val().split(','); 
                         for(var i=0;i<values.length;i++) 
                                { 
                                 $('#ediId').append($('<option></option>').val(values[i]).html(values[i])); 
                                 $('#in_edi_id').append($('<option></option>').val(values[i]).html(values[i])); 
                                }                         
                } 
                
                if(!( $('#temp_recType').val()== null || $('#temp_recType').val()=='')) 
                {                 
                         $('#recType').append($('<option></option>').val('ALL').html('ALL')); 
                         values =$('#temp_recType').val().split(',');                         
                         for(var i=0;i<values.length;i++) 
                                { 
                                 $('#recType').append($('<option></option>').val(values[i]).html(values[i])); 
                                 $('#in_record_type').append($('<option></option>').val(values[i]).html(values[i])); 
                                }                         
                } 
        
                $('#ediId').val($('#selected_edi_id').val()); 
                $('#in_edi_id').val($('#selected_edi_id').val()); 
                $('#recType').val($('#selected_rec_type').val()); 
                $('#in_record_type').val($('#selected_rec_type').val()); 
                
                $('#shipNo').click(function(){                         
                         removeErrorPointers();                 
                 }); 
                $('#shipSeqNo').click(function(){                         
                         removeErrorPointers();                 
                 }); 
                

            	//onFocus and blur on fields which are not cas build
            	 $('#shipNo').focus(function() {
            		 if($("#shipNo").val()=='ALL'){
            				$("#shipNo").val('');
            		 }
            		});			 
            	 $('#shipNo').blur(function(){
            		 if($("#shipNo").val()==''){
            				$("#shipNo").val('ALL');
            			}
              	});
            	 
            	 $('#shipSeqNo').focus(function() {
            		 if($("#shipSeqNo").val()=='ALL'){
            				$("#shipSeqNo").val('');
            		 }
            		});			 
            	 $('#shipSeqNo').blur(function(){
            		 if($("#shipSeqNo").val()==''){
            				$("#shipSeqNo").val('ALL');
            			}
              	});
                
                /*Permission shipment security*/
                enforceSecurityTitle(iseditransmissiondetailsDisplay);
                enforceSecurityDivAndButtons("displaydiv", iseditransmissiondetailsDisplay);
                enforceSecurityDivAndButtons("resultdiv", iseditransmissiondetailsDisplay);
                enforceSecurityDivAndButtons("lineDataDiv", iseditransmissiondetailsUpdate);
                enforceSecurityDivAndButtons("edi_process", iseditransmissiondetailsUpdate);    
                
              //when screen is called form EDI Shipment Search Screen
            	if(a!='null')
            		{
            			$('#in_shipment_no').val(a);
            			$('#shipNo').val($('#in_shipment_no').val());
            		}
            	if(b!='null')
            		{
            			$('#in_shipment_seq_no').val(b);
                        $('#shipSeqNo').val($('#in_shipment_seq_no').val()); 
                        $('#in_source').val('EDI');
                        if(a!='null')
            			fillEdiIdDropdown();
            			 $('#resultdiv').remove();
            		}
            	if(a=='null' && c!='null'){
        			$('#in_shipment_no').val(" ");
        			$('#shipNo').val($('#in_shipment_no').val());
        			$('#in_shipment_seq_no').val(" ");
                    $('#shipSeqNo').val($('#in_shipment_seq_no').val()); 
                    $('#in_source').val('EDI');
                    $('#ediId').html("<option value='"+c+"'>"+c+"</option>");
                    $('#ediId').val($('#in_edi_id').val());
        		}

            	$("#shipNo").keyup(function(event) {
            		if (event.keyCode == 13) {
            			$('#shipSeqNo').val('');
            			$('#shipSeqNo').attr('disabled', false);
            			fillEdiIdDropdown();
            		}
            	});
            	
            	$("#shipSeqNo").keyup(function(event) {
            		if (event.keyCode == 13) {
            			fillEdiIdDropdown();
            		}
            	});
           	 previouspage = document.URL;
           	 var menuCall=previouspage.lastIndexOf('fromMenu=');
           	 var ediCall=previouspage.lastIndexOf('src=');
           	 if (menuCall>= 0||$('#in_source').val()=='MENU') {
           		 $('#exit').hide();
           		 $('#in_source').val('MENU');
           	 }
           	 if(ediCall>0||$('#in_source').val()=='EDI')
           	 {
           		$('#exit').show();
           		$('#in_source').val('EDI');
           	 }
         	tabSequence('#ediLineDataSearchForm',true,true);
}); 




function fillEdiIdDropdown() 
{         

	var shipment_number = $("#shipNo").val();					//select default seq num on Enter
	var shipment_sequence_number = $("#shipSeqNo").val();
	
	/** Populating Shipment sequence number from database*/
	if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
		$.ajax({
			async: false,
			type : "POST",
			url : _context + "/shipment/defaultShipmentSequenceNumberForEDI",
			data : {				
				shipment_number :shipment_number,
			},
			success : function(responseText) {
				var shipmentSequenceNumber=responseText.data;
				shipment_sequence_number=shipmentSequenceNumber;
			}			
		});
	}
	$("#shipSeqNo").val(shipment_sequence_number);
	
        if( !($('#shipNo').val()=="ALL" || $('#shipNo').val()== null || $('#shipNo').val()=='') 
                        && !($('#shipSeqNo').val()=="ALL" || $('#shipSeqNo').val()== null || $('#shipSeqNo').val()=='')) 
        { 
        var ajaxURL = _context+'/cas/autocomplete.do?method=searchEdiIds&searchType=326&parentSearch=' + $('#shipNo').val()+ '|' +$('#shipSeqNo').val(); 
        $.getJSON(ajaxURL, function(json) {         
                
                if(json.length !=0){ 
                        $('#ediId option').remove();                         
                        for(var i=0;i<json.length;i++)         
                        {                 
                                var ediIdString = json[i].ediId; 
                                var ediIdStr = ediIdString.split(" - "); 
                                var ediId = ediIdStr[0]; 
                                var versionNo = ediIdStr[1]; 
                                var createDate = ediIdStr[2]; 
                                var newDate = reFormatDate(createDate); 
                                var newEdiString = ediId + " - "+versionNo+ " - "+newDate; 
                                $('#ediId').append($('<option></option>').val(newEdiString).html(newEdiString));         
                                temp.push(newEdiString);                                 
                        }         
                        if($('#temp_edi_id').val()==null || $('#temp_edi_id').val()=='ALL'){                                 
                                $('#temp_edi_id').val(temp); 
                        } 
                        getRecordType(); 
                        getEDIReqHeaderData(); 
                }
                else
                	{
                	$("#shipNo").validationEngine('showPrompt', 'EDI Id not found for Entered Shipment Number', 'error', true); 
                	resetForm2();
                	}
          }); 
        } 
        else{ 
                $("#shipNo").validationEngine('showPrompt', 'Shipment Number and Shipment Sequence Number both are mandatory', 'error', true); 
                
                return false; 
        } 
        return true;         
} 

function getRecordType() 
{         
        var ajaxURL = _context+'/cas/autocomplete.do?method=searchRecordType&searchType=328&parentSearch=' + $('#ediId').val(); 
        $.getJSON(ajaxURL, function(json) { 
                isReqSent = true; 
                $('#recType option').remove();         
                $('#recType').append($('<option></option>').val('ALL').html('ALL')); 
                if(json.length !=0){ 
                        isReqSent = false; 
                        
                        for(var i=0;i<json.length;i++)         
                        { 
                                 $('#recType').append($('<option></option>').val(json[i].recType).html(json[i].recType));         
                                 temp1.push(json[i].recType); 
                                
                        }         
                        if($('#temp_recType').val()==null || $('#temp_recType').val()=='ALL'){                                 
                                $('#temp_recType').val(temp1); 
                        } 
                }                 
          }); 
        
        return true; 
} 

function reFormatDate(createDate){ 
        var createDate1 = new Date(createDate); 
        
        var day = createDate1.getDate(); 
        if(eval(day<10)){ 
                day = '0'+day; 
        } 
        var month = eval(eval(createDate1.getMonth())+eval(1)); 
        if(eval(month<10)){ 
                month = '0'+month; 
        } 
        var year = createDate1.getFullYear(); 
        return month+"-"+day+"-"+year; 
} 

function getEDIReqHeaderData() 
{         
        var ajaxURL = _context+'/cas/autocomplete.do?method=searchEDIHeader&searchType=329&parentSearch=' + $('#ediId').val(); 
        $.getJSON(ajaxURL, function(json) {                 
                if(json.length !=0){                                 
                        $('#versionNo').text(json[0].versionNo);                                 
                        $('#currRec').text(json[0].currRec); 
                        $('#isBillExist').text(json[0].isBillExist); 
                        $('#statusCd').text(json[0].statusCd); 
                        $('#tradeP').text(json[0].tradeP); 
                        $('#txnControlNo').text(json[0].txnControlNo); 
                        $('#shipperShipId').text(json[0].shipperShipId);         
                        $('#recType').text(json[0].recType);                 
                        if (json[0].statusCd == 'ASSIGNED') 
                        { 
                                $('#edi_process').removeAttr("disabled"); 
                                $('#temp_linedata').val(json[0].statusCd);                                                                 
                        } 
                        $('#temp_linedata').val(json[0].statusCd); 
                } 
                
          }); 
        
        $('#search').focus(); 
        return true; 
} 

function searchValue() 
{                 
        $('#in_shipment_no').val($('#shipNo').val()); 
        //$('#in_shipment_seq_no').val($('#shipSeqNo').val()); 
        
        if($('#shipSeqNo').val()!=null && $('#shipSeqNo').val()!= 'ALL' && $('#shipSeqNo').val()!= '') 
        { 
                $('#in_shipment_seq_no').val($('#shipSeqNo').val()); 
        } 
        else 
        { 
                $('#in_shipment_seq_no').val(''); 
        }   
        if($('#shipNo').val()== null || $('#shipNo').val()== "ALL" || $('#shipSeqNo').val()==""|| $('#shipSeqNo').val()==null||$('#shipSeqNo').val()=='ALL') { 
        	
        	$("#shipNo").validationEngine('showPrompt', 'Shipment Number and Shipment Sequence Number both are mandatory', 'error', true); 
                return false;         
        }
        else
        {
        	//for 18175- locking
        	blockUI();
        	
        	var ediIdStr = $('#ediId').val();
        	$('#temp_edi_id').val(ediIdStr);
            var values = ediIdStr.split(" - "); 
            var ediId = values[0]; 
            var versionNo = values[1]; 
            $('#in_edi_id').val(ediId);         
            $('#in_version_no').val($('#versionNo').val());                 
            $('#selected_edi_id').val(ediIdStr);
            $('#in_current_rec').val($('#currRec').text());            
            $('#in_bill_exists').val($('#isBillExist').text());
            
            $('#in_record_type').val($('#recType').val()); 
            
            $('#selected_rec_type').val($('#recType').val());         
            if ($('#temp_linedata').val() == 'ASSIGNED') 
            {                 
                    $('#edi_process').removeAttr("disabled");                 
            } 
            postMethod('search',document.ediLineDataSearchForm.method); 
            
           //for 18175- locking//
            $.unblockUI();
            return true; 
        }
} 

function resetForm() 
{ 
        removeErrorPointers(); 
        $('#ediId option').remove(); 
         $('#ediId').val(''); 
         $('#in_edi_id').val(''); 
         $('#in_shipment_no').val('ALL'); 
         $('#shipNo').val('ALL'); 
         $('#in_shipment_seq_no').val('ALL'); 
         $('#shipSeqNo').val('ALL'); 
         $('#edi_process').attr("disabled","disabled"); 
         $('#recType').append($('<option></option>').val('ALL').html('ALL')); 
          clearHeaderFields(); 
         $('#lineDataDiv').hide(); 
          
} 

function exitForm() 
{ 
		 document.location.href = _context+"/cas/ediShipmentSearch.do";
} 


function removeErrorPointers() { 
        $('form[name="ediLineDataSearchForm"]').validationEngine('hideAll'); 
} 

function clearHeaderFields() 
{ 
        $('#resultdiv').remove(); 
        $('#versionNo').html('');                                 
        $('#currRec').html(''); 
        $('#isBillExist').html(''); 
        $('#statusCd').html(''); 
        $('#tradeP').html(''); 
        $('#txnControlNo').html(''); 
        $('#shipperShipId').html('');         
} 


function loadLineData(line) 
{ 
        var linevalues = line.split("|"); 
        var lineno = linevalues[0]; 
        var linedata = linevalues[1];         
        $('#linedataid').val(linedata);                 
        $('#lineDataDiv').show();         
} 

// to be called when no edi id is found
function resetForm2() 
{ 
        $('#ediId option').remove(); 
         $('#ediId').val(''); 
         $('#in_edi_id').val(''); 
         $('#edi_process').attr("disabled","disabled"); 
         $('#recType').append($('<option></option>').val('ALL').html('ALL')); 
          clearHeaderFields(); 
         $('#lineDataDiv').hide(); 
          
} 