/**
 *  This function creates the calendar inside the given parent.  If _par is
 *  null than it creates a popup calendar inside the BODY element.  If _par is
 *  an element, be it BODY, then it creates a non-popup calendar (still
 *  hidden).  Some properties need to be set before calling this function.
 */
Calendar.prototype.create = function (_par) {
	var parent = null;
	if (! _par) {
		// default parent is the document body, in which case we create
		// a popup calendar.
		parent = document.getElementsByTagName("body")[0];
		this.isPopup = true;
	} else {
		parent = _par;
		this.isPopup = false;
	}
	this.date = this.dateStr ? new Date(this.dateStr) : new Date();

	/*
	if(typeof this.params['inputField'] != "undefined"){
		this.params['inputField'].value = "";
	}*/

		// Report Variable Start
		//Create Main Table
		// Put this object in Global Array
		var index = 0;
		if (typeof _dynarch_pCalendarIns[RCAL_INSTANCES] != "undefined"){
			var cInstanceArray = _dynarch_pCalendarIns[RCAL_INSTANCES];
			index = cInstanceArray.length;
			cInstanceArray[index] = this;
		}

		var mainTABLE = Calendar.createElement("table");
		mainTABLE.cellSpacing = 0;
		mainTABLE.cellPadding = 0;
		this.table = mainTABLE;

		var mainTBODY = Calendar.createElement('tbody');
		var mainTR = Calendar.createElement('tr');
		var mainTD1= Calendar.createElement('td');
		var mainTD2 = Calendar.createElement('td');

		// Append to Main table
		mainTR.appendChild(mainTD1);
		mainTR.appendChild(mainTD2);
		mainTBODY.appendChild(mainTR);
		mainTABLE.appendChild(mainTBODY);

		// Create calendar table
		var table = Calendar.createElement("table");
		

		// Add to main table
		mainTD1.appendChild(table);

	
		//Add Report Table
		var reportTABLE = Calendar.createElement("table");
		reportTABLE.cellSpacing = 0;
		reportTABLE.cellPadding = 0;
		reportTABLE.setAttribute("border", "0");
			

		// Create Table Body
		var reportTBODY = Calendar.createElement('tbody');
					
		// Report Title Row
		var reportTR1 =	Calendar.createElement('tr');
		var rTitle = document.createTextNode("Report Variables");
		reportTD1 =	Calendar.createElement('td');
		reportTD1.className = "title";
		reportTD1.width = "90%";
		reportTD1.setAttribute("align","center");
		reportTD1.appendChild(rTitle);

		var cText = "&#x00d7;";
		var cNavtype = 200;
		var closeCell = Calendar.createElement("td");
		closeCell.width = "10%";
		closeCell.className = "button";
		if (cNavtype != 0 && Math.abs(cNavtype) <= 2)
				closeCell.className += " nav";
			
		Calendar._add_evs(closeCell);
		closeCell.calendar = this;
		closeCell.navtype = cNavtype;
		closeCell.innerHTML = "<div unselectable='on'>" + cText + "</div>";
					
		reportTR1.appendChild(reportTD1);
		reportTR1.appendChild(closeCell);
		reportTBODY.appendChild(reportTR1);

		// Add empty rows
		var len1 = 0;
		len1 = (isMicrosoft(0) == true) ? 2 : 2;
		for(var i=0; i < len1; i++){
				var reportTR4 =	Calendar.createElement('tr');
				var eMsg1 = document.createTextNode("");
				reportTD1 =	Calendar.createElement('td');
				reportTD1.colSpan = 2;
				reportTD1.appendChild(eMsg1);
				reportTR4.appendChild(reportTD1);
				reportTBODY.appendChild(reportTR4);
		 }
					
		// Report DropDown Row
		var reportTR2 =	Calendar.createElement('tr');
		reportTD1 =	Calendar.createElement('td');
		reportTD1.colSpan = 2;

		// Create Report Drop Down
		var reportBox=Calendar.createElement("select");
		reportBox.setAttribute("name", RCAL_RPT_SEL_VARNAME);
		reportBox.setAttribute("id", (RCAL_RPT_SEL_VARID + index));
		reportBox.setAttribute("value","-1");
		

		var reportVNLength = (reportVNames.length != "undefined") ? reportVNames.length : 0;
		for(var i = 0; i < reportVNLength; i++){
			var rOP1=Calendar.createElement("option");
			var rCalOptionName = RCAL_RPT_OPTION_NAME + i;
			rOP1.setAttribute("name", rCalOptionName);
			rOP1.setAttribute("value",reportVCodes[i]);
			var rOT1 = document.createTextNode(reportVNames[i]);
					
			if(reportVCodes[i] == "-1")
				rOP1.setAttribute("selected","selected");

			rOP1.appendChild(rOT1);
			reportBox.appendChild(rOP1);
		}
		reportTD1.appendChild(reportBox);
		reportTR2.appendChild(reportTD1);
		reportTBODY.appendChild(reportTR2);

		// Add empty rows
		var len1 = 0;
		len1 = (isMicrosoft(0) == true) ? 5 : 5;
		for(var i=0; i < len1; i++){
				var reportTR4 =	Calendar.createElement('tr');
				var eMsg1 = document.createTextNode("");
				reportTD1 =	Calendar.createElement('td');
				reportTD1.colSpan = 2;
				reportTD1.appendChild(eMsg1);
				reportTR4.appendChild(reportTD1);
				reportTBODY.appendChild(reportTR4);
		 }

		// Offset Title
		var reportTR3 =	Calendar.createElement('tr');
		var rOffTitle = document.createTextNode("OFFSET ");
		var reportTD1 =	Calendar.createElement('td');
		reportTD1.colSpan = 2;
		reportTD1.setAttribute("align","left");
		reportTD1.appendChild(rOffTitle);
		var offSetT = Calendar.createElement("input");
		offSetT.setAttribute("name",RCAL_OFFSET_NAME);
		offSetT.setAttribute("id",(RCAL_OFFSET_ID + index));
		offSetT.setAttribute("type", "text");
		offSetT.setAttribute("size", "15");
		offSetT.setAttribute("value","0");
		reportTD1.appendChild(offSetT);
				
	 	reportTR3.appendChild(reportTD1);	
		reportTBODY.appendChild(reportTR3);

		// Add empty rows
		var len1 = 0;
		len1 = (isMicrosoft(0) == true) ? 47 : 51;
		for(var i=0; i < len1; i++){
			var reportTR4 =	Calendar.createElement('tr');
			var eMsg1 = document.createTextNode("");
			reportTD1 =	Calendar.createElement('td');
			reportTD1.colSpan = 2;
			reportTD1.appendChild(eMsg1);
			reportTR4.appendChild(reportTD1);
			reportTBODY.appendChild(reportTR4);
		}

		// Add Button
		var reportTR5 =	Calendar.createElement('tr');
		reportTD1 =	Calendar.createElement('td');
		reportTD1.colSpan = 2;
		reportTD1.setAttribute("align","right");
		var doneButton = Calendar.createElement("input");
		doneButton.setAttribute("type", "button");
		doneButton.setAttribute("id",(RCAL_REPORT_DONE_ID + index));
		doneButton.setAttribute("value","Done");

		doneButton.onclick = function(){
			var dBtnID = this.id;
			var cIndex = dBtnID.substr(RCAL_REPORT_DONE_ID.length);
			var rBoxObject = document.getElementById(RCAL_RPT_SEL_VARID + cIndex);
			var isSelected = validateReportDropDown(rBoxObject);
			if(isSelected){
				
				// Fetch Report Variable
				var returnValue = rBoxObject.options[rBoxObject.selectedIndex].value;

				// Fetch Offset calue
				var ofsetTObject = document.getElementById(RCAL_OFFSET_ID + cIndex);
				var isEntered = validateOffsetText(ofsetTObject);
				if(isEntered){
					returnValue += "$" + ofsetTObject.value;
				}
				
				// Fetch Calendar Instance
				var cal = cInstanceArray[cIndex];
				if(cal != null){
					if(typeof cal.params['inputField'] != "undefined"){
						cal.params['inputField'].value = returnValue;
					}
					// Close Calendar
					cal.callCloseHandler();
				}
			}else{
					alert("Please Select Report Data Variable");
			}
		};
					
		reportTD1.appendChild(doneButton);
		reportTR5.appendChild(reportTD1);
		reportTBODY.appendChild(reportTR5);

		// Add empty rows
		var len1 = 0;
		len1 = (isMicrosoft(0) == true) ? 1 : 1;
		for(var i=0; i < len1; i++){
				var reportTR4 =	Calendar.createElement('tr');
				var eMsg1 = document.createTextNode("");
				reportTD1 =	Calendar.createElement('td');
				reportTD1.colSpan = 2;
				reportTD1.appendChild(eMsg1);
				reportTR4.appendChild(reportTD1);
				reportTBODY.appendChild(reportTR4);
		 }


		reportTABLE.appendChild(reportTBODY);
		
		// Add report table to main table
		mainTD2.appendChild(reportTABLE);


			
		// Report Variable End
		table.cellSpacing = 0;
		table.cellPadding = 0;
		table.calendar = this;
		Calendar.addEvent(table, "mousedown", Calendar.tableMouseDown);
	
		var div = Calendar.createElement("div");
		this.element = div;
		div.className = "calendar";
		if (this.isPopup) {
			div.style.position = "absolute";
			div.style.display = "none";
		}
		
		// Add Main Table to div
		div.appendChild(mainTABLE);

		
			

		var thead = Calendar.createElement("thead", table);
		var cell = null;
		var row = null;

		var cal = this;
		var hh = function (text, cs, navtype) {
			cell = Calendar.createElement("td", row);
			cell.colSpan = cs;
			cell.className = "button";
			if (navtype != 0 && Math.abs(navtype) <= 2)
				cell.className += " nav";
			Calendar._add_evs(cell);
			cell.calendar = cal;
			cell.navtype = navtype;
			cell.innerHTML = "<div unselectable='on'>" + text + "</div>";
			return cell;
	};

	row = Calendar.createElement("tr", thead);
	var title_length = 7;
	(this.isPopup) && --title_length;
	(this.weekNumbers) && ++title_length;

	hh("?", 1, 400).ttip = Calendar._TT["INFO"];
	this.title = hh("", title_length, 300);
	this.title.className = "title";

	/*
		if (this.isPopup) {
			this.title.ttip = Calendar._TT["DRAG_TO_MOVE"];
			this.title.style.cursor = "move";
			hh("&#x00d7;", 1, 200).ttip = Calendar._TT["CLOSE"];
		}
	*/

	row = Calendar.createElement("tr", thead);
	row.className = "headrow";

	this._nav_py = hh("&#x00ab;", 1, -2);
	this._nav_py.ttip = Calendar._TT["PREV_YEAR"];

	this._nav_pm = hh("&#x2039;", 1, -1);
	this._nav_pm.ttip = Calendar._TT["PREV_MONTH"];

	this._nav_now = hh(Calendar._TT["TODAY"], this.weekNumbers ? 4 : 3, 0);
	this._nav_now.ttip = Calendar._TT["GO_TODAY"];

	this._nav_nm = hh("&#x203a;", 1, 1);
	this._nav_nm.ttip = Calendar._TT["NEXT_MONTH"];

	this._nav_ny = hh("&#x00bb;", 1, 2);
	this._nav_ny.ttip = Calendar._TT["NEXT_YEAR"];

	// day names
	row = Calendar.createElement("tr", thead);
	row.className = "daynames";
	if (this.weekNumbers) {
		cell = Calendar.createElement("td", row);
		cell.className = "name wn";
		cell.innerHTML = Calendar._TT["WK"];
	}
	for (var i = 7; i > 0; --i) {
		cell = Calendar.createElement("td", row);
		if (!i) {
			cell.navtype = 100;
			cell.calendar = this;
			Calendar._add_evs(cell);
		}
	}
	this.firstdayname = (this.weekNumbers) ? row.firstChild.nextSibling : row.firstChild;
	this._displayWeekdays();

	var tbody = Calendar.createElement("tbody", table);
	this.tbody = tbody;

	for (i = 6; i > 0; --i) {
		row = Calendar.createElement("tr", tbody);
		if (this.weekNumbers) {
			cell = Calendar.createElement("td", row);
		}
		for (var j = 7; j > 0; --j) {
			cell = Calendar.createElement("td", row);
			cell.calendar = this;
			Calendar._add_evs(cell);
		}
	}

	if (this.showsTime) {
		row = Calendar.createElement("tr", tbody);
		row.className = "time";

		cell = Calendar.createElement("td", row);
		cell.className = "time";
		cell.colSpan = 2;
		cell.innerHTML = Calendar._TT["TIME"] || "&nbsp;";

		cell = Calendar.createElement("td", row);
		cell.className = "time";
		cell.colSpan = this.weekNumbers ? 4 : 3;

		(function(){
			function makeTimePart(className, init, range_start, range_end) {
				var part = Calendar.createElement("span", cell);
				part.className = className;
				part.innerHTML = init;
				part.calendar = cal;
				part.ttip = Calendar._TT["TIME_PART"];
				part.navtype = 50;
				part._range = [];
				if (typeof range_start != "number")
					part._range = range_start;
				else {
					for (var i = range_start; i <= range_end; ++i) {
						var txt;
						if (i < 10 && range_end >= 10) txt = '0' + i;
						else txt = '' + i;
						part._range[part._range.length] = txt;
					}
				}
				Calendar._add_evs(part);
				return part;
			};
			var hrs = cal.date.getHours();
			var mins = cal.date.getMinutes();
			var t12 = !cal.time24;
			var pm = (hrs > 12);
			if (t12 && pm) hrs -= 12;
			var H = makeTimePart("hour", hrs, t12 ? 1 : 0, t12 ? 12 : 23);
			var span = Calendar.createElement("span", cell);
			span.innerHTML = ":";
			span.className = "colon";
			var M = makeTimePart("minute", mins, 0, 59);
			var AP = null;
			cell = Calendar.createElement("td", row);
			cell.className = "time";
			cell.colSpan = 2;
			if (t12)
				AP = makeTimePart("ampm", pm ? "pm" : "am", ["am", "pm"]);
			else
				cell.innerHTML = "&nbsp;";

			cal.onSetTime = function() {
				var pm, hrs = this.date.getHours(),
					mins = this.date.getMinutes();
				if (t12) {
					pm = (hrs >= 12);
					if (pm) hrs -= 12;
					if (hrs == 0) hrs = 12;
					AP.innerHTML = pm ? "pm" : "am";
				}
				H.innerHTML = (hrs < 10) ? ("0" + hrs) : hrs;
				M.innerHTML = (mins < 10) ? ("0" + mins) : mins;
			};

			cal.onUpdateTime = function() {
				var date = this.date;
				var h = parseInt(H.innerHTML, 10);
				if (t12) {
					if (/pm/i.test(AP.innerHTML) && h < 12)
						h += 12;
					else if (/am/i.test(AP.innerHTML) && h == 12)
						h = 0;
				}
				var d = date.getDate();
				var m = date.getMonth();
				var y = date.getFullYear();
				date.setHours(h);
				date.setMinutes(parseInt(M.innerHTML, 10));
				date.setFullYear(y);
				date.setMonth(m);
				date.setDate(d);
				this.dateClicked = false;
				this.callHandler();
			};
		})();
	} else {
		this.onSetTime = this.onUpdateTime = function() {};
	}

	var tfoot = Calendar.createElement("tfoot", table);

	row = Calendar.createElement("tr", tfoot);
	row.className = "footrow";

	cell = hh(Calendar._TT["SEL_DATE"], this.weekNumbers ? 8 : 7, 300);
	cell.className = "ttip";
	if (this.isPopup) {
		cell.ttip = Calendar._TT["DRAG_TO_MOVE"];
		cell.style.cursor = "move";
	}
	this.tooltips = cell;

	div = Calendar.createElement("div", this.element);
	this.monthsCombo = div;
	div.className = "combo";
	for (i = 0; i < Calendar._MN.length; ++i) {
		var mn = Calendar.createElement("div");
		mn.className = Calendar.is_ie ? "label-IEfix" : "label";
		mn.month = i;
		mn.innerHTML = Calendar._SMN[i];
		div.appendChild(mn);
	}

	div = Calendar.createElement("div", this.element);
	this.yearsCombo = div;
	div.className = "combo";
	for (i = 12; i > 0; --i) {
		var yr = Calendar.createElement("div");
		yr.className = Calendar.is_ie ? "label-IEfix" : "label";
		div.appendChild(yr);
	}

	this._init(this.firstDayOfWeek, this.date);
	parent.appendChild(this.element);
};

