var tmpSelectedValue;
var format="MM/dd/yyyy";
var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
function LZ(x){return(x<0||x>9?"":"0")+x}
function isDate(val,format){var date=getDateFromFormat(val,format);if(date===0){return false;}return true;}
function compareDates(date1,dateformat1,date2,dateformat2){var d1=getDateFromFormat(date1,dateformat1);var d2=getDateFromFormat(date2,dateformat2);if(d1===0 || d2===0){return -1;}else if(d1 > d2){return 1;}return 0;}
function formatDate(date,format){format=format+"";var result="";var i_format=0;var c="";var token="";var y=date.getYear()+"";var M=date.getMonth()+1;var d=date.getDate();var E=date.getDay();var H=date.getHours();var m=date.getMinutes();var s=date.getSeconds();var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;var value=new Object();if(y.length < 4){y=""+(y-0+1900);}value["y"]=""+y;value["yyyy"]=y;value["yy"]=y.substring(2,4);value["M"]=M;value["MM"]=LZ(M);value["MMM"]=MONTH_NAMES[M-1];value["NNN"]=MONTH_NAMES[M+11];value["d"]=d;value["dd"]=LZ(d);value["E"]=DAY_NAMES[E+7];value["EE"]=DAY_NAMES[E];value["H"]=H;value["HH"]=LZ(H);if(H==0){value["h"]=12;}else if(H>12){value["h"]=H-12;}else{value["h"]=H;}value["hh"]=LZ(value["h"]);if(H>11){value["K"]=H-12;}else{value["K"]=H;}value["k"]=H+1;value["KK"]=LZ(value["K"]);value["kk"]=LZ(value["k"]);if(H > 11){value["a"]="PM";}else{value["a"]="AM";}value["m"]=m;value["mm"]=LZ(m);value["s"]=s;value["ss"]=LZ(s);while(i_format < format.length){c=format.charAt(i_format);token="";while((format.charAt(i_format)==c) &&(i_format < format.length)){token += format.charAt(i_format++);}if(value[token] != null){result=result + value[token];}else{result=result + token;}}return result;}
function _isInteger(val){var digits="1234567890";for(var i=0;i < val.length;i++){if(digits.indexOf(val.charAt(i))==-1){return false;}}return true;}
function _getInt(str,i,minlength,maxlength){for(var x=maxlength;x>=minlength;x--){var token=str.substring(i,i+x);if(token.length < minlength){return null;}if(_isInteger(token)){return token;}}return null;}
function getDateFromFormat(val,format){
val=val+"";format=format+"";var i_val=0;var i_format=0;var c="";var token="";var token2="";var x,y;var now=new Date();var year=now.getYear();var month=now.getMonth()+1;var date=1;var hh=now.getHours();var mm=now.getMinutes();var ss=now.getSeconds();var ampm="";while(i_format < format.length){c=format.charAt(i_format);token="";while((format.charAt(i_format)==c) &&(i_format < format.length)){token += format.charAt(i_format++);}if(token=="yyyy" || token=="yy" || token=="y"){if(token=="yyyy"){x=4;y=4;}if(token=="yy"){x=2;y=2;}if(token=="y"){x=2;y=4;}year=_getInt(val,i_val,x,y);if(year==null){return 0;}i_val += year.length;if(year.length==2){if(year > 70){year=1900+(year-0);}else{year=2000+(year-0);}}}else if(token=="MMM"||token=="NNN"){month=0;for(var i=0;i<MONTH_NAMES.length;i++){var month_name=MONTH_NAMES[i];if(val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()){if(token=="MMM"||(token=="NNN"&&i>11)){month=i+1;if(month>12){month -= 12;}i_val += month_name.length;break;}}}if((month < 1)||(month>12)){return 0;}}else if(token=="EE"||token=="E"){for(var i=0;i<DAY_NAMES.length;i++){var day_name=DAY_NAMES[i];if(val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()){i_val += day_name.length;break;}}}else if(token=="MM"||token=="M"){month=_getInt(val,i_val,token.length,2);if(month==null||(month<1)||(month>12)){return 0;}i_val+=month.length;}else if(token=="dd"||token=="d"){date=_getInt(val,i_val,token.length,2);if(date==null||(date<1)||(date>31)){return 0;}i_val+=date.length;}else if(token=="hh"||token=="h"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<1)||(hh>12)){return 0;}i_val+=hh.length;}else if(token=="HH"||token=="H"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<0)||(hh>23)){return 0;}i_val+=hh.length;}else if(token=="KK"||token=="K"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<0)||(hh>11)){return 0;}i_val+=hh.length;}else if(token=="kk"||token=="k"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<1)||(hh>24)){return 0;}i_val+=hh.length;hh--;}else if(token=="mm"||token=="m"){mm=_getInt(val,i_val,token.length,2);if(mm==null||(mm<0)||(mm>59)){return 0;}i_val+=mm.length;}else if(token=="ss"||token=="s"){ss=_getInt(val,i_val,token.length,2);if(ss==null||(ss<0)||(ss>59)){return 0;}i_val+=ss.length;}else if(token=="a"){if(val.substring(i_val,i_val+2).toLowerCase()=="am"){ampm="AM";}else if(val.substring(i_val,i_val+2).toLowerCase()=="pm"){ampm="PM";}else{return 0;}i_val+=2;}else{if(val.substring(i_val,i_val+token.length)!=token){return 0;}else{i_val+=token.length;}}}if(i_val != val.length){return 0;}if(month==2){if( ((year%4==0)&&(year%100 != 0) ) ||(year%400==0) ){if(date > 29){return 0;}}else{if(date > 28){return 0;}}}if((month==4)||(month==6)||(month==9)||(month==11)){if(date > 30){return 0;}}if(hh<12 && ampm=="PM"){hh=hh-0+12;}else if(hh>11 && ampm=="AM"){hh-=12;}var newdate=new Date(year,month-1,date,hh,mm,ss);return newdate.getTime();}
function parseDate(val){var preferEuro=(arguments.length==2)?arguments[1]:false;generalFormats=new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d');monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');dateFirst =new Array('d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');var d=null;for(var i=0;i<checkList.length;i++){var l=window[checkList[i]];for(var j=0;j<l.length;j++){d=getDateFromFormat(val,l[j]);if(d!=0){return new Date(d);}}}return null;}
function setCurrentDate(format){if(!format||typeof format!='string'){format='MM/dd/yyyy';}var currentDate=new Date();currentDate=formatDate(currentDate,format);return currentDate;}


