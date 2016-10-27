$(function() {
	$.datepicker.setDefaults({
		dateFormat: 'mm-dd-yy',
		constrainInput: true,
		buttonImage: _context+'/resources/images//date-picker-icon.png',
        buttonImageOnly: true,
        showOn: 'button',
        autoSize: true ,
        duration: "fast",
        showOptions: { direction: "up" },
	});
});
		