/** keyboard navigation, only for popup calendars */
Calendar._keyEvent = function(ev) {
	var cal = window._dynarch_popupCalendar;

	if (!cal || cal.multiple)
		return false;
		
	(Calendar.is_ie) && (ev = window.event);
	var act = (Calendar.is_ie || ev.type == "keypress"),
		K = ev.keyCode;
	if (ev.ctrlKey) {
		switch (K) {
		    case 37: // KEY left
			act && Calendar.cellClick(cal._nav_pm);
			break;
		    case 38: // KEY up
			act && Calendar.cellClick(cal._nav_py);
			break;
		    case 39: // KEY right
			act && Calendar.cellClick(cal._nav_nm);
			break;
		    case 40: // KEY down
			act && Calendar.cellClick(cal._nav_ny);
			break;
		    default:
			return true;
		}
	} else switch (K) {
	    case 32: // KEY space (now)
		Calendar.cellClick(cal._nav_now);
		break;
	    case 27: // KEY esc
		act && cal.callCloseHandler();
		break;
	    case 37: // KEY left
	    case 38: // KEY up
	    case 39: // KEY right
	    case 40: // KEY down
		if (act) {
			var prev, x, y, ne, el, step;
			prev = K == 37 || K == 38;
			step = (K == 37 || K == 39) ? 1 : 7;
			function setVars() {
				el = cal.currentDateEl;
				var p = el.pos;
				x = p & 15;
				y = p >> 4;
				ne = cal.ar_days[y][x];
			};setVars();
			function prevMonth() {
				var date = new Date(cal.date);
				date.setDate(date.getDate() - step);
				cal.setDate(date);
			};
			function nextMonth() {
				var date = new Date(cal.date);
				date.setDate(date.getDate() + step);
				cal.setDate(date);
			};
			while (1) {
				switch (K) {
				    case 37: // KEY left
					if (--x >= 0)
						ne = cal.ar_days[y][x];
					else {
						x = 6;
						K = 38;
						continue;
					}
					break;
				    case 38: // KEY up
					if (--y >= 0)
						ne = cal.ar_days[y][x];
					else {
						prevMonth();
						setVars();
					}
					break;
				    case 39: // KEY right
					if (++x < 7)
						ne = cal.ar_days[y][x];
					else {
						x = 0;
						K = 40;
						continue;
					}
					break;
				    case 40: // KEY down
					if (++y < cal.ar_days.length)
						ne = cal.ar_days[y][x];
					else {
						nextMonth();
						setVars();
					}
					break;
				}
				break;
			}
			if (ne) {
				if (!ne.disabled)
					Calendar.cellClick(ne);
				else if (prev)
					prevMonth();
				else
					nextMonth();
			}
		}
		break;
	    case 13: // KEY enter
		if (act)
			Calendar.cellClick(cal.currentDateEl, ev);
		break;
	    default:
		return true;
	}
	return true;
};

