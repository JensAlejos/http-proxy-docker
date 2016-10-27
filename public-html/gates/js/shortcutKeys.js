var enableShortCuts = function() {
	shortcut.add("Ctrl+E",function() {
		exit();
	});
	
	shortcut.add("Ctrl+X",function() {
		saveExit();
	});
	
	shortcut.add("Ctrl+S",function() {
		saveOrder();
	});
	
	/*
	shortcut.add("Ctrl+C",function() {
		saveCopyOrder();
	});
	*/
	
	shortcut.add("Ctrl+A",function() {
		applyQuote();
	});
	
	shortcut.add("Ctrl+D",function() {
		openDispatch();
	});
}

var disableShortCuts = function() {
	shortcut.remove("Ctrl+E");
	shortcut.remove("Ctrl+X");
	shortcut.remove("Ctrl+S");
	shortcut.remove("Ctrl+C");
	shortcut.remove("Ctrl+A");
	shortcut.remove("Ctrl+D");
}

enableShortCuts();