function unselect(selected) {
	var form1 = selected.form;
	var i = 1;
	var elem;
	while (elem = form1["sortOrder" + i]) {
		if (elem.options != null) {
			elem.options[0].selected = true;
		}
		i++;
	}
}
/* This function controls the behavior of the reset button, 
           change from frm.reset() to find all "filterValue" fields and reset them to all.
           
           
         */
function resetFileds(frm) {
			//frm.reset();
	var i, j, filter, labelName, label;
	for (i = 0; i < frm.elements.length; i++) {
		filter = frm.elements[i];
		if (filter.name.indexOf("filterValue") != -1) {
			if (filter.tagName.toLowerCase() == "input" ) {
			        if(filter.type == "text") {
					filter.value = "ALL";
				}
				labelName = "LABEL_" + filter.id;
				label = document.getElementById(labelName);
				if (label != null) {
					label.innerHTML = "";
					filter.value="ALL";
				}
			} else {
				if (filter.tagName.toLowerCase() == "select") {
		   	        // reset to all if present, if not ignore
					for (j = 0; j < filter.options.length; j++) {
						if (filter.options[j].text == "ALL") {
							filter.selectedIndex = j;
						}
					}
				}
			}  // else do nothing, only handles input and select 
		}
	}
}
function reorder(selected) {
	var oldSelectedValue = tmpSelectedValue * 1;
	var form1 = selected.form;
	var newSelectedValue = selected.options[selected.selectedIndex].value * 1;
	if (newSelectedValue == 0) {
		var i = 1;
		var elem;
		while (elem = form1["sortOrder" + i]) {
			if (elem.options != null) {
				var value = elem.options[elem.selectedIndex].value * 1;
				if (value != 0 && value > oldSelectedValue) {
					elem.options[elem.selectedIndex - 1].selected = true;
				}
			}
			i++;
		}
	} else {
		if (oldSelectedValue == 0) {
			var i = 1;
			var elem;
			while (elem = form1["sortOrder" + i]) {
				if (elem.options != null) {
					var value = elem.options[elem.selectedIndex].value * 1;
					if (value >= newSelectedValue && elem != selected) {
						elem.options[elem.selectedIndex + 1].selected = true;
					}
				}
				i++;
			}
		} else {
			if (oldSelectedValue < newSelectedValue || newSelectedValue == 0) {
				var i = 1;
				var elem;
				while (elem = form1["sortOrder" + i]) {
					if (elem.options != null) {
						var value = elem.options[elem.selectedIndex].value * 1;
						if (value != 0 && (value > oldSelectedValue) && (value <= newSelectedValue) && elem != selected) {
							elem.options[elem.selectedIndex - 1].selected = true;
						}
					}
					i++;
				}
			} else {
				var i = 1;
				var elem;
				while (elem = form1["sortOrder" + i]) {
					if (elem.options != null) {
						var value = elem.options[elem.selectedIndex].value * 1;
						if (value != 0 && (value < oldSelectedValue) && (value >= newSelectedValue) && elem != selected) {
							elem.options[elem.selectedIndex + 1].selected = true;
						}
					}
					i++;
				}
			}
		}
	}
}
function storeSelected(selected) {
	tmpSelectedValue = selected.options[selected.selectedIndex].value;
}
function submitQuery(form) {
	form.submit();
}
/* To post to method */
function postMethod(methodName, obj) {
	var frm = obj.form;
	obj.value = methodName;
	if (methodName == "search") {
		if (frm.searchActionStatus != null) {
			frm.searchActionStatus.value = "1";
		}
	}
	var error = "";
	error = validateSearch();
	if (error != null && error.length > 0) {
		return;
	}
	frm.submit();
}

