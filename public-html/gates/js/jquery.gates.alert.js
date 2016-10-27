	
	window.alert = function(message){
		window.scroll(0,0);
	    $(document.createElement('div'))
	        .attr({title: 'Alert', 'class': 'alert'})
	        .html(message)
	        .dialog({
	            buttons: {OK: function(){$(this).dialog('close');}},
	            close: function(){$(this).remove();},
	            draggable: true,
	            modal: true,
	            resizable: false,
	            width: 'auto',
	            position:[500,300],
	            scrollable:false
	        });
	};
	
	
	window.otherAlert = function(title,message){
		window.scroll(0,0);
	    $(document.createElement('div'))
	        .attr({title: title, 'class': 'alert'})
	        .html(message)
	        .dialog({
	            buttons: {OK: function(){$(this).dialog('close');}},
	            close: function(){$(this).remove();},
	            draggable: true,
	            modal: true,
	            resizable: false,
	            width: 'auto',
	            position:[500,300],
	            scrollable:false
	        });
	};