Calendar.prototype.hideShowCovered = function () {
	if (!Calendar.is_ie && !Calendar.is_opera)
		return;
	function getVisib(obj){
		var value = obj.style.visibility;
		if (!value) {
			if (document.defaultView && typeof (document.defaultView.getComputedStyle) == "function") { // Gecko, W3C
				if (!Calendar.is_khtml)
					value = document.defaultView.
						getComputedStyle(obj, "").getPropertyValue("visibility");
				else
					value = '';
			} else if (obj.currentStyle) { // IE
				value = obj.currentStyle.visibility;
			} else
				value = '';
		}
		return value;
	};

	var tags = new Array("applet", "iframe", "select");
	var el = this.element;

	var p = Calendar.getAbsolutePos(el);
	var EX1 = p.x;
	var EX2 = el.offsetWidth + EX1;
	var EY1 = p.y;
	var EY2 = el.offsetHeight + EY1;

	for (var k = tags.length; k > 0; ) {
		var ar = document.getElementsByTagName(tags[--k]);
		var cc = null;

		for (var i = ar.length; i > 0;) {
			cc = ar[--i];
			
			// Enable Report DropDown
			if(cc.name == RCAL_RPT_SEL_VARNAME) {
				continue ;
			}

			p = Calendar.getAbsolutePos(cc);
			var CX1 = p.x;
			var CX2 = cc.offsetWidth + CX1;
			var CY1 = p.y;
			var CY2 = cc.offsetHeight + CY1;

			if (this.hidden || (CX1 > EX2) || (CX2 < EX1) || (CY1 > EY2) || (CY2 < EY1)) {
				if (!cc.__msh_save_visibility) {
					cc.__msh_save_visibility = getVisib(cc);
				}
				cc.style.visibility = cc.__msh_save_visibility;
			} else {
				if (!cc.__msh_save_visibility) {
					cc.__msh_save_visibility = getVisib(cc);
				}
				cc.style.visibility = "hidden";
			}
		}
	}
};

 /*
  ** Check if the browser is Netscape compatible
  **    v  version number
  ** returns  true if Netscape and version equals or greater
  */