//Disable Search button
function disableSearch(srchObj) {
	srchObj.disabled = true;
}

function postMethodOnNewWindow(methodName, obj) {
	var frm = obj.form;
	obj.value = methodName;
	if (methodName == "search") {
		frm.target = "_blank";
	}
	frm.submit();
}

/*Ref Data method */
function postRefMethod(methodName, obj, id, idObj, cnt) {
	if(methodName == 'delete'){
		var r=confirm("Do you want to delete this record?");
		if (r==true)
		  {
			var frm = obj.form;
			obj.value = methodName;
			idObj.value = id;
			frm.submit();
		  }
	}
	else{
		var frm = obj.form;
		obj.value = methodName;
		idObj.value = id;
		frm.submit();	
	}
}

function winBRopen(theURL, Name, popW, popH, scroll, loc) {
	var winleft = (screen.width - popW) / 2;
	var winUp = (screen.height - popH) / 2;
	winProp = "width=" + popW + ",height=" + popH + ",left=" + winleft + ",top=" + winUp + ",scrollbars=" + scroll + ",resizable,menubar=" + loc;
	Win = window.open(theURL, Name, winProp);
	if (parseInt(navigator.appVersion) >= 4) {
		Win.window.focus();
	}
}
function openPopup(page) {
	winBRopen(page, "winpops", "300", "150", "NO");
}
/*************************************************************************************** */
/******************    Javascript Field Validations ************************************/
/***************************************************************************************/
function allowNumber(obj) {
	var fldValue = obj.value;
	if (!(event.keyCode >= 48 && event.keyCode <= 57 || (event.keyCode == 46 && fldValue.indexOf(".") == -1))) {
		if (event.keyCode == 42) {
			return;
		}
		event.keyCode = 0;
		return;
	}
}
function allowDateChar(obj) {
	if (!(event.keyCode >= 47 && event.keyCode <= 57)) {
		event.keyCode = 0;
	}
}
function checkAllFilters(filter) {
	col = filter.selectedIndex;
	selectedName = filter.name;
	var aColumnSelects = document.body.getElementsByTagName("select");
	for (i = 0; i < aColumnSelects.length; i++) {
		var nameStr = aColumnSelects[i].name.substring(0, 8);
		if (nameStr == "orderCol" && aColumnSelects[i].name != selectedName) {
			if (aColumnSelects[i].selectedIndex == col) {
				alert("You have already chosen this column for sort, please choose another column");
				filter.selectedIndex = 0;
				return;
			}
		}
	}
}
function setFilterValue(frm, portalName, filterName, value) {
	var filter = eval("frm." + portalName + filterName);
	if (filter.tagName.toLowerCase() == "input") {
		if (filter.value == "ALL" || filter.value == "") {
			filter.value = value;
                    // Raja: 
                    // Added this to prevent CancelForm.setup function from
                    // checking the form change when default value is set
			filter.defaultValue = value;
		}
	} else {
		if (filter.tagName.toLowerCase() == "select") {
			if (filter.value == "ALL" || filter.value == "") {
				for (i = 0; i < filter.options.length; i++) {
                    // Raja:
                    // Added this to prevent CancelForm.setup function from
                    // checking the form change when default value is set
					filter.options[i].defaultSelected = false;
					if (filter.options[i].value == value) {
						filter.selectedIndex = i;
						filter.options[i].defaultSelected = true;	
                        //return;		         	
					}
				}
			}
		}
	} 
			// else, do nothing.
}
function overrideFilterValue(frm, portalName, filterName, value) {
	var filter = eval("frm." + portalName + filterName);
	if (filter.tagName.toLowerCase() == "input") {
		filter.value = value;
	} else {
		if (filter.tagName.toLowerCase() == "select") {
			for (i = 0; i < filter.options.length; i++) {
				if (filter.options[i].value == value) {
					filter.selectedIndex = i;
					return;
				}
			}
		}
	} 
			// else, do nothing.
}
function disableFilter(frm, portalName, filterName) {
	var filter = eval("frm." + portalName + filterName);
	filter.disabled = true;
}
function setField(filter, value) {
	if (filter.tagName.toLowerCase() == "input") {
		if (filter.value == "ALL" || filter.value == "") {
			filter.value = value;
                    // Raja:
                    // Added this to prevent CancelForm.setup function from
                    // checking the form change when default value is set
			filter.defaultValue = value;
		}
	} else {
		if (filter.tagName.toLowerCase() == "select") {
			if (filter.value == "ALL" || filter.value == "") {
				for (i = 0; i < filter.options.length; i++) {
                    // Raja:
                    // Added this to prevent CancelForm.setup function from
                    // checking the form change when default value is set
					filter.options[i].defaultSelected = false;
					if (filter.options[i].value == value) {
						filter.selectedIndex = i;
						filter.options[i].defaultSelected = true;	
                        //return;		         	
					}
				}
			}
		}
	}
}
function getForm(portletName, action) {
	var tmp;
	for (i = 0; i < document.forms.length; i++) {
		tmp = eval("document.forms[i]." + portletName + "cas_search_action");
		if (tmp != null && tmp.value == action) {
			return document.forms[i];
		}
	}
	return document.forms[0];
}

