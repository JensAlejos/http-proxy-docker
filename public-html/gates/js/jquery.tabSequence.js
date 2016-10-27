var tabbableForms = new Array();
var lastFocus=new Array();
var form='';
var tabs='';
var parentArray=new Array();
function tabSequence(tabSeqForm,onLastFocussedElement,noTabOnCASFields,skipFocusOpt) {
	// make focus optional
	var skipFocus = false;
	if(skipFocusOpt) skipFocus = true;
	
	var prevForm=form;
	if(tabSeqForm=='#' || tabSeqForm.trim()=='') {
		prevForm=parentArray[form];
		parentArray.splice(parentArray.indexOf(prevForm),1);
		tabSequence(prevForm,onLastFocussedElement,noTabOnCASFields);
		return;
	}
	setTimeout(function(){
	var tabbable = 'input[type="text"]:not(:disabled):not(:hidden):not(".noTab"),input[type="button"]:not(:disabled):not(".noTab"),input[type="checkbox"]:not(:disabled):not(".noTab"),input[type="password"]:not(:disabled),input[type="radio"]:not(:disabled):not(".noTab"),input[type="submit"]:not(:disabled),input[type="file"]:not(:disabled),input[type="reset"]:not(:disabled),input[type="image"]:not(:disabled),a:not(".comments"):not(".history"):not(".noTab"):not(".welcomemsg"):not(".prefrences"),button:not(:disabled):not(:hidden):not(".noTab"),select:not(:disabled):not(".noTab"),textarea:not(:disabled)';
	/*
	 * if user is opening any dialog
	 */
	isDialog=$(tabSeqForm).dialog( "isOpen" );
	if(isDialog=="true" || isDialog==true) {
		var splitted=tabSeqForm.split('#');
		var parentId=splitted[1]+'TabParent';
		$($(tabSeqForm).parent()).attr('id',parentId);
		$('.ui-dialog-titlebar-close').addClass('noTab');
		parentArray['#'+parentId]=prevForm;
		tabSequence('#'+parentId,false,false);
		return;
	}
	form=tabSeqForm;
	tabs=$(tabbable,form);
	if(tabs.length>0) {
		//Setting focus to first visible component on screen
		var next=0;
		var totalElements=tabs.length;
		var maxIndex=totalElements-1;
		while(tabs[next].offsetWidth==0) {
			if(next!=maxIndex) {
				next++;
			}
			else {
				break;
			}
		}
		var firstTabbable = tabs[next];
		/*
		 * If user wants to return to the point of tab where he/she have left from
		 * while opening any dialog 
		 */
		
		if(!skipFocus) {
			if(onLastFocussedElement!="true" && onLastFocussedElement!=true) {
				$(firstTabbable).trigger('focus');
				$(firstTabbable).select();
				//lastFocus[form]=$(firstTabbable);
			}
			else {
				if(lastFocus[form]!=null || lastFocus[form]!=undefined) {
					$(lastFocus[form]).trigger('focus');
					$(lastFocus[form]).select();
				}
				else {
					$(firstTabbable).trigger('focus');
					$(firstTabbable).select();
					//lastFocus[form]=$(firstTabbable);
				}
			}
		}
		/*
		 * if a cas screen is opened and we want to remove tabbing from cas screen fields
		 */
		if(isCAS=="true" || isCAS==true) {
			$('#displaybase a').addClass('noTab');
			$('#displaybase select').addClass('noTab');
			$('#displaybase input[type="checkbox"]').addClass('noTab');
		}
		if(noTabOnCASFields) {
			$('select[name="savedQuery"]').addClass('noTab');
			//$($('.quickSearchFldBgColor')[0]).addClass('noTab');
		}
	var index=tabbableForms.indexOf(form);
	
	if(index==-1) {
		tabbableForms[tabbableForms.length]=form;
		$(tabs).live('keydown', function(event) {
			if(isCAS!="true" && isCAS!=true && isDialog!=true) {
				var currentForm = $(this).parents('form:first');
				var currentFormId=$(currentForm).attr('id');
				if('#'+currentFormId!=form) {
					var formIndex=tabbableForms.indexOf('#'+currentFormId);
					if(formIndex!=-1) {
						tabSequence('#'+currentFormId, true,true,false);
						return;
					}
				}
			}
			if (event.keyCode == '16') {
				return;
			}
				
			
			if (event.keyCode == '9') {
				var tabs=$(tabbable,form);
				var totalElements=tabs.length;
				var maxIndex=totalElements-1;
				event.preventDefault();
				if (event.shiftKey) {
					
					var next=0;
					while(tabs[next].offsetWidth==0) {
						if(next!=maxIndex) {
							next++;
						}
						else {
							break;
						}
					}
					var firstTabbable = tabs[next];
					
					if (event.target == firstTabbable) {
						event.preventDefault();
						var length=tabs.length;
						var lastIndex=length-1;
						while(tabs[lastIndex].offsetWidth==0) {
							if(lastIndex!=0) {
								lastIndex--;
							}
							else {
								break;
							}
						}
						$(tabs[lastIndex]).trigger('focus');			
						$(tabs[lastIndex]).select();
						var lastTabbable = tabs[lastIndex];
						$(lastTabbable).trigger('focus');
						$(lastTabbable).select();
						//lastFocus[form]=$(lastTabbable);
					}
					else{
						var currentTabbable=tabs.index(this);
						var prev=(currentTabbable-1);
						while(tabs[prev].offsetWidth==0) {
							if(prev!=0){
								prev--;
							}
							else {
								break;
							}
						}
						$(tabs[prev]).trigger('focus');
						$(tabs[prev]).select();
					}
				} else  {
					var length=tabs.length;
					var lastIndex=length-1;
					while(tabs[lastIndex].offsetWidth==0) {
						if(lastIndex!=0) {
							lastIndex--;
						}
						else {
							break;
						}
					}
					var lastTabbable = tabs[lastIndex];
					if (event.target == lastTabbable) {
						event.preventDefault();
						var next=0;
						while(tabs[next].offsetWidth==0) {
							var totalElements=tabs.length;
							var maxIndex=totalElements-1;
							if(next!=maxIndex) {
								next++;
							}
							else {
								break;
							}
						}
						var firstTabbable = tabs[next];
						$(firstTabbable).trigger('focus');
						$(firstTabbable).select();
						//lastFocus[form]=$(firstTabbable);
					}
					else{
						var currentTabbable=tabs.index(this);
						var next=(currentTabbable+1);
						var totalElements=tabs.length;
						var maxIndex=totalElements-1;
						while(tabs[next].offsetWidth==0) {
							if(next!=maxIndex) {
								next++;
							}
							else {
								break;
							}
						}
						$(tabs[next]).trigger('focus');
						$(tabs[next]).select();
						//lastFocus[form]=$(tabs[next]);
					}
				}
			}

		});
		
		$(tabs).live('focus', function(event) {
			if(isDialog!="true" && isDialog!=true) {
				var currentForm = $(this).parents('form:first');
				var currentFormId=$(currentForm).attr('id');
				if('#'+currentFormId==form) {
					lastFocus[form]=$(this);
				}
			}
		});
		$(tabs).live('mousedown', function(event) {
			if(isDialog!="true" && isDialog!=true) {
				var currentForm = $(this).parents('form:first');
				var currentFormId=$(currentForm).attr('id');
				if('#'+currentFormId==form) {
					lastFocus[form]=$(this);
				}
			}
		});
	}
	/*
	 * only for close button in overlay
	 */
	$('.ui-dialog-titlebar-close').focus(function(event){
		event.preventDefault();
		next=0;
		maxIndex=tabs.length-1;
		while(tabs[next].offsetWidth==0) {
			if(next!=maxIndex) {
				next++;
			}
			else {
				break;
			}
		}
		var firstTabbable = tabs[next];
		 $(firstTabbable).trigger('focus');
		 $(firstTabbable).select();
		 $(this).removeClass('ui-state-focus');
		});
	
	}
	},100);
}

