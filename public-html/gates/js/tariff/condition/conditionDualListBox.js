$(function() {
	var onSort = new Array();
	$('#cityPortoriginPortto2').click(function() {
						var selectedArr = [];
						selectedArr = jQuery("#cities").jqGrid('getGridParam','selarrrow');
						var destList = document.getElementById("conditionCityPortOriginPortToList");
						var tempcityCode="";
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var i = 0; i < selectedArr.length; i++) {
							var cityCode = $('#cities').getCell(selectedArr[i],'cityCode');
							var cityName = $('#cities').getCell(selectedArr[i], 'cityCode')+ "  "+ $('#cities').getCell(selectedArr[i],'cityName');
							for ( var m = 0; m < destList.options.length; m++) {
								if (cityCode == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;
								}
							}
							if (toAppend) {
							$('#conditionCityPortOriginPortToList').append(
									$('<option>', {style : "color:blue",value : cityCode}).text(cityName));
							}
						}
						SortSubscribeFields("conditionCityPortOriginPortToList");
					});
				$('#cityPortoriginPortto1').click(function() {
					$('#conditionCityPortOriginPortToList :selected').remove();
				});
	$('#cityPortDestinationPortto2').click(function() {
						//
						var selectedArr = [];
						selectedArr = jQuery("#cities").jqGrid('getGridParam','selarrrow');

						var destList = document.getElementById("conditionCityPortDestinationPortToList");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var i = 0; i < selectedArr.length; i++) {
							var cityCode = $('#cities').getCell(selectedArr[i],'cityCode');
							var cityName = $('#cities').getCell(selectedArr[i], 'cityCode')+ "  "+ $('#cities').getCell(selectedArr[i],'cityName');
							for ( var m = 0; m < destList.options.length; m++) {
								if (cityCode == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								$('#conditionCityPortDestinationPortToList').append($('<option>', {style : "color:blue",value : cityCode}).text(cityName));
					      }
						}
							
							SortSubscribeFields("conditionCityPortDestinationPortToList");
						
					});
	$('#cityPortDestinationPortto1').click(function() {
		$('#conditionCityPortDestinationPortToList :selected').remove();
	});
	$('#cityPortBLoriginCityto2').click(function() {
						var selectedArr = [];
						selectedArr = jQuery("#cities").jqGrid('getGridParam','selarrrow');
						var destList = document.getElementById("conditionCityPortBLOrignCityToList");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var i = 0; i < selectedArr.length; i++) {
							var cityCode = $('#cities').getCell(selectedArr[i],'cityCode');
							var cityName = $('#cities').getCell(selectedArr[i], 'cityCode')+ "  "+ $('#cities').getCell(selectedArr[i],'cityName');
							for ( var m = 0; m < destList.options.length; m++) {
								if (cityCode == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								
								$('#conditionCityPortBLOrignCityToList').append($('<option>', {style : "color:blue",value : cityCode}).text(cityName));
							}
						
						}
						
						SortSubscribeFields("conditionCityPortBLOrignCityToList");
					});
	$('#cityPortBLoriginCityto1').click(function() {
		$('#conditionCityPortBLOrignCityToList :selected').remove();
	});
	$('#cityPortPLDestinationCityto2').click(function() {
						var selectedArr = [];
						selectedArr = jQuery("#cities").jqGrid('getGridParam','selarrrow');
						var destList = document.getElementById("conditionCityPortBLDestinationCityToList");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var i = 0; i < selectedArr.length; i++) {
							var cityCode = $('#cities').getCell(selectedArr[i],'cityCode');
							var cityName = $('#cities').getCell(selectedArr[i], 'cityCode')+ "  "+ $('#cities').getCell(selectedArr[i],'cityName');
							for ( var m = 0; m < destList.options.length; m++) {
								if (cityCode == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								$('#conditionCityPortBLDestinationCityToList').append($('<option>', {style : "color:blue",value : cityCode}).text(cityName));
						     } 
						}
						
						SortSubscribeFields("conditionCityPortBLDestinationCityToList");
					});

	$('#cityPortPLDestinationCityto1').click(function() {
		$('#conditionCityPortBLDestinationCityToList :selected').remove();
	});
	$('#cityPortBargeOriginto2').click(function() {
						var selectedArr = [];
						selectedArr = jQuery("#cities").jqGrid('getGridParam','selarrrow');
						var destList = document.getElementById("conditionCityPortBargeOriginToList");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var i = 0; i < selectedArr.length; i++) {
							var cityCode = $('#cities').getCell(selectedArr[i],'cityCode');
							var cityName = $('#cities').getCell(selectedArr[i], 'cityCode')+ "  "+ $('#cities').getCell(selectedArr[i],'cityName');
							for ( var m = 0; m < destList.options.length; m++) {
								if (cityCode == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
						if (toAppend) {
								$('#conditionCityPortBargeOriginToList').append($('<option>', {style : "color:blue",value : cityCode}).text(cityName));
						}	
					   }
							SortSubscribeFields("conditionCityPortBargeOriginToList");
						
					});
	$('#cityPortBargeOriginto1').click(function() {
		$('#conditionCityPortBargeOriginToList :selected').remove();
	});
	$('#cityPortBargeDestinationto2').click(function() {
						var selectedArr = [];
						selectedArr = jQuery("#cities").jqGrid('getGridParam','selarrrow');
						var destList = document.getElementById("conditionCityPortBargeDestinationToList");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var i = 0; i < selectedArr.length; i++) {
							var cityCode = $('#cities').getCell(selectedArr[i],'cityCode');
							var cityName = $('#cities').getCell(selectedArr[i], 'cityCode')+ "  "+ $('#cities').getCell(selectedArr[i],'cityName');
							for ( var m = 0; m < destList.options.length; m++) {
								if (cityCode == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								$('#conditionCityPortBargeDestinationToList').append($('<option>', {style : "color:blue",value : cityCode}).text(cityName));
							}	
						}
						
							SortSubscribeFields("conditionCityPortBargeDestinationToList");
						
					});

	$('#cityPortBargeDestinationto1').click(function() {
		$('#conditionCityPortBargeDestinationToList :selected').remove();
	});
	$.configureBoxes({
		box1View : 'conditionCityPortCityFromList',
		box1Storage : 'conditionCityPortCityFromListStorage',
		box1Filter : 'conditionCityPortCity',
		box1Counter : 'conditionCityPortCityFromListCounter',
		sortBy: 'value',
		useFilters : true,
		useCounters : true,
		useSorting: true
	});

	/* End For City/Port Tab */

	/* For Equipment */
	$('#equipmentto2').click(
			function() {

				var realvalues = [];
				var textvalues = [];
				var toAppend = false;

				$('#conditionEquipmentList :selected').each(
						function(i, selected) {
							realvalues[i] = $(selected).val();
							textvalues[i] = $(selected).text();
						});
				var destList = document.getElementById("conditionEquipmentSelectedList");
				if (destList.options.length == 0) {
					toAppend = true;
				}
				for ( var j = 0; j < realvalues.length; j++) {
					for ( var m = 0; m < destList.options.length; m++) {
						if (realvalues[j] == destList.options[m].value) {
							toAppend = false;
							break;
						} else {
							toAppend = true;
							continue;

						}
					}
					if (toAppend) {
							$('#conditionEquipmentSelectedList').append($('<option >', {style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
				   }
				}
					SortSubscribeFields("conditionEquipmentSelectedList");
				
			});

	$('#equipmentto1').click(function() {
		$('#conditionEquipmentSelectedList :selected').remove();
	});

	/* For Equipment Feature List */
	$('#equipmentFeatureto2').click(function() {
						var realvalues = [];
						var textvalues = [];
						var toAppend = false;
						$('#conditionEqptFeatureAvailLst :selected').each(
								function(i, selected) {
									realvalues[i] = $(selected).val();
									textvalues[i] = $(selected).text();
								});
						var destList = document.getElementById("conditionEqptFeatureSelLst");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var j = 0; j < realvalues.length; j++) {
							for ( var m = 0; m < destList.options.length; m++) {
								if (realvalues[j] == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								$('#conditionEqptFeatureSelLst').append($('<option>', {style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
							
						  }	
						}
						
						SortSubscribeFields("conditionEqptFeatureSelLst");
					});
	$('#equipmentFeatureto1').click(function() {
		$('#conditionEqptFeatureSelLst :selected').remove();
	});

	/* For Rate Basis */
	$('#conditionRateBasisto2').click(
			function() {

				var realvalues = [];
				var textvalues = [];
				var toAppend = false;

				$('#conditionRateBasisFormList :selected').each(
						function(i, selected) {
							realvalues[i] = $(selected).val();
							textvalues[i] = $(selected).text();
						});
				var destList = document.getElementById("conditionrateBasisToList");
				if (destList.options.length == 0) {
					toAppend = true;
				}
				for ( var j = 0; j < realvalues.length; j++) {
					for ( var m = 0; m < destList.options.length; m++) {
						if (realvalues[j] == destList.options[m].value) {
							toAppend = false;
							break;
						} else {
							toAppend = true;
							continue;

						}
					}
					if (toAppend) {
						
						$('#conditionrateBasisToList').append($('<option>', {style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
					
					
				}	
				}
				
				SortSubscribeFields("conditionrateBasisToList");	
			});

	$('#conditionRateBasisto1').click(function() {
		$('#conditionrateBasisToList :selected').remove();
	});

	/* Load Discharge */
	$('#cldLoadSeviceTo2').click(function() {
						var realvalues = [];
						var textvalues = [];
						var toAppend = false;
						$('#conditionLoadDischargeLoadServiceFromList :selected').each(function(i, selected) {
									realvalues[i] = $(selected).val();
									textvalues[i] = $(selected).text();
								});
						var destList = document.getElementById("conditionLoadDischargeSelectedLoadServiceToList");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var j = 0; j < realvalues.length; j++) {
							for ( var m = 0; m < destList.options.length; m++) {
								if (realvalues[j] == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								$('#conditionLoadDischargeSelectedLoadServiceToList').append($('<option>',{style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
								$("#conditionLoadDischargeLoadServiceFromList option[value="+realvalues[j]+"]").remove();
							}	
						}
						
						SortSubscribeFields("conditionLoadDischargeSelectedLoadServiceToList");	
					});

	$('#cldLoadSeviceTo1').click(function() {
		var realvalues = [];
		var textvalues = [];
		var toAppend = true;
		$('#conditionLoadDischargeSelectedLoadServiceToList :selected').each(function(i, selected) {
					realvalues[i] = $(selected).val();
					textvalues[i] = $(selected).text();
				});
		var destList = document.getElementById("conditionLoadDischargeLoadServiceFromList");
		if (destList.options.length == 0) {
			toAppend = true;
		}
		for ( var m = 0; m <realvalues.length ; m++) {
			for ( var j = 0; j < destList.options.length; j++) {
				if (realvalues[m] == destList.options[j].value) {
					toAppend = false;
					break;
				}
			}
			if (toAppend) {
				$('#conditionLoadDischargeLoadServiceFromList').append($('<option>',{style : "color:blue",value : realvalues[m]}).text(textvalues[m]));
			}
			$("#conditionLoadDischargeSelectedLoadServiceToList option[value="+realvalues[m]+"]").remove();
		}
		
		SortSubscribeFields("conditionLoadDischargeLoadServiceFromList");	
			});

	$('#cldDischargeServiceTo2').click(function() {
						var realvalues = [];
						var textvalues = [];
						var toAppend = false;
						$('#conditionLoadDischargeDischargeServiceFromList :selected').each(function(i, selected) {
									realvalues[i] = $(selected).val();
									textvalues[i] = $(selected).text();
								});
						var destList = document.getElementById("conditionLoadDischargeDischargeServiceSelectedLoadServiceToList");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var j = 0; j < realvalues.length; j++) {
							for ( var m = 0; m < destList.options.length; m++) {
								if (realvalues[j] == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								
								$('#conditionLoadDischargeDischargeServiceSelectedLoadServiceToList').append($('<option>',{style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
						   }
						}
						
						SortSubscribeFields("conditionLoadDischargeDischargeServiceSelectedLoadServiceToList");
					});

	$('#cldDischargeServiceTo1').click(function() {
		$(
			'#conditionLoadDischargeDischargeServiceSelectedLoadServiceToList :selected').remove();
		});

	$('#cldServicePairTo2').click(function() {
						var realvalues = [];
						var textvalues = [];
						var toAppend = false;
						$('#conditionLoadDischargeServicePairFromList :selected').each(function(i, selected) {
									realvalues[i] = $(selected).val();
									textvalues[i] = $(selected).text();
						});
						var destList = document.getElementById("conditionLoadDischargeServicePairToList");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var j = 0; j < realvalues.length; j++) {
							for ( var m = 0; m < destList.options.length; m++) {
								if (realvalues[j] == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								
								$('#conditionLoadDischargeServicePairToList').append($('<option>',{style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
							}	
						}
						
						SortSubscribeFields("conditionLoadDischargeServicePairToList");
					});

	$('#cldServicePairTo1').click(function() {
		$('#conditionLoadDischargeServicePairToList :selected').remove();
	});

	/* Load Discharge End */

	$('#specialServiceL1to2').click(function() {
						var realvalues = [];
						var textvalues = [];
						var toAppend = false;
						$('#conditionSpecialServiceFromList :selected').each(
								function(i, selected) {
									realvalues[i] = $(selected).val();
									textvalues[i] = $(selected).text();
								});
						var destList = document.getElementById("conditionSpecialServiceToList1");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var j = 0; j < realvalues.length; j++) {
							for ( var m = 0; m < destList.options.length; m++) {
								if (realvalues[j] == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								
								$('#conditionSpecialServiceToList1').append($('<option>',{style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
							}	
						}
						
						SortSubscribeFields("conditionSpecialServiceToList1");
					});

	$('#specialServiceL1to1').click(function() {
		$('#conditionSpecialServiceToList1 :selected').remove();
	});
	$('#specialServiceL2to2').click(function() {
						var realvalues = [];
						var textvalues = [];
						var toAppend = false;
						$('#conditionSpecialServiceFromList :selected').each(
								function(i, selected) {
									realvalues[i] = $(selected).val();
									textvalues[i] = $(selected).text();
								});
						var destList = document.getElementById("conditionSpecialServiceToList2");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var j = 0; j < realvalues.length; j++) {
							for ( var m = 0; m < destList.options.length; m++) {
								if (realvalues[j] == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								
								$('#conditionSpecialServiceToList2').append($('<option>',{style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
							}	
						}
						
						SortSubscribeFields("conditionSpecialServiceToList2");
					});
	$('#specialServiceL2to1').click(function() {
		$('#conditionSpecialServiceToList2 :selected').remove();
	});
	$('#specialServiceL3to2').click(function() {
						var realvalues = [];
						var textvalues = [];
						var toAppend = false;
						$('#conditionSpecialServiceFromList :selected').each(
								function(i, selected) {
									realvalues[i] = $(selected).val();
									textvalues[i] = $(selected).text();
								});
						var destList = document.getElementById("conditionSpecialServiceToList3");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var j = 0; j < realvalues.length; j++) {
							for ( var m = 0; m < destList.options.length; m++) {
								if (realvalues[j] == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								
								$('#conditionSpecialServiceToList3').append($('<option>',{style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
							
							}	
						}
						
						SortSubscribeFields("conditionSpecialServiceToList3");
					});
	$('#specialServiceL3to1').click(function() {
		$('#conditionSpecialServiceToList3 :selected').remove();
	});
	$('#specialServiceL4to2').click(function() {
						var realvalues = [];
						var textvalues = [];
						var toAppend = false;
						$('#conditionSpecialServiceFromList :selected').each(
								function(i, selected) {
									realvalues[i] = $(selected).val();
									textvalues[i] = $(selected).text();
								});
						var destList = document.getElementById("conditionSpecialServiceToList4");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var j = 0; j < realvalues.length; j++) {
							for ( var m = 0; m < destList.options.length; m++) {
								if (realvalues[j] == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}
							if (toAppend) {
								
								$('#conditionSpecialServiceToList4').append($('<option>',{style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
							}	
						}
						
						SortSubscribeFields("conditionSpecialServiceToList4");
					});

	$('#specialServiceL4to1').click(function() {
		$('#conditionSpecialServiceToList4 :selected').remove();
	});
	$('#specialServiceL5to2').click(function() {
						var realvalues = [];
						var textvalues = [];
						var toAppend = false;
						$('#conditionSpecialServiceFromList :selected').each(
								function(i, selected) {
									realvalues[i] = $(selected).val();
									textvalues[i] = $(selected).text();
								});
						var destList = document.getElementById("conditionSpecialServiceToList5");
						if (destList.options.length == 0) {
							toAppend = true;
						}
						for ( var j = 0; j < realvalues.length; j++) {
							for ( var m = 0; m < destList.options.length; m++) {
								if (realvalues[j] == destList.options[m].value) {
									toAppend = false;
									break;
								} else {
									toAppend = true;
									continue;

								}
							}

							if (toAppend) {
								$('#conditionSpecialServiceToList5').append($('<option>',{style : "color:blue",value : realvalues[j]}).text(textvalues[j]));
							}
						}
						
						SortSubscribeFields("conditionSpecialServiceToList5");
					});

	$('#specialServiceL5to1').click(function() {
		$('#conditionSpecialServiceToList5 :selected').remove();
	});

	SortSubscribeFields("conditionCityPortOriginPortToList");
	SortSubscribeFields("conditionCityPortDestinationPortToList");
	SortSubscribeFields("conditionCityPortBLOrignCityToList");
	SortSubscribeFields("conditionLoadDischargeSelectedLoadServiceToList");
	SortSubscribeFields("conditionLoadDischargeDischargeServiceSelectedLoadServiceToList");
	SortSubscribeFields("conditionLoadDischargeServicePairToList");

	SortSubscribeFields("conditionCityPortBLDestinationCityToList");
	SortSubscribeFields("conditionCityPortBargeOriginToList");
	SortSubscribeFields("conditionCityPortBargeDestinationToList");
	SortSubscribeFields("conditionEquipmentSelectedList");
	SortSubscribeFields("conditionEqptFeatureSelLst");
	SortSubscribeFields("conditionrateBasisToList");

	SortSubscribeFields("conditionSpecialServiceToList1");
	SortSubscribeFields("conditionSpecialServiceToList2");
	SortSubscribeFields("conditionSpecialServiceToList3");
	SortSubscribeFields("conditionSpecialServiceToList4");
	SortSubscribeFields("conditionSpecialServiceToList5");
})

function submitAllSelect() {
	selectAll(getControl('conditionEqptFeatureSelLst'));
	selectAll(getControl('conditionEquipmentSelectedList'));
	selectAll(getControl('conditionrateBasisToList'));
	selectAll(getControl('conditionCityPortBargeDestinationToList'));
	selectAll(getControl('conditionCityPortBargeOriginToList'));
	selectAll(getControl('conditionCityPortBLDestinationCityToList'));
	selectAll(getControl('conditionCityPortBLOrignCityToList'));
	selectAll(getControl('conditionCityPortDestinationPortToList'));
	selectAll(getControl('conditionCityPortOriginPortToList'));
	selectAll(getControl('conditionLoadDischargeSelectedLoadServiceToList'));
	selectAll(getControl('conditionLoadDischargeDischargeServiceSelectedLoadServiceToList'));
	selectAll(getControl('conditionLoadDischargeServicePairToList'));
	selectAll(getControl('conditionSpecialServiceToList1'));
	selectAll(getControl('conditionSpecialServiceToList2'));
	selectAll(getControl('conditionSpecialServiceToList3'));
	selectAll(getControl('conditionSpecialServiceToList4'));
	selectAll(getControl('conditionSpecialServiceToList5'));
	selectAll(getControl('shipperAroleSelectedList'));
	selectAll(getControl('consigeeAroleSelectedList'));
	selectAll(getControl('debitorAroleSelectedList'));
	selectAll(getControl('shipperOrganizationToList'));
	selectAll(getControl('consigneeOrganizationToList'));
	selectAll(getControl('debitorOrganizationToList'));
}

function selectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;
	for ( var i = 0; i < selObj.options.length; i++) {
		tmpOptObj = selObj.options[i];
		if (!tmpOptObj.selected)
			tmpOptObj.selected = true;
	}// end if
}
var getControl = function(id) {
	var control = document.getElementById(id);
	if (!control)
		control = document.getElementById(getNetuiTagName(id, this));
	return control;
};
function SortSubscribeFields(fieldname) {
	var listitems =  $("#"+fieldname+" option");
	 listitems.sort(function(a, b) {
	 var compA = $(a).text().toUpperCase();
	 var compB = $(b).text().toUpperCase();
	 return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
	})
	$.each(listitems, function(idx, itm) {
		 $("#"+fieldname).append(itm);
	});
}
