$(document).ready(function() {
	$('input:text').live('paste', function() {

		var el = $(this);
		setTimeout(function() {
			var text = $(el).val();
			if (!containsAllAscii(text)) {

				$(el).val(replaceNonASCIIChars(text));

			}
			// var text = $(el).val();
		}, 100);
	});
	$("textarea").live('paste', function() {

		var el = $(this);
		setTimeout(function() {
			var text = $(el).val();
			if (!containsAllAscii(text)) {

				$(el).val(replaceNonASCIIChars(text));

			}
			// var text = $(el).val();
		}, 100);
	});
});

function containsAllAscii(str) {
	return /^[\000-\177]*$/.test(str);
}
function replaceNonASCIIChars(text) {
	var data = "";
	var length = text.length;

	var i = 0;
	for (i = 0; i < length; i++) {

		var characterCode = text.charCodeAt(i);
		if (characterCode > 126) {
			if (characterCode == 8216 || characterCode == 8217) {
				data = data + "'";
			} else if (characterCode == 8220 || characterCode == 8221) {
				data = data + '"';
				// Removed alert Vivek Satyarthi
			} 
			else if(characterCode==8356) {
				//to add Pound Symbol when user copy paste Lira Symbol ASCII code Lira = 8356 and Pound = 163
				data = data + String.fromCharCode(163);
			}
			else {
				//alert(characterCode);
				data = data + text.charAt(i);


			}

		} else {
			data = data + text.charAt(i);
		}
	}
	return data;
}