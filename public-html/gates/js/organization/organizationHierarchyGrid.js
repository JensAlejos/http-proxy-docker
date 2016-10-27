		/*$.Autocompleter.defaults.mustMatch = true;
		$.Autocompleter.defaults.multipleSeparator = '~';
		$.Autocompleter.defaults.width = 420;
		$.Autocompleter.defaults.minChars = 2;
		$.Autocompleter.defaults.scroll = true;
		$.Autocompleter.defaults.scrollHeight = 300;
		$.Autocompleter.defaults.cacheLength = 1;*/

	function saveComment(){
    	
    }
	  function clearFormData(oForm) {
		  clearForm(oForm);
			var ele = document.getElementById("iframe");
		    		ele.style.display = "none";
		    var eles = document.getElementById("jqgrid");
		    		eles.style.display = "none";
		    var eles = document.getElementById("jqgrid2");
		    		eles.style.display = "none";
		    var eles = document.getElementById("jqgrid3");
		    		eles.style.display = "none";
		    var eles = document.getElementById("jqgrid4");
		    		eles.style.display = "none";
					    		
		} 
	  function showTable()
	  {
		  var ele = document.getElementById("iframe");
  			ele.style.display = "block";
  			var eles = document.getElementById("jqgrid");
    		eles.style.display = "block";
    		var eles = document.getElementById("jqgrid2");
    		eles.style.display = "block";
    		var eles = document.getElementById("jqgrid3");
    		eles.style.display = "block";
    		var eles = document.getElementById("jqgrid4");
    		eles.style.display = "block";
	  }

	  /**************************************************************************/
	$(function() {
		/**************************************************************************/
		var args;
		var aliasCommentLinkId;
		var subsidiaryCommentLinkId;
		var divisionCommentLinkId;
		var affiliateCommentLinkId;
		//ALIAS
		$('#alias').jqGrid({
			caption: 'Alias',
			url: _context+'/organization/hierarchy/loadGridData?typeCode=ALIAS',
			datatype : 'json',
			mtype : 'GET',
			postdata:['Rashmi'],
			colNames:['Id','OrgID', 'Subordinate Organization', 'Relationship','RelTypeCode','CommentId','Comments','ParentId'],
			colModel : [ 
			            {name:'id',index:'id', width:80,editable:false,editoptions:{readonly:true,size:10},hidden:true},
			            {name:'subordinateId',index:'subordinateId', width:80,edittype:'text',editable:true, editoptions:{defaultValue:$('#parentOrganizationId').val()},hidden:true},
			            {name:'subordinateName',index:'subordinateName', width:340, editable:true, editrules:{required:true}, 
			            	'edittype'    : 'custom',
							'editoptions' : {
												size:10,
												'custom_element' :  autocomplete_element,  
												'custom_value'   : autocomplete_value  
												/*dataEvents: [
										                      {  type: 'click',
										                         fn: function(e) {
										                        	 alert(this.value);
										                            $('input#organizationId').val(this.value);
										                         }
										                      }
										                   ]*/

											}
 				},
 					{name:'relationship',index:'relationship', width:130,editable:true, edittype:'text', editoptions:{defaultValue:'ALIAS'},hidden:true},
 					{name:'orgnRelationshipTypeCode',index:'orgnRelationshipTypeCode', width:130,editable:true, edittype:'text', editoptions:{defaultValue:'03'},hidden:true},
 					{name:'subordinateCommentId',index:'subordinateCommentId', width:130,edittype:'text',editable:true, hidden:true},
 					{name:'comments',index:'comments', width:80,editable:false, editoptions:{readonly:true,size:10}},
 					{name:'parentId',index:'parentId', width:80,edittype:'text',editable:true, editoptions:{defaultValue:$('#parentOrganizationId').val()},hidden:true}
 				 
 				
			],
			pager : '#aliasPager',
			rowNum : 10,
			rowList : [10,20,30],
			height: 100,
			sortname: 'id',
			sortorder: 'desc',
			viewrecords : true,
			gridview : true,
			multiselect: !_readonly,
			loadonce : false,
			editurl: _context+'/organization/hierarchy/addGridData', 
	        altRows:true,
	        altclass:'uiAltRowClass',
			jsonReader: {
				repeatitems: false, id: "0"
			},
			gridComplete: function(){
				var ids = jQuery("#alias").jqGrid('getDataIDs'); 
				for(var i=0;i < ids.length;i++){ 
					
					var cl = ids[i]; 
					be = ids[i];
					
				/** ****  ******* For Comment  ******   **** */
					
					//Get comment Id of child organization
					commentId = jQuery("#alias").jqGrid('getCell',be,'subordinateCommentId');
					commentIdSel="commentId_alias"+i;
					
					// Get subordinate organization id
					subordinateId = jQuery("#alias").jqGrid('getCell',be,'subordinateId');

					//Set image Link
					ce = "<div id=alias_comment"+i+">"
							+"<input type='hidden' value='"+commentId+"' id = "+commentIdSel+" />"
							+"<img id = 'commentParameters' class = 'delete' src='"+_context+"/resources/images/info_button_32_32.png' alt='search'  border='0' style='margin:0px; vertical-align:middle;'  />"; 
						    +"</div>";
         		 	//Set variable to be sent to jquery.comment.js
					args = {
							 entityType: 'ORGN',
							 entityId: subordinateId,
							 commentId:  commentIdSel,
							 displayCount: false,
							 viewOnly: false,
								};
					//Set id of comment div in var
					aliasCommentLinkId = "alias_comment"+i;
					
   			 	
					//copy value of image link into comment column(Hidden)
					jQuery("#alias").jqGrid('setRowData',ids[i],{comments:ce}); 
					
					//jQuery("#affiliate").jqGrid('setRowData',ids[i],{uniqueKey:be}); 
					//jQuery("#grid").jqGrid('setRowData',ids[i],{Org:be}); 
					
					// Calling comment js(jquery.comment.js)
					 $("#"+aliasCommentLinkId).comments(args);
					 
				/** ****  ******* Finish For Comment  ******   **** */
					 
				} 
			},
			loadComplete: function() {
                var grid = $('#alias');
                var ids = grid.getDataIDs();
                for (var i = 0; i < ids.length; i++) {
                	 //$('#comments').expandSubGridRow(ids[i]);
                     //$("#"+ids[i]).hide();
                }
            }, 
           
			ignoreCase: true
			

		});
		 
		$("#alias").jqGrid('navGrid','#aliasPager',
				{edit:false,add:!_readonly,del:!_readonly,search:false,refresh:false},//options
				{closeAfterAdd :true },//edit options
		        { //add options
					width:420,
					closeAfterAdd : true,
					closeOnEscape: true,
					afterSubmit : function(response, postdata) 
					{ 
						var result = eval('(' + response.responseText + ')');
						var messages = result.messages;
						var titleMsg  = 'Success';
						if(messages!=null){
							titleMsg = 'Failure';
							for ( var i = 0; i < messages.length; i++) {
	 							$("#dialog").text(messages[i]);
							}
						}else{
							$("#dialog").text(result.message);
						}
						
						if(titleMsg == 'Failure'){
							$("#dialog").dialog( 
									{	title: titleMsg,
										modal: true,
										buttons: {"Ok": function()  {
											$(this).dialog("close");} 
										}
									});
						}
					
					// only used for adding new records
				    	
				    	
						return [true, ''];
					}
					
					
			},
		        {
				//delete options
				url:_context+'/organization/hierarchy/multipleDelete?typeCode=ALIAS'
		        }, 
				{ 
		        	//search options
			    	sopt:['eq', 'ne', 'lt', 'gt', 'cn', 'bw', 'ew'],
			        closeOnEscape: true, 
			        multipleSearch: true, 
			        closeAfterSearch: true }
		);
		
 		/**************************************************************************/		
		//DIVISION
		$('#division').jqGrid({
			caption: 'Division',
			url: _context+'/organization/hierarchy/loadGridData?typeCode=DIVISION',
			datatype : 'json',
			mtype : 'GET',
			postdata:['Rashmi'],
			colNames:['Id','OrgID', 'Subordinate Organization', 'Relationship','RelTypeCode','CommentId','Comments','ParentId'],
			colModel : [ 
			            {name:'id',index:'id', width:80,editable:false,editoptions:{readonly:true,size:10},hidden:true},
			            {name:'subordinateId',index:'subordinateId', width:80,edittype:'text',editable:true, editoptions:{defaultValue:$('#parentOrganizationId').val()},hidden:true},
			            {name:'subordinateName',index:'subordinateName', width:340, editable:true, editrules:{required:true}, 
						'edittype'    : 'custom',
						'editoptions' : {
											size:10,
											'custom_element' :  autocomplete_element,  
											'custom_value'   : autocomplete_value  
											/*dataEvents: [
									                      {  type: 'click',
									                         fn: function(e) {
									                        	 alert(this.value);
									                            $('input#organizationId').val(this.value);
									                         }
									                      }
									                   ]*/

										}  
 				},
 					{name:'relationship',index:'relationship', width:130,editable:true, edittype:'text', editoptions:{defaultValue:'DIVISION'},hidden:true},
 					{name:'orgnRelationshipTypeCode',index:'orgnRelationshipTypeCode', width:130,editable:true, edittype:'text', editoptions:{defaultValue:'02'},hidden:true},
 					{name:'subordinateCommentId',index:'subordinateCommentId', width:130,edittype:'text',editable:true, hidden:true},
 					{name:'comments',index:'comments', width:80,editable:false, editoptions:{readonly:true,size:10}},
 					{name:'parentId',index:'parentId', width:80,edittype:'text',editable:true, editoptions:{defaultValue:$('#parentOrganizationId').val()},hidden:true}
 				 
 				
			],
			pager : '#divisionPager',
			rowNum : 10,
			rowList : [10,20,30],
			height: 100,
			sortname: 'id',
			sortorder: 'desc',
			viewrecords : true,
			gridview : true,
			multiselect: !_readonly,
			loadonce : false,
			editurl: _context+'/organization/hierarchy/addGridData', 
	        altRows:true,
	        altclass:'uiAltRowClass',
			jsonReader: {
				repeatitems: false, id: "0"
			},
			gridComplete: function(){
				var ids = jQuery("#division").jqGrid('getDataIDs'); 
				for(var i=0;i < ids.length;i++){ 
					var cl = ids[i]; 
					be = ids[i];
					
					/** ****  ******* For Comment  ******   **** */
					
					//Get comment Id of child organization
					commentId = jQuery("#division").jqGrid('getCell',be,'subordinateCommentId');
					commentIdSel="commentId_division"+i;
					// Get subordinate organization id
					subordinateId = jQuery("#division").jqGrid('getCell',be,'subordinateId');
					
					//Set image Link
					ce = "<div id=division_comment"+i+">"
							+"<input type='hidden' value='"+commentId+"' id = "+commentIdSel+" />"
							+"<img id = 'commentParameters' class = 'delete' src='"+_context+"/resources/images/info_button_32_32.png' alt='search'  border='0' style='margin:0px; vertical-align:middle;'  />"; 
						    +"</div>";
						    
         		 	//Set variable to be sent to jquery.comment.js
					args = {
							 entityType: 'ORGN',
							 entityId: subordinateId,
							 commentId:  commentIdSel,
							 displayCount: false,
							 viewOnly: false,
								};
					//Set id of comment div in var
					divisionCommentLinkId = "division_comment"+i;
					
					jQuery("#division").jqGrid('setRowData',ids[i],{comments:ce}); 
					
					
					// Calling comment js(jquery.comment.js)
					 $("#"+divisionCommentLinkId).comments(args);
					 
				/** ****  ******* Finish For Comment  ******   **** */
					 
				} 
			},
			loadComplete: function() {
                var grid = $('#division');
                var ids = grid.getDataIDs();
                for (var i = 0; i < ids.length; i++) {
                	 //$('#comments').expandSubGridRow(ids[i]);
                     //$("#"+ids[i]).hide();
                }
            }, 

			ignoreCase: true
		});
		
		$("#division").jqGrid('navGrid','#divisionPager',
				{edit:false,add:!_readonly,del:!_readonly,search:false,refresh:false},//options
				{closeAfterAdd :true },//edit options
		        { //add options
					width:420,
					closeAfterAdd : true,
					closeOnEscape: true,
					afterSubmit : function(response, postdata) 
					{ 
						var result = eval('(' + response.responseText + ')');
						var messages = result.messages;
						var titleMsg  = 'Success';
						if(messages!=null){
							titleMsg = 'Failure';
							for ( var i = 0; i < messages.length; i++) {
	 							$("#dialog").text(messages[i]);
							}
						}else{
							$("#dialog").text(result.message);
						}
						if(titleMsg == 'Failure'){
							$("#dialog").dialog( 
								{	title: titleMsg,
									modal: true,
									buttons: {"Ok": function()  {
										$(this).dialog("close");} 
									}
								});
						}
					// only used for adding new records
				    	
				    	
						return [true, ''];
					}
					
					
			},
		        {
				//delete options
				url:_context+'/organization/hierarchy/multipleDelete?typeCode=DIVISION'
		        }, 
				{ 
		        	//search options
			    	sopt:['eq', 'ne', 'lt', 'gt', 'cn', 'bw', 'ew'],
			        closeOnEscape: true, 
			        multipleSearch: true, 
			        closeAfterSearch: true }
		);
		/**************************************************************************/		
		//SUBSIDIARY
		$('#subsidiary').jqGrid({
			caption: 'Subsidiary',
			url: _context+'/organization/hierarchy/loadGridData?typeCode=SUBSIDIARY',
			datatype : 'json',
			mtype : 'GET',
			postdata:['Rashmi'],
			colNames:['Id','OrgID', 'Subordinate Organization', 'Relationship','RelTypeCode','CommentId','Comments','ParentId'],
			colModel : [ 
			            {name:'id',index:'id', width:80,editable:false,editoptions:{readonly:true,size:10},hidden:true},
			            {name:'subordinateId',index:'subordinateId', width:80,edittype:'text',editable:true, editoptions:{defaultValue:$('#parentOrganizationId').val()},hidden:true},
			            {name:'subordinateName',index:'subordinateName', width:340, editable:true, editrules:{required:true}, 
						'edittype'    : 'custom',
						'editoptions' : {
											size:10,
											'custom_element' :  autocomplete_element,  
											'custom_value'   : autocomplete_value  
											/*dataEvents: [
									                      {  type: 'click',
									                         fn: function(e) {
									                        	 alert(this.value);
									                            $('input#organizationId').val(this.value);
									                         }
									                      }
									                   ]*/

										}  
 				},
 					{name:'relationship',index:'relationship', width:130,editable:true, edittype:'text', editoptions:{defaultValue:'SUBSIDIARY'},hidden:true},
 					{name:'orgnRelationshipTypeCode',index:'orgnRelationshipTypeCode', width:130,editable:true, edittype:'text', editoptions:{defaultValue:'01'},hidden:true},
 					{name:'subordinateCommentId',index:'subordinateCommentId', width:130,edittype:'text',editable:true, hidden:true},
 					{name:'comments',index:'comments', width:80,editable:false, editoptions:{readonly:true,size:10}},
 					{name:'parentId',index:'parentId', width:80,edittype:'text',editable:true, editoptions:{defaultValue:$('#parentOrganizationId').val()},hidden:true}
 				 
 				
			],
			pager : '#subsidiaryPager',
			rowNum : 10,
			rowList : [10,20,30],
			height: 100,
			sortname: 'id',
			sortorder: 'desc',
			viewrecords : true,
			gridview : true,
			multiselect: !_readonly,
			loadonce : false,
			editurl: _context+'/organization/hierarchy/addGridData', 
	        altRows:true,
	        altclass:'uiAltRowClass',
			jsonReader: {
				repeatitems: false, id: "0"
			},
			gridComplete: function(){
				var ids = jQuery("#subsidiary").jqGrid('getDataIDs'); 
				for(var i=0;i < ids.length;i++){ 
					var cl = ids[i]; 
					be = ids[i];
					
			/**		*******  ******* For Comment  *******   *******   **/
					
					//Get comment Id of child organization
					commentId = jQuery("#subsidiary").jqGrid('getCell',be,'subordinateCommentId');
					commentIdSel="commentId_subsidiary"+i;
					// Get subordinate organization id
					subordinateId = jQuery("#subsidiary").jqGrid('getCell',be,'subordinateId');

					//Set image Link
					ce = "<div id=subsidiary_comment"+i+">"
							+"<input type='hidden' value='"+commentId+"' id = "+commentIdSel+" />"
							+"<img id = 'commentParameters' class = 'delete' src='"+_context+"/resources/images/info_button_32_32.png' alt='search'  border='0' style='margin:0px; vertical-align:middle;'  />"; 
						    +"</div>";
         		 	//Set variable to be sent to jquery.comment.js
					args = {
							 entityType: 'ORGN',
							 entityId: subordinateId,
							 commentId:  commentIdSel,
							 displayCount: false,
							 viewOnly: false,
								};
					//Set id of comment div in var
					subsidiaryCommentLinkId = "subsidiary_comment"+i;
					
   			 	
					//copy value of image link into comment column(Hidden)
					jQuery("#subsidiary").jqGrid('setRowData',ids[i],{comments:ce}); 
					
					// Calling comment js(jquery.comment.js)
					 $("#"+subsidiaryCommentLinkId).comments(args);
					 
				/** ****  ******* Finish For Comment  ******   **** */

				} 
			},
			loadComplete: function() {
                var grid = $('#subsidiary');
                var ids = grid.getDataIDs();
                for (var i = 0; i < ids.length; i++) {
                	 //$('#comments').expandSubGridRow(ids[i]);
                     //$("#"+ids[i]).hide();
                }
            }, 

			ignoreCase: true
		});
		
		$("#subsidiary").jqGrid('navGrid','#subsidiaryPager',
				{edit:false,add:!_readonly,del:!_readonly,search:false,refresh:false},//options
				{closeAfterAdd :true },//edit options
		        { //add options
					width:420,
					closeAfterAdd : true,
					closeOnEscape: true,
					afterSubmit : function(response, postdata) 
					{ 
						var result = eval('(' + response.responseText + ')');
						var messages = result.messages;
						var titleMsg  = 'Success';
						if(messages!=null){
							titleMsg = 'Failure';
							for ( var i = 0; i < messages.length; i++) {
	 							$("#dialog").text(messages[i]);
							}
						}else{
							$("#dialog").text(result.message);
						}
						if(titleMsg == 'Failure'){
							$("#dialog").dialog( 
								{	title: titleMsg,
									modal: true,
									buttons: {"Ok": function()  {
										$(this).dialog("close");} 
									}
								});
						}
					// only used for adding new records
				    	
				    	
						return [true, ''];
					}
					
					
			},
		        {
				//delete options
				url:_context+'/organization/hierarchy/multipleDelete?typeCode=SUBSIDIARY'
		        }, 
				{ 
		        	//search options
			    	sopt:['eq', 'ne', 'lt', 'gt', 'cn', 'bw', 'ew'],
			        closeOnEscape: true, 
			        multipleSearch: true, 
			        closeAfterSearch: true }
		);
		/**************************************************************************/		
		//AFFILIATE
		$('#affiliate').jqGrid({
			caption: 'Affiliate',
			url: _context+'/organization/hierarchy/loadGridData?typeCode=AFFILIATE',
			datatype : 'json',
			mtype : 'GET',
			postdata:['Rashmi'],
			colNames:['Id','OrgID', 'Subordinate Organization', 'Relationship','RelTypeCode','CommentId','Comments','ParentId'],
			colModel : [ 
			            {name:'id',index:'id', width:80,editable:false,editoptions:{readonly:true,size:10},hidden:true},
			            {name:'subordinateId',index:'subordinateId', width:80,edittype:'text',editable:true, editoptions:{defaultValue:$('#parentOrganizationId').val()},hidden:true},
			            {name:'subordinateName',index:'subordinateName', width:340, editable:true, editrules:{required:true}, 
						'edittype'    : 'custom',
						'editoptions' : {
											size:10,
											'custom_element' :  autocomplete_element,  
											'custom_value'   : autocomplete_value  
											/*dataEvents: [
									                      {  type: 'click',
									                         fn: function(e) {
									                        	 alert(this.value);
									                            $('input#organizationId').val(this.value);
									                         }
									                      }
									                   ]*/

										}  
 				},
 					{name:'relationship',index:'relationship', width:130,editable:true, edittype:'text', editoptions:{defaultValue:'AFFILIATE'},hidden:true},
 					{name:'orgnRelationshipTypeCode',index:'orgnRelationshipTypeCode', width:130,editable:true, edittype:'text', editoptions:{defaultValue:'04'},hidden:true},
 					{name:'subordinateCommentId',index:'subordinateCommentId', width:130,edittype:'text',editable:true, hidden:true},
 					{name:'comments',index:'comments', width:80,editable:false, editoptions:{readonly:true,size:10}},
 					{name:'parentId',index:'parentId', width:80,edittype:'text',editable:true, editoptions:{defaultValue:$('#parentOrganizationId').val()},hidden:true}
 				 
 				
			],
			pager : '#affiliatePager',
			rowNum : 10,
			rowList : [10,20,30],
			height: 100,
			sortname: 'id',
			sortorder: 'desc',
			viewrecords : true,
			gridview : true,
			multiselect: !_readonly,
			loadonce : false,
			editurl: _context+'/organization/hierarchy/addGridData', 
	        altRows:true,
	        altclass:'uiAltRowClass',
			jsonReader: {
				repeatitems: false, id: "0"
			},
			gridComplete: function(){
				var ids = jQuery("#affiliate").jqGrid('getDataIDs'); 
				for(var i=0;i < ids.length;i++){ 
					var cl = ids[i]; 
					be = ids[i];
					
				/**		*******  ******* For Comment  *******   *******   **/	
					
					//Get comment Id of child organization
					commentId = jQuery("#affiliate").jqGrid('getCell',be,'subordinateCommentId');
					commentIdSel="commentId_affiliate"+i;
					// Get subordinate organization id
					subordinateId = jQuery("#affiliate").jqGrid('getCell',be,'subordinateId');

					//Set image Link
					ce = "<div id=affiliate_comment"+i+">"
							+"<input type='hidden' value='"+commentId+"' id = "+commentIdSel+" />"
							+"<img id = 'commentParameters' class = 'delete' src='"+_context+"/resources/images/info_button_32_32.png' alt='search'  border='0' style='margin:0px; vertical-align:middle;'  />"; 
						    +"</div>";
         		 	//Set variable to be sent to jquery.comment.js
					args = {
							 entityType: 'ORGN',
							 entityId: subordinateId,
							 commentId:  commentIdSel,
							 displayCount: false,
							 viewOnly: false,
								};
					//Set id of comment div in var
					affiliateCommentLinkId = "affiliate_comment"+i;
					
   			 	
					//copy value of image link into comment column(Hidden)
					jQuery("#affiliate").jqGrid('setRowData',ids[i],{comments:ce}); 
					
					// Calling comment js(jquery.comment.js)					
					$("#"+affiliateCommentLinkId).comments(args);
					
				/** ****  ******* Finish For Comment  ******   **** */	
				
					
				} 
			},
			loadComplete: function() {
                var grid = $('#affiliate');
                var ids = grid.getDataIDs();
                for (var i = 0; i < ids.length; i++) {
                	 //$('#comments').expandSubGridRow(ids[i]);
                     //$("#"+ids[i]).hide();
                }
            }, 

			ignoreCase: true
		});
		
		$("#affiliate").jqGrid('navGrid','#affiliatePager',
				{edit:false,add:!_readonly,del:!_readonly,search:false,refresh:false},//options
				{closeAfterAdd :true },//edit options
		        { //add options
					width:420,
					closeAfterAdd : true,
					closeOnEscape: true,
					afterSubmit : function(response, postdata) 
					{ 
						var result = eval('(' + response.responseText + ')');
						var messages = result.messages;
						var titleMsg  = 'Success';
						if(messages!=null){
							titleMsg = 'Failure';
							for ( var i = 0; i < messages.length; i++) {
	 							$("#dialog").text(messages[i]);
							}
						}else{
							$("#dialog").text(result.message);
						}
						if(titleMsg == 'Failure'){
							$("#dialog").dialog( 
								{	title: titleMsg,
									modal: true,
									buttons: {"Ok": function()  {
										$(this).dialog("close");} 
									}
								});
						}
					// only used for adding new records
				    	
				    	
						return [true, ''];
					}
					
					
			},
		        {
				//delete options
				url:_context+'/organization/hierarchy/multipleDelete?typeCode=AFFILIATE'
		        }, 
				{ 
		        	//search options
			    	sopt:['eq', 'ne', 'lt', 'gt', 'cn', 'bw', 'ew'],
			        closeOnEscape: true, 
			        multipleSearch: true, 
			        closeAfterSearch: true }
		);
			
		

	});
	$("#affiliate").click(function(e) {
	    var row = jQuery(e.target).parent();
	    value= row.attr("id");
	});
	$("#alias").click(function(e) {
	    var row = jQuery(e.target).parent();
	    value= row.attr("id");
	    alert(value);
	});
	$("#division").click(function(e) {
	    var row = jQuery(e.target).parent();
	    value= row.attr("id");
	});
 		/**************************************************************************/		
 		
 	

    var onrowclick = function() {
    ("#Grid1").click($("#showgrid").load('/Names/Friends/satish/' +  value));
    };

	/**************************************************************************/	
 	function autocomplete_element(value, options) {
 		  // creating input element
 		  var $ac = $('<input type="text" size="38"/>');
 		  // setting value to the one passed from jqGrid
 		  $ac.val(value);
 		  // creating autocomplete
 		 var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';
 		  $ac.gatesAutocomplete({
 				source: url,
 				formatItem: function(data) {
 					return data.name + " (id: " + data.id + ")";
 				},
 				formatResult: function(data) {
 					return data.name ;//+ "-" + data.code;
 				},
 				select: function(data) {
 					//$('#parentOrganizationId').val(data.id);
 					//$('#parentOrganizationName').val(data.name);
 					$('input#subordinateId').val(data.id);
 					$('input#subordinateCommentId').val(data.commentId);
 					$ac.val(data.name + "-" + data.code);
 					
 				}
 			});
 		  
 		  // returning element back to jqGrid
 		  return $ac;
 		}
 	
 		function autocomplete_value(elem, op, value) {
 		  if (op == "set") {
 		    $(elem).val(value);
 		  }
 		  return $(elem).val();
 		}