function checkFormObjectHasChecked1(formObject) {
	var returnVal = false;
	var len = formObject.length;
	if (formObject.length > 1) {
		for (var i = 0; i < len; i++) {
			if (formObject[i].type == "radio" || formObject[i].type == "checkbox") {
				if (formObject[i].checked == true) {
					returnVal = true;
					break;
				}
			}
		}
	} else {
		if ((formObject.type == "radio" || formObject.type == "checkbox") && formObject.checked == true) {
			returnVal = true;
		}
	}
	return returnVal;
}
function checkFormObjectHasChecked(formObject, message) {
	if (!checkFormObjectHasChecked1(formObject)) {
		alert(message);
		return false;
	} else {
		return true;
	}
}
function getCheckedObject(formObject) {
	var returnVal;
	var len = formObject.length;
	if (formObject.length > 1) {
		for (var i = 0; i < len; i++) {
			if (formObject[i].type == "radio") {
				if (formObject[i].checked == true) {
					returnVal = formObject[i];
					break;
				}
			}
		}
	} else {
		if (formObject.type == "radio" && formObject.checked == true) {
			returnVal = formObject;
		}
	}
	return returnVal;
}
function checkCorrectOptionSelected1(formObject, defValue) {
	var returnVal = false;
	if (formObject.options[formObject.selectedIndex].value != defValue) {
		returnVal = true;
	}
	return returnVal;
}
function checkCorrectOptionSelected(formObject, defValue, message) {
	if (!checkCorrectOptionSelected1(formObject, defValue)) {
		alert(message);
		return false;
	} else {
		return true;
	}
}
function checkMandatoryForNotEmpty(formObject, defValue, message) {
	var returnVal = false;
	if (formObject.value != defValue) {
		returnVal = true;
	} else {
		alert(message);
	}
	return returnVal;
}


