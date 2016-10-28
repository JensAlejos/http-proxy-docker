function blockUI(opts){	
	console.log('blockUI called' +  Date.now());

console.log('mypromise called' +  Date.now());
var mypromise = $.ajax({
		async: true,
		type : "POST",
		url :  "/gates/shipment/populateShipment",
		data : {
			shipment_number : '4270651',
			shipment_sequence_number : '000',
			shipment_correction_number : '000'
		},
		success : function(responseText) {
			console.log('success called' +  Date.now());
			//displayShipmentDummy();
		},
		error : function(responseText) {

		}
	});

console.log('mypromise:' +  mypromise);	

	var myOpts = { 
		message: $('<div class="span-1"><img src="/gates/resources/images/loading.gif"></div>'+
				'<div class="span-4"><strong>Please wait.<br>Processing ...</strong></div>'), 
		css: {width:'22%',border:'3px solid #6E89DD',backgroundColor:'#EEF0FC',padding:'3px',textAlign:	'left'},
		overlayCSS:  {
			backgroundColor: '#FFFFFF',
			opacity: 0.2,
			cursor: 'wait' },
		fadeIn:0,
		fadeOut:0
		};
	
	var fullOpts = $.extend({}, myOpts, opts || {});	
	$.blockUI(fullOpts);
}

function blockUISetup() {
	$(document).ready(function() {
		var $message = $('#blockUIDIV'); //located in templates
		$(window).bind('beforeunload', function(event) {
			//console.log('window.beforeunload called()');
			blockUI({message:$message,fadeIn:0,fadeOut:0});
			//console.log('after window.beforeunload call');
			return null;			
		});
		//console.log('blockUISetup() window.onbeforeunload set');
	});	
}

$(document).ready(function(){
$(window).bind('resize', function () { 

	 var  overlayDivs = $('.ui-dialog div:visible');
	 for(var i=0;i< overlayDivs.length;i++){
	if($($($('.ui-dialog div:visible')[i])).hasClass('ui-dialog-content') && $($($('.ui-dialog div:visible')[i]).parent()).hasClass('ui-dialog')){
		if($(window).width()<950){
		if(($($($('.ui-dialog div:visible')[i]).parent()).outerWidth()+$($($('.ui-dialog div:visible')[i]).parent()).position().left)>$(window).width()){
			var x = $(window).width()-$($($('.ui-dialog div:visible')[i]).parent()).outerWidth();
			var y = $($($('.ui-dialog div:visible')[i]).parent()).position().top - jQuery(document).scrollTop();
			if(x<0){
				$('#'+$($($('.ui-dialog div:visible')[i])).attr('id')).dialog({
			        position: {
						at: 'left'
					}
					
				});
			}else
			$('#'+$($($('.ui-dialog div:visible')[i])).attr('id')).dialog('option', 'position', [x/2,y]);
		}
	}else{
		var x=($(window).width()-$($($('.ui-dialog div:visible')[i]).parent()).outerWidth())/2;
		var y = $($($('.ui-dialog div:visible')[i]).parent()).position().top - jQuery(document).scrollTop();
		$('#'+$($($('.ui-dialog div:visible')[i])).attr('id')).dialog('option', 'position', [x,y]);
		
		}
	}
	}
	});
	
	
	});
	
