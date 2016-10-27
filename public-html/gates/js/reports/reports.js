$(document).ready(function() {
	//For displaying page enclosed in accordion Tabs
	$("#accordian").accordion({
		autoHeight: false,
		active: false,
		collapsible: true,
		disabled: true
	});
	
	jQuery('#accordian h3.ui-accordion-header').click(function(){
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