// Expand/Collapse Code
function expandAll(ref) {
            // find table
	var tableRef = ref;
	while (tableRef != null && tableRef.tagName.toLowerCase() != "table") {
		tableRef = tableRef.parentNode;
	}
	if (tableRef == null) {
		return;
	}
	var allowCollapse = "true";
	if (ref.childNodes[0].data == "-") {
		setText(ref, document.createTextNode("+"));
		allowCollapse = true;
	} else {
		setText(ref, document.createTextNode("-"));
		allowCollapse = false;
	}
	var allowExpand = true;
	if (allowCollapse) {
		allowExpand = false;
	}
	var trs = walkChildNodesForTrs(tableRef);
	var length = trs.length;
	for (var i = 0; i < length; i++) {
			   //alert(trs[i].tagName);
		toggleNodes(trs[i], allowCollapse, allowExpand);
	}
}
function toggle(obj) {
	var ref = obj.parentNode.parentNode;
	toggleNodes(ref, true, true);
}
function toggleNodes(ref, allowCollapse, allowExpand) {
	var tdList = ref.getElementsByTagName("td");
	var index;
	if (tdList.length < 1) {
		return;
	}
	for (index = 0; index < tdList[0].childNodes.length; index++) {
		if (tdList[0].childNodes[index].nodeType == 1) {
			break;
		}
	}
	if (tdList[0].childNodes[index].childNodes[0].data == "+") {
		if (allowExpand) {
			setText(tdList[0].childNodes[index], document.createTextNode("-"));
			for (i = 1; i < tdList.length; i++) {
			    //alert(i+" "+tdList.length);
				showText(tdList[i]);
			}
		}
	} else {
		if (allowCollapse) {
			setText(tdList[0].childNodes[index], document.createTextNode("+"));
			for (i = 1; i < tdList.length; i++) {
				hideText(tdList[i]);
			}
		}
	}
}
function walkChildNodesForTrs(obj) {
	var output = new Array();
	var i, group, txt;
	group = obj.childNodes;
	for (i = 0; i < group.length; i++) {
		switch (group[i].nodeType) {
		  case 1:
			if (group[i].tagName.toLowerCase() == "tr") {
				   // alert("TR="+group[i].tagName);
				output[output.length] = group[i];
			} else {
				if (group[i].childNodes.length > 0) {
				    //alert("Node="+group[i].tagName);
					output = output.concat(walkChildNodesForTrs(group[i]));
				}
			}
			break;
		  default:
		}
	}
	return output;
}
function setText(ele, text) {
	while (ele.hasChildNodes()) {
		ele.removeChild(ele.lastChild);
	}
	ele.appendChild(text);
}
function removeText(ele) {
	if (ele.hasChildNodes()) {
		ele.removeChild(ele.lastChild);
	}
	if (ele.hasChildNodes()) {
		ele.removeChild(ele.lastChild);
	}
}
function appendText(ele, text) {
	ele.appendChild(document.createElement("br"));
	ele.appendChild(text);
}
function hideText(ele) {
	var i = 0;
	for (i = ele.childNodes.length - 1; i >= 0; i--) {
		if (ele.childNodes[i].nodeType == 1 && ele.childNodes[i].tagName.toLowerCase() == "div") {
			ele.childNodes[i].style.display = "none";
			break;
		}
	}
}
function showText(ele) {
	var i = 0;
	for (i = ele.childNodes.length - 1; i >= 0; i--) {
		if (ele.childNodes[i].nodeType == 1 && ele.childNodes[i].tagName.toLowerCase() == "div") {
			ele.childNodes[i].style.display = "block";
			break;
		}
	}
}
function expand() {
}
function validateEmail(str) {
	var at = "@";
	var dot = ".";
	var doubledot = "..";
	var lat = str.indexOf(at);
	var lstr = str.length;
	var ldot = str.indexOf(dot);
	if (str.indexOf(at) == -1) {
		alert("Invalid E-mail Address");
		return false;
	}
	if (str.indexOf(at) == -1 || str.indexOf(at) == 0 || str.indexOf(at) == lstr) {
		alert("Invalid E-mail Address");
		return false;
	}
	if (str.indexOf(dot) == -1 || str.indexOf(dot) == 0 || str.indexOf(dot) == lstr) {
		alert("Invalid E-mail Address");
		return false;
	}
	if (str.indexOf(at, (lat + 1)) != -1) {
		alert("Invalid E-mail Address");
		return false;
	}
	if (str.substring(lat - 1, lat) == dot || str.substring(lat + 1, lat + 2) == dot) {
		alert("Invalid E-mail Address");
		return false;
	}
	if (str.indexOf(dot, (lat + 2)) == -1) {
		alert("Invalid E-mail Address");
		return false;
	}
	if (str.indexOf(" ") != -1) {
		alert("Invalid E-mail Address");
		return false;
	}
	if (str.indexOf(doubledot) != -1) {
		alert("Invalid E-mail Address");
		return false;
	}
	return true;
}
function allowEmail(obj) {
	var fldValue = obj.value;
	if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 64 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode == 44) || (event.keyCode == 46) || (event.keyCode == 95))) {
		event.keyCode = 0;
	}
}
function isMandatory() {
	var id, label, error;
	error = "";
	for (var i = 0; i < (arguments.length - 1); i = i + 2) {
		id = arguments[i];
		label = arguments[i + 1];
		var obj = document.getElementById(id);
		if (obj.value == "" || obj.value.length <= 0 || obj.value == "ALL") {
			error += label + " is blank\n";
		}
	}
	return error;
}
function atLeastOneMandatory() {
	var id, label, error;
	error = "";
	var atLeastOneFilled = "N";
	var labelString = "";
	for (var i = 0; i < (arguments.length - 1); i = i + 2) {
		id = arguments[i];
		label = arguments[i + 1];
		var obj = document.getElementById(id);
		if (i == 0) {
			labelString += label;
		} else {
			labelString += ", " + label;
		}
		if (!(obj.value == "" || obj.value.length <= 0 || obj.value == "ALL")) {
			atLeastOneFilled = "Y";
		}
	}
	if (atLeastOneFilled == "N") {
		error = "One of the following fields " + labelString + " should be specified \n";
	}
	return error;
}
function isSelectedOtherUnsepcified() {
	var id, label, error;
	error = "";
	var atLeastOneFilled = "N";
	var labelString = "";
	var checkIfSelected = isMandatory(arguments[0], arguments[1]);
	for (var i = 2; i < (arguments.length - 1); i = i + 2) {
		id = arguments[i];
		label = arguments[i + 1];
		var checkError = isMandatory(id, label);
		if (checkIfSelected.length <= 0 && checkError.length > 0) {
			error += arguments[1] + " should not be selected if " + label + " is not selected \n";
		}
	}
	return error;
}
function isMandatoryEndDate() {
	var id, label, error;
	error = "";
	var id = arguments[0] + "b";
	var label = " End Date entered for " + arguments[1];
	error = isMandatoryDate(id, label);
	return error;
}
function isMandatoryStartDate() {
	var id, label, error;
	error = "";
	var id = arguments[0] + "a";
	var label = " Start Date entered for " + arguments[1];
	error = isMandatoryDate(id, label);
	return error;
}
function isMandatoryDate() {
	var id, label, error;
	error = "";
	if (arguments.length == 2) {
		var id = arguments[0];
		var label = arguments[1];
		result = isMandatory(id, label);
		if (result != null && result.length > 0) {
			error += result;
			return error;
		}
		obj = document.getElementById(id);
		res = isDate(obj.value, format);
		if (res == false) {
			error += label + " is not a valid date \n";
		}
	}
	return error;
}
function areDatesInRange() {
	var result;
	var error = "";
	if (arguments.length == 2) {
		var id1 = arguments[0];
		var label = arguments[1];
		var date1 = document.getElementById(id1 + "a");
		var date2 = document.getElementById(id1 + "b");
		result = compareDates(date1.value, format, date2.value, format);
		if (result == 1) {
			error += " End date is not greater than start date for " + label + "\n";
			return error;
		}
	} else {
		var id1 = arguments[0];
		var label1 = arguments[1];
		var id2 = arguments[2];
		var label2 = arguments[3];
		var date1 = document.getElementById(id1);
		var date2 = document.getElementById(id2);
		result = compareDates(date1.value, format, date2.value, format);
		if (result == 1) {
			error += label2 + " is not greater than " + label1 + "\n";
			return error;
		}
	}
}
function areBothDatesMandatory() {
	var result = "";
	var error = "";
	if (arguments.length == 2) {
		var id1 = arguments[0];
		var label1 = " Start Date entered for " + arguments[1];
		var label2 = " End Date entered for " + arguments[1];
		var date1 = id1 + "a";
		var date2 = id1 + "b";
		result += isMandatoryDate(date1, label1);
		result += isMandatoryDate(date2, label2);
		if ((result == null || result.length <= 0)) {
			return isMandatoryDate(date2, label2);
		}
	} else {
		var id1 = arguments[0];
		var label1 = arguments[1];
		var id2 = arguments[2];
		var label2 = arguments[3];
		result += isMandatoryDate(id1, label1);
		result += isMandatoryDate(id2, label2);
	}
	return result;
}
function endDateMandatoryForStartDate() {
	var result;
	var error = "";
	if (arguments.length == 2) {
		var id1 = arguments[0];
		var label1 = " Start Date entered for " + arguments[1];
		var label2 = " End Date entered for " + arguments[1];
		var date1 = id1 + "a";
		var date2 = id1 + "b";
		result = isMandatoryDate(date1, label1);
		if ((result == null || result.length <= 0)) {
			return isMandatoryDate(date2, label2);
		}
	} else {
		var id1 = arguments[0];
		var label1 = arguments[1];
		var id2 = arguments[2];
		var label2 = arguments[3];
		result = isMandatoryDate(id1, label1);
		if ((result == null || result.length <= 0)) {
			return isMandatoryDate(id2, label2);
		}
	}
}