function isNetscape(v) {
	return isBrowser("Netscape", v);
  }

 /*
  ** Check if the browser is Microsoft Internet Explorer compatible
  **    v  version number
  ** returns  true if MSIE and version equals or greater
  */

function isMicrosoft(v) {
	return isBrowser("Microsoft", v);
  }

  /*
  ** Check if the current browser is compatible
  **  b  browser name
  **  v  version number (if 0 don't check version)
  ** returns true if browser equals and version equals or greater
  */

function isBrowser(b,v) {
	  browserOk = false;
	  versionOk = false;

	  browserOk = (navigator.appName.indexOf(b) != -1);
	  if (v == 0) versionOk = true;
	  else  versionOk = (v <= parseInt(navigator.appVersion));
	  return browserOk && versionOk;
  }

function validateReportDropDown(rVarSElement){
	var isECorrect = false;
	if (typeof rVarSElement != null){
			var sValue = rVarSElement.options[rVarSElement.selectedIndex].value;
			if(sValue != "-1"){
				isECorrect = true;
			}
		}
   return isECorrect;	
}

function validateOffsetText(offsetTElement){
	var isECorrect = false;
		if(offsetTElement != null){
			if(offsetTElement.value != "" && offsetTElement.value != "0"){
				isECorrect = true;
			}
		}
   return isECorrect;
}




