function getCurrentDate() {
	var fullDate = new Date();
	var dat = fullDate.getDate();
	var mon = fullDate.getMonth() + 1;
	var year = fullDate.getFullYear();
	var currentDate = mon + "-" + dat + "-" + year;
	return currentDate;
}

function convertPoundToKG(weightinLBS) {
	return Math.round(weightinLBS*0.45359237);
}

function convertKGToPound(weightinKilo) {
	return Math.round(weightinKilo*2.20462262);
}

function convertInchesToMeter(feet, inches) {
	if (feet == "") {
		feet = 0;
	}
	if (inches == "") {
		inches = 0;
	}
	var totalInches = Number(feet*12) + Number(inches);
	var meterValue = Math.round(totalInches*0.0254*10000) / 10000;
	return meterValue;
}

function convertMeterToInches(value) {
	if (value == "") {
		value = 0;
	}

	var inches = Math.round(value*39.3700787);
	return inches;
}

function getFeetFromInches(inches) {
	if (inches == "") {
		inches = 0;
	}

	var extraFeet = 0;
	if (inches >=12) {
		remainingInches = inches % 12;
		extraFeet = Math.round((inches-remainingInches)/ 12);
	}
	return extraFeet;
}

function getModInches(inches) {
	if (inches == "") {
		inches = 0;
	}

	if (inches >=12) {
		inches = Math.round(inches % 12);
	}
	return inches;
}

function getTotalInches(feet, inches) {
	if (feet == "") {
		feet = 0;
	}
	if (inches == "") {
		inches = 0;
	}
	
	var totalInches = Number(feet*12) + Number(inches);
	return totalInches;
}

function convertToImperialVolume(value) {
	if (value == "") {
		value = 0;
	}

	var imperialVol = Math.round(35.3146667*value);
	return imperialVol;
}

function convertToMetricVolume(value) {
	if (value == "") {
		value = 0;
	}
	
	var metricVol = Math.round(0.0283168466 *value);
	return metricVol;
}

function convertToImperialWeight(value) {
	if (value == "") {
		value = 0;
	}
	
	var imperialWeight = Math.round(2.20462262*value);
	return imperialWeight;
}

function convertToMetricWeight(value) {
	if (value == "") {
		value = 0;
	}
	
	var metricWeight = Math.round(0.45359237*value);
	return metricWeight;
}

function getCodes(city) {
	var end = city.indexOf("-");
	var code = city.substr(0, end);
	return code;
}


function scrollWin(){
	$('html,body').animate({
	scrollTop: $("#msgDiv").offset().top
	}, 200);
}

function imperialLength(value) {
	var totalInches = convertMeterToInches(	value );
	if (isNaN(totalInches)) {
		return;
	}
	var feets = getFeetFromInches(totalInches);
	var remInches = getModInches(totalInches);
	this.feet = feets;
	this.inches = remInches;
}

function toggleField(compareField, field) {
	var tmp = $('#'+ compareField).val();
	if ($.trim(tmp) == "" || $.trim(tmp) == "0") {
		$('#'+field).removeAttr("disabled");
	} else {
		$('#'+field).attr("disabled", true);
	}
}