function postPortalMethod(methodName, frm, portletName) {
	var obj = eval("frm." + portletName + "method");
	if (obj != null && obj.value != null) {
		obj.value = methodName;
	}
	frm.submit();
}
function callDelete(methodValue, methodName, fldName, portletName, searchId) {
	var frm, tmp;
	var frm = getCasSearchForm(portletName, searchId);
	
	if (frm == null) {
		alert("Could not find the query to delete");
		return;
	}
	var savedQuery = eval("frm." + fldName);
	var v = savedQuery.options[savedQuery.selectedIndex];
	if (savedQuery.selectedIndex == 0) {
		alert("Please select a query");
		return;
	}
	if (confirm("Are you sure you want to delete " + v.text)) {
		var methodFld = eval("frm." + methodName);
		postMethod(methodValue, methodFld);
	}
}
function getCasSearchForm(portletName, searchId) {
	var tmp;
	var frm = null;
	for (i = 0; i < document.forms.length; i++) {
		tmp = eval("document.forms[i]." + portletName + "searchType");
		if (tmp != null && tmp.value == searchId) {
			frm = document.forms[i];
			break;
		}
	}
	return frm;
}
function postSubSearch(searchId, searchField, portletName, searchId) {
	var tmp, obj;
	var frm = getCasSearchForm(portletName, searchId);
	if (frm != null) {
		obj = eval("frm." + portletName + "method");
		obj.value = "subSearch";
		obj = eval("frm." + portletName + "subSearchType");
		obj.value = searchId;
		obj = eval("frm." + portletName + "subSearchField");
		obj.value = searchField;
		frm.submit();
	} else {
		alert("Javascrit error has been detected!  Please refresh page");
	}
}
	   		
			// Placeholder for the clear button on label searches.