/** Adds Report Variables. */
var reportVNames = new Array(
"Select",
"Today",
"Yesterday",				
"First of this Month",		
"First of last Month",		
"Last of this Month",		
"Last of last Month",		
"First of this Year",		
"Last of this Year",		
"First of last Year",		
"Last of last Year",		
"First of this Fiscal Month",
"First of last Fiscal Month",
"Last of this Fiscal Month",
"Last of last Fiscal Month",
"First of this Fiscal Quarter",		
"First of last Fiscal Quarter",		
"Last of this Fiscal Quarter",		
"Last of last Fiscal Quarter"		
);

var reportVCodes = new Array(
"-1",
"$Today",              
"$Yesterday",          
"$FTMonth",            
"$FLMonth",            
"$LTMonth",            
"$LLMonth",            
"$FTYear",             
"$LTYear",             
"$FLYear",             
"$LLYear",             
"$FTFMonth",           
"$FLFMonth",           
"$LTFMonth",           
"$LLFMonth",            
"$FTQuater",
"$FLQuater",
"$LTQuater",
"$LLQuater"
);

var RCAL_RPT_SEL_VARNAME = "RCAL_RPT_SEL_VARNAME";
var RCAL_RPT_OPTION_NAME = "RCAL_RPT_OPTION_NAME";
var RCAL_OFFSET_NAME = "RCAL_OFFSET_NAME";

var RCAL_MAIN_TABLE_ID = "RCAL_MAIN_TABLE_ID";
var RCAL_REPORT_TABLE_ID = "RCAL_REPORT_TABLE_ID";

var RCAL_RPT_SEL_VARID = "RCAL_RPT_SEL_VARID";
var RCAL_OFFSET_ID = "RCAL_OFFSET_ID";

var RCAL_REPORT_DONE_ID = "RCAL_REPORT_DONE_ID";
var RCAL_INSTANCES = "RCAL_INSTANCES";

// global object that remembers the calendar
window._dynarch_popupCalendar = null;
window._dynarch_pCalendarIns = {"RCAL_INSTANCES" : new Array()};