/**************************************************************************/
 	

 	function myelem (value, options) {
 		  var el = document.createElement("input");
 		  el.type="text";
 		  el.value = value;
 		  return el;
 		}
 		 
 		function myvalue(elem, operation, value) {
 		    if(operation === 'get') {
 		       return $(elem).find("input").val();
 		    } else if(operation === 'set') {
 		       $('input',elem).val(value);
 		    }
 		}

	

/*************************************************************************/



 var flag=0;  
  $(function(){
	   
		// Dialog Link
		/*$('#org_save').click(function(){
			flag = 1;
			$('#org_auth_party').dialog('open');
			return false;
		});*/
	   // Dialog			
		$('#org_auth_party').dialog({
			autoOpen: false,
			width: 510,
			modal: true
		});
	   
		// Dialog Link 
		//changes made
		$('#org_ap_workflow_link').click(function(){
			$('#org_auth_party').dialog("close"); 
			flag=2;
			$('#org_workflow').dialog('open');
			//$('#bg_ap_ok').dialog('open');
			return false;
		});
		
		// Dialog Link		
		/*$('#org_workflow_link').click(function(){
			flag=2;
			$('#org_workflow').dialog('open');
			return false;
		});*/
		// Dialog		
		$('#org_workflow').dialog({
			autoOpen: false,
			width: 510,
			modal: true,
		});
		
		// Dialog Link		
		$('#org_comment_link').click(function(){
			flag=3;
			$('#org_comments').dialog('open');
			return false;
		});
		// Dialog			
		$('#org_comments').dialog({
			autoOpen: false,
			width: 800,
			modal: true
		});
		
		//Dialog Close
		$('#dialog_close').click(function(){
			flag=0;
			$('#org_auth_party').dialog("close"); 
			return false;
		});
		//Dialog Close
		$('#dialog_close1').click(function(){
			flag=0;
			$('#org_comments').dialog("close"); 
			return false;
		});
		//Dialog Close
		$('#dialog_close2').click(function(){
			flag=0;
			$('#org_comments').dialog("close"); 
			return false;
		});
		//Dialog Close
		$('#workflow_close').click(function(){
			flag=0;
			$('#org_workflow').dialog("close"); 
			return false;
		});
});

  function openCommentPopup(commentId){
	  var actionUrl = _context + "/comments/?entityType=ORGN&commentId="+commentId;
	  var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	  window.open(actionUrl, 'Comments', windowStyle);
  }
  function save() {
	   document.getElementById('bg_ap_ok').style.display = 'block';
  }
 /* function cancel() {
	   document.getElementById('bg_ap_ok').style.display = 'none';
  }*/

	shortcut.add("Ctrl+S",function() {
		if(flag==0)
		{			
			$('#org_save').click();
		}
		else if(flag==1)
		{
			save();
			$('#org_ap_workflow_link').click();
		}
		else if(flag==3)
		{
			saveComment();
			$('#dialog_close1').click();
		}
	});		
	shortcut.add("Ctrl+D",function() {
		if(flag==0)
		{
			cancel();
			$('#org_workflow_link').click();
		}
		else if(flag==1)
		{
			$('#dialog_close').click();
		}
		else if(flag==3)
		{
			$('#dialog_close2').click();
		}
	});
	
	shortcut.add("esc",function() {
		if(flag==0)
		{
			cancel();
			$('#org_workflow_link').click();
		}
		else if(flag==1)
		{
			$('#dialog_close').click();
		}
		else if(flag==2)
		{
			$('#workflow_close').click();
		}
		else if(flag==3)
		{
			$('#dialog_close1').click();
		}
		/*else if(flag==4)
		{
			$('#history_close').click();
		}
		else if(flag==5)
		{
			$('#compare_close').click();
		}*/
	});