function clearLabel() {
}
function searchParent(field, portletName, searchId) {
	var tmp, obj;
	var frm = getCasSearchForm(portletName, searchId);
	if (frm != null) {
		obj = eval("frm." + portletName + "method");
		obj.value = "searchReturn";
		obj = eval("frm." + portletName + "subSearchField");
		obj.value = field;
		frm.submit();
	} else {
		alert("Javascrit error has been detected!  Please refresh page");
	}
}
        
        
        // Method to cancel the sub search		
function cancelSubSearch(portletName, searchId) {
	var tmp, obj;
	var frm = getCasSearchForm(portletName, searchId);
	if (frm != null) {
		obj = eval("frm." + portletName + "method");
		obj.value = "searchReturn";
		obj = eval("frm." + portletName + "subSearchField");
		obj.value = "ALL";
		frm.submit();
	} else {
		alert("Javascrit error has been detected!  Please refresh page");
	}
}
		
        //Set Popup search fileds 
function insertURL() {
	window.location = "insert.jsp";
}
function editURL() {
	window.location = "edit.jsp";
}
function submitToNextAction(basePath, nextAction) {
	var tmp, obj;
	var frm = null;
	for (i = 0; i < document.forms.length; i++) {
		tmp = document.forms[i].cas_next_action;
		if (tmp != null && tmp.value == nextAction) {
			frm = document.forms[i];
            //Don't insert a .do at the end it messes up the url pattern
//			frm.action = basePath + tmp.value + ".do";
            frm.action = basePath + tmp.value;
			frm.method.value = "unspecified";
			break;
		}
	}
	if (frm != null) {
		frm.submit();
	} else {
		alert("Javascrit error has been detected!  Please refresh page");
	}
}

