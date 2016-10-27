/**
 * 
 */

function _enforceSecuritySection(sectionId, accordian, _displayOnly, _modifiableOnly){
	if(_displayOnly && _modifiableOnly){
		$($('.shipment-section')[accordian]).show();
		enableSection(sectionId);
		//checkCopyButtons();
	}else if(_displayOnly && !_modifiableOnly){
		$($('.shipment-section')[accordian]).show();
		disableSection(sectionId);
	}else if(!_displayOnly && _modifiableOnly){
		$($('.shipment-section')[accordian]).show();
		enableSection(sectionId);
		//checkCopyButtons();
	}else if(!_displayOnly && !_modifiableOnly){
		hideSectionAccordion(accordian);
	}
}

function _enforceSecuritySectionWithoutAccordion(sectionId, _displayOnly, _modifiableOnly){
	if(_displayOnly && _modifiableOnly){
		enableSection(sectionId);
		//checkCopyButtons();
	}else if(_displayOnly && !_modifiableOnly){
		disableSection(sectionId);
	}else if(!_displayOnly && _modifiableOnly){
		enableSection(sectionId);
		//checkCopyButtons();
	}else if(!_displayOnly && !_modifiableOnly){
		hideSection(sectionId);
	}
}

function enforceSecurityDivAndButtons(selector, _enabled){
	if(_enabled){
		$("#"+selector).css('visibility','visible');
		$("#"+selector).removeClass('noTab');
	}else{
		$("#"+selector).css('visibility','hidden');
		$("#"+selector).addClass('noTab');
	}
}

function hideSectionAccordion(accordian){
	$($('.shipment-section')[accordian]).hide();
}

function hideSection(sectionId){
	$('#'+sectionId).css('visibility','hidden');
}

function disableSection(sectionId){
	$('#'+sectionId).gatesDisable();
}

function enableSection(sectionId){
	$('#'+sectionId).gatesEnable();
}

function disableDialogButton(dialogId, buttonName){
	$("#"+dialogId+"~ .ui-dialog-buttonpane").contents().find("button:contains('"+buttonName+"')").button("disable");
}

function enforceSecurityTitle(_enabled){
	if(_enabled){
		$('.content-title').css('visibility','visible');
		$('#msgDiv').css('visibility','visible');
	}else{
		$('.content-title').css('visibility','hidden');
		$('#msgDiv').css('visibility','hidden');
	}
}
