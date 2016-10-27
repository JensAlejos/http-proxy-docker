$(document).ready(function() {
	
	elRTE.prototype.options.panels.web2pyPanel = [ 'bold', 'italic',
		                                   			'underline', 'forecolor', 'hilitecolor', 'justifyleft',
		                                   			'justifyright', 'justifycenter', 'justifyfull', 'formatblock',
		                                   			'fontsize', 'fontname', 'insertorderedlist', 'insertunorderedlist',
		                                   			'link', 'image', ];

	elRTE.prototype.options.toolbars.web2pyToolbar = [ 'web2pyPanel', 'tables' ];
	   	
	
	$("#kickerTemplatesDivDialog").dialog({
		title: 'Alert Email Templates',
		autoOpen: false, 
		autoResize : true, 
		minHeight: 0, 
		modal: true, 
		width: 850,
		buttons : [ {
			text : "Exit",
			click : function() {
				$(this).dialog("close");
			}
		}, {
			text : "Send",
			click : function() {
			    var myGrid = $('#sendKickerGrid');
			    var selRowId = myGrid.jqGrid ('getGridParam', 'selrow');
			    if (null == selRowId) {
			    	alert('Please select a template');
			    	return;
			    }
			    var templateId = myGrid.jqGrid ('getCell', selRowId, 'templateId');
				applyAndSendKicker(templateId);
			}
		}]
	});
	
	$("#sendKickerDivDialog-isHtml").val('false'); // initial state for SendEmail overlay
	
	$("#sendKickerDivDialog").dialog({ // initializing overlay for SendEmail
		title : 'Send Alert Email',
		autoOpen : false,
		autoResize : true,
		minHeight : 0,
		modal : true,
		width : 1024,
		buttons : {
			Exit : function() {
				$(this).dialog("close");
			},
			Send : function() {
				console.log('Sending alert .. isHtml?' + $('#sendKickerDivDialog-isHtml').val());
				blockUI();
				var urlStr = _context +"/createdispatch/sendKicker";
				var data = {
					emailBody : ($('#sendKickerDivDialog-isHtml').val() == 'true') ? $('#sendKickerDivDialog-emailBody').elrte('val'):$('#sendKickerDivDialog-emailBody').val() ,
					emailTo : $('#sendKickerDivDialog-emailTo').val(),
					emailCc : $('#sendKickerDivDialog-emailCc').val(),
					emailSubject : $('#sendKickerDivDialog-emailSubject').val(),
					//dispatchRequestId : $('#sendKickerDivDialog-dispatchRequestId').val(),
					dispatchRequestId : $('#dispatchRequestId').val(),
					templateId : $('#sendKickerDivDialog-templateId').val()
				}
				$.ajax({
					type: "POST",
					url: urlStr,
					data: data,
					dataType:'json',
					success: function(responseData){
						console.log('Sending alert ... Success');
						$.unblockUI();
						alert("Email Alert sent successfully");
						$(this).dialog("close");
					},
					error: function(jqXHR,textStatus,errorThrown) {
						console.log('Sending alert ... Error');
						$.unblockUI();
						alert("Email Alert could not be sent");
						$(this).dialog("close");
					}
				});
			}
		}
	});
	
	//For displaying page enclosed in accordion Tabs
	$("#conditionAccordians1").accordion({
		autoHeight: false,
		active: false,
		collapsible: true,
		disabled: true
	});
	
	jQuery('#conditionAccordians1 h3.ui-accordion-header').click(function(){
		jQuery(this).next().slideToggle();
		jQuery(this).toggleClass('ui-state-default').toggleClass('ui-state-active')
		.toggleClass('ui-corner-all').toggleClass('ui-corner-top');
		jQuery(this).children('span').toggleClass('ui-icon-triangle-1-e').toggleClass('ui-icon-triangle-1-s');
	});
	
	$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all').hover(function(mouseenterEvent){
			$(this).addClass('ui-state-hover');
		},
		  function(mouseleaveEvent){
			$(this).removeClass('ui-state-hover');
		});
});

$(document).ready(function() {
	//For displaying page enclosed in accordion Tabs
	$("#conditionAccordians2").accordion({
		autoHeight: false,
		active: false,
		collapsible: true,
		disabled: true
	});
	
	jQuery('#conditionAccordians2 h3.ui-accordion-header').click(function(){
		jQuery(this).next().slideToggle();
		jQuery(this).toggleClass('ui-state-default').toggleClass('ui-state-active')
		.toggleClass('ui-corner-all').toggleClass('ui-corner-top');
		jQuery(this).children('span').toggleClass('ui-icon-triangle-1-e').toggleClass('ui-icon-triangle-1-s');
	});
	
	$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all').hover(function(mouseenterEvent){
			$(this).addClass('ui-state-hover');
		},
		  function(mouseleaveEvent){
			$(this).removeClass('ui-state-hover');
		});
});
$(document).ready(function() {
	//For displaying page enclosed in accordion Tabs
	$("#conditionAccordians3").accordion({
		autoHeight: false,
		active: false,
		collapsible: true,
		disabled: true
	});
	
	jQuery('#conditionAccordians3 h3.ui-accordion-header').click(function(){
		jQuery(this).next().slideToggle();
		jQuery(this).toggleClass('ui-state-default').toggleClass('ui-state-active')
		.toggleClass('ui-corner-all').toggleClass('ui-corner-top');
		jQuery(this).children('span').toggleClass('ui-icon-triangle-1-e').toggleClass('ui-icon-triangle-1-s');
	});
	
	$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all').hover(function(mouseenterEvent){
			$(this).addClass('ui-state-hover');
		},
		  function(mouseleaveEvent){
			$(this).removeClass('ui-state-hover');
		});
});
$(document).ready(function() {
	//For displaying page enclosed in accordion Tabs
	$("#conditionAccordians4").accordion({
		autoHeight: false,
		active: false,
		collapsible: true,
		disabled: true
	});
	
	jQuery('#conditionAccordians4 h3.ui-accordion-header').click(function(){
		jQuery(this).next().slideToggle();
		jQuery(this).toggleClass('ui-state-default').toggleClass('ui-state-active')
		.toggleClass('ui-corner-all').toggleClass('ui-corner-top');
		jQuery(this).children('span').toggleClass('ui-icon-triangle-1-e').toggleClass('ui-icon-triangle-1-s');
	});
	
	$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all').hover(function(mouseenterEvent){
			$(this).addClass('ui-state-hover');
		},
		  function(mouseleaveEvent){
			$(this).removeClass('ui-state-hover');
		});
});
$(document).ready(function() {
	//For displaying page enclosed in accordion Tabs
	$("#conditionAccordians5").accordion({
		autoHeight: false,
		active: false,
		collapsible: true,
		disabled: true
	});
	
	jQuery('#conditionAccordians5 h3.ui-accordion-header').click(function(){
		jQuery(this).next().slideToggle();
		jQuery(this).toggleClass('ui-state-default').toggleClass('ui-state-active')
		.toggleClass('ui-corner-all').toggleClass('ui-corner-top');
		jQuery(this).children('span').toggleClass('ui-icon-triangle-1-e').toggleClass('ui-icon-triangle-1-s');
	});
	
	$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all').hover(function(mouseenterEvent){
			$(this).addClass('ui-state-hover');
		},
		  function(mouseleaveEvent){
			$(this).removeClass('ui-state-hover');
		});
});