// Function should have parameter list
// URL, [Field1, Value1, [Field2, Value2] ....]
function openPopupSearch() {
        var value1;
	if(arguments.length < 1 ) {
		alert('Javascript error in openPopupSearch, must provide at least 1 argument');
		return;
	}
	if(basePath == null) {
	        alert('BasePath must be set!');
	        return;
	}
	var url = basePath+arguments[0];
	//alert(arguments.length);
	for(var i=1;i<(arguments.length-1); i=i+2) {
	        // Remove , as they will not search correctly.
	        value1 = arguments[i+1].replace(/,/,'*'); 
		url += '&filterValue'+arguments[i]+"="+value1;
	}
	url += '&1=1';
	winBRopen(url,'winpops','700','500','yes');
}

function _processFormFields(id, fieldList) {
	fieldListArr = fieldList.split(/ *, */);
	fieldValueArr = id.split("|");
	for(i=0;i<fieldListArr.length;i++){
		var frm;
		try{
		// For backword compability check if fieldListArr[i].value exists
			var frm =eval('self.opener.document.'+fieldListArr[i]);
			if(frm['value'] != null) {
			       frm.value = fieldValueArr[i];
			} else {
			       eval('self.opener.document.'+fieldListArr[i]+'= fieldValueArr[i]');
		           //eval('self.opener.document.'+fieldListArr[i]+'=\''+fieldValueArr[i]+'\'');
		               //alert(eval('self.opener.document.'+fieldListArr[i]));
		        }
			field = fieldValueArr[i];
		}catch(err){
		        alert(err.message);
                }
      	} 
	window.close();
}


function postRunReport(methodName, obj, portletName)
{
	var error, tmp;
	var frm = obj.form;
	var form =$('form[name="runReportForm"]');
	var executionTypeObject =  frm.elements[portletName+'executionType'];
	if(!checkFormObjectHasChecked(executionTypeObject,"Please select online or ondemand")) return false;
	var excutionObject = getCheckedObject(executionTypeObject);
	if(excutionObject.value == "1")
	{
		
		//frm.submit();
			$.ajax({
	            type: form.attr('method'),
	            //url: form.attr('action'),
	            data: form.serialize(),
	            beforeSend: function(){
	            	obj.value = methodName ;
	        		frm.target = '_blank';
	        		tmp = eval("frm." + portletName + "REPORT_EXPORTING");
	        		tmp.name = 'REPORT_EXPORTING';
	        		tmp.value = 'export';
	        		error=validateSearch();
	        		if(error==null || error.length<=0) { 
	        			frm.submit();
	        		}
	            	frm.target = "_self";
	        		tmp = eval("frm." + portletName + "REPORT_EXPORTING");
	        		tmp.value = 'false';
	        		tmp.name = portletName +'REPORT_EXPORTING';
	            },
	            complete: function() {
	            	if(error==null || error.length<=0) { 
	            		window.close();
	            	}

	            }
	        });
			
         
		
				
	}else if(excutionObject.value == "2")
	{
		if(allowOnDemand == true)
		{
			obj.value = "executeNow";
			frm.elements[portletName+'REPORT_EXPORTING'].value = "";
			error=validateSearch();
		    if(error!=null && error.length>0) return;
		    if($('#alfrescoDestinationTextBox').attr("value") == "false"){
    			if($('#distributioSizeTextBox').attr("value") == 0) {
    				$('#distributionError').html("At least one report distribution is required");
    				$('#distributionError').show();
    				return;
    			}
    		}
		    
		    frm.submit();
				
		}else
		{
			alert("UserProfile OR User Email found null, OnDemand  not allowed");
		}
	}
}


function checkAllSortOrders(filter, portletName){
	col=filter.selectedIndex;
	selectedName=filter.name;
	var aColumnSelects = document.body.getElementsByTagName("select");
			
	for (i=0; i<aColumnSelects.length; i++)
	{
		var pName1 = portletName;
		var pLen1 = pName1.length;
		var nameStr=aColumnSelects[i].name.substring(0,pLen1+8);
		if(nameStr == portletName+"orderCol" && aColumnSelects[i].name!= selectedName){
			if(aColumnSelects[i].selectedIndex == col && aColumnSelects[i].selectedIndex != 0){
				alert("You have already chosen this column for sort, please choose another column");
				filter.selectedIndex=0;
				return;
			}
		}
	}
}