//This custom function, when called will order tabbing from top to bottom then left to right
function tabSequenceCustom(tabSeqForm,onLastFocussedElement,noTabOnCASFields) {
	var prevForm=form;
	if(tabSeqForm=='#' || tabSeqForm.trim()=='') {
		prevForm=parentArray[form];
		parentArray.splice(parentArray.indexOf(prevForm),1);
		tabSequenceCustom(prevForm,onLastFocussedElement,noTabOnCASFields);
		return;
	}
	setTimeout(function(){
	var tabbable = 'input[type="text"]:not(:disabled):not(:hidden):not(".noTab"),input[type="button"]:not(:disabled):not(".noTab"),input[type="checkbox"]:not(:disabled):not(".noTab"),input[type="password"]:not(:disabled),input[type="radio"]:not(:disabled):not(".noTab"),input[type="submit"]:not(:disabled),input[type="file"]:not(:disabled),input[type="reset"]:not(:disabled),input[type="image"]:not(:disabled),a:not(".comments"):not(".noTab"):not(".history"):not(".noTab"):not(".welcomemsg"):not(".prefrences"),button:not(:disabled):not(:hidden):not(".noTab"),select:not(:disabled):not(".noTab"),textarea:not(:disabled)';
	/*
	 * if user is opening any dialog
	 */
	isDialog=$(tabSeqForm).dialog( "isOpen" );
	if(isDialog=="true" || isDialog==true) {
		var splitted=tabSeqForm.split('#');
		var parentId=splitted[1]+'TabParent';
		$($(tabSeqForm).parent()).attr('id',parentId);
		$('.ui-dialog-titlebar-close').addClass('noTab');
		parentArray['#'+parentId]=prevForm;
		tabSequenceCustom('#'+parentId,false,false);
		return;
	}
	form=tabSeqForm;
	tabs=$(tabbable,form);

	if(tabs.length>0) {
		//Setting focus to first visible component on screen
		var next=0;
		var totalElements=tabs.length;
		var maxIndex=totalElements-1;
		while(tabs[next].offsetWidth==0) {
			if(next!=maxIndex) {
				next++;
			}
			else {
				break;
			}
		}
		var firstTabbable = tabs[next];
		/*
		 * If user wants to return to the point of tab where he/she have left from
		 * while opening any dialog 
		 */
		if(onLastFocussedElement!="true" && onLastFocussedElement!=true) {
			$(firstTabbable).trigger('focus');
			$(firstTabbable).select();
			//lastFocus[form]=$(firstTabbable);
		}
		else {
			if(lastFocus[form]!=null || lastFocus[form]!=undefined) {
				$(lastFocus[form]).trigger('focus');
				$(lastFocus[form]).select();
			}
			else {
				$(firstTabbable).trigger('focus');
				$(firstTabbable).select();
				//lastFocus[form]=$(firstTabbable);
			}
		}
		/*
		 * if a cas screen is opened and we want to remove tabbing from cas screen fields
		 */
		if(isCAS=="true" || isCAS==true) {
			$('#displaybase a').addClass('noTab');
			$('#displaybase select').addClass('noTab');
			$('#displaybase input[type="checkbox"]').addClass('noTab');
		}
		if(noTabOnCASFields) {
			$('select[name="savedQuery"]').addClass('noTab');
			//$($('.quickSearchFldBgColor')[0]).addClass('noTab');
		}
	var index=tabbableForms.indexOf(form);
	
	if(index==-1) {
		tabbableForms[tabbableForms.length]=form;
		$(tabs).live('keydown', function(event) {
			if(isCAS!="true" && isCAS!=true && isDialog!=true) {
				var currentForm = $(this).parents('form:first');
				var currentFormId=$(currentForm).attr('id');
				if('#'+currentFormId!=form) {
					var formIndex=tabbableForms.indexOf('#'+currentFormId);
					if(formIndex!=-1) {
						tabSequenceCustom('#'+currentFormId, true,true,false);
						return;
					}
				}
			}
			if (event.keyCode == '16') {
				return;
			}
				
			
			if (event.keyCode == '9') {
				var tabs=$(tabbable,form);
				tabs.sort(sortByTabIndex);
				var totalElements=tabs.length;
				var maxIndex=totalElements-1;
				event.preventDefault();
				if (event.shiftKey) {
					
					var next=0;
					while(tabs[next].offsetWidth==0) {
						if(next!=maxIndex) {
							next++;
						}
						else {
							break;
						}
					}
					var firstTabbable = tabs[next];
					
					if (event.target == firstTabbable) {
						event.preventDefault();
						var length=tabs.length;
						var lastIndex=length-1;
						while(tabs[lastIndex].offsetWidth==0) {
							if(lastIndex!=0) {
								lastIndex--;
							}
							else {
								break;
							}
						}
						$(tabs[lastIndex]).trigger('focus');			
						$(tabs[lastIndex]).select();
						var lastTabbable = tabs[lastIndex];
						$(lastTabbable).trigger('focus');
						$(lastTabbable).select();
						//lastFocus[form]=$(lastTabbable);
					}
					else{
						var currentTabbable=tabs.index(this);
						var prev=(currentTabbable-1);
						while(tabs[prev].offsetWidth==0) {
							if(prev!=0){
								prev--;
							}
							else {
								break;
							}
						}
						$(tabs[prev]).trigger('focus');
						$(tabs[prev]).select();
					}
				} else  {
					var length=tabs.length;
					var lastIndex=length-1;
					while(tabs[lastIndex].offsetWidth==0) {
						if(lastIndex!=0) {
							lastIndex--;
						}
						else {
							break;
						}
					}
					var lastTabbable = tabs[lastIndex];
					if (event.target == lastTabbable) {
						event.preventDefault();
						var next=0;
						while(tabs[next].offsetWidth==0) {
							var totalElements=tabs.length;
							var maxIndex=totalElements-1;
							if(next!=maxIndex) {
								next++;
							}
							else {
								break;
							}
						}
						var firstTabbable = tabs[next];
						$(firstTabbable).trigger('focus');
						$(firstTabbable).select();
						//lastFocus[form]=$(firstTabbable);
					}
					else{
						var currentTabbable=tabs.index(this);
						var next=(currentTabbable+1);
						var totalElements=tabs.length;
						var maxIndex=totalElements-1;
						while(tabs[next].offsetWidth==0) {
							if(next!=maxIndex) {
								next++;
							}
							else {
								break;
							}
						}
						$(tabs[next]).trigger('focus');
						$(tabs[next]).select();
						//lastFocus[form]=$(tabs[next]);
					}
				}
			}

		});
		
		$(tabs).live('focus', function(event) {
			if(isDialog!="true" && isDialog!=true) {
				var currentForm = $(this).parents('form:first');
				var currentFormId=$(currentForm).attr('id');
				if('#'+currentFormId==form) {
					lastFocus[form]=$(this);
				}
			}
		});
		$(tabs).live('mousedown', function(event) {
			if(isDialog!="true" && isDialog!=true) {
				var currentForm = $(this).parents('form:first');
				var currentFormId=$(currentForm).attr('id');
				if('#'+currentFormId==form) {
					lastFocus[form]=$(this);
				}
				else{
					var currentTabbable=tabs.index(this);
					var next=(currentTabbable+1);
					var totalElements=tabs.length;
					var maxIndex=totalElements-1;
					while(tabs[next].offsetWidth==0) {
						if(next!=maxIndex) {
							next++;
						}
						else {
							break;
						}
					}
					tabs[next].focus();
				}
			}
		});
	}
	/*
	 * only for close button in overlay
	 */
	$('.ui-dialog-titlebar-close').focus(function(event){
		event.preventDefault();
		next=0;
		maxIndex=tabs.length-1;
		while(tabs[next].offsetWidth==0) {
			if(next!=maxIndex) {
				next++;
			}
			else {
				break;
			}
		}
		var firstTabbable = tabs[next];
		 $(firstTabbable).trigger('focus');
		 $(firstTabbable).select();
		 $(this).removeClass('ui-state-focus');
		});
	
	}
	},100);
}

function sortByTabIndex(a, b){

	  var aIndex = a.tabindex;
	  var bIndex = b.tabindex; 
	  return ((aIndex < bName) ? -1 : ((aIndex > bIndex) ? 1 : 0));
}