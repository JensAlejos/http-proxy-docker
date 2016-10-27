
$(document).ready(function(){
	$('#salesRepCode').change(function()
	{
			$('#territoryCode').val("");
	});
	var addressType = $("#addressRoleTypeCode").val();
	if($('#addressRoleId').val().length==0)
	{
		$('#org_address').attr("disabled",true);
		$('#contact_list').attr("disabled",true);
		$('#maintain_addr').attr("disabled",true);
		$('#standingInstr').hide();
		$('#contAddrButtons').hide();
		
	}
	
	$('#org_address').click(function()
	{
		document.location.href=_context+"/addressRole/standingInstruction/edit?addressRoleId="+$('#addressRoleId').val();
	});
	
	$('#arol_save').click(function(){
		$('#orgActive').removeAttr("disabled");
		if($('#owningOrganizationAddressId').val()=="")
		{
			$("#owningAddress_PopUp").validationEngine('showPrompt', 'Please select an address using search button.', 'error', true);
		}
		else if(!$("#orgActive").is(':checked'))
		{
			$("#usingOrganizationName").validationEngine('showPrompt', 'An active address role cannot be setup for an inactive organization.', 'error', true);
		}
		else if(!$("#addressActive").is(':checked'))
		{
			$("#owningOrganizationName").validationEngine('showPrompt', 'Address Role can not be updated for an inactive address.', 'error', true);
		}
		else if($("#addressRoleForm").validationEngine('validate'))
		{
			if($("#isActive").is(':checked'))
			{
				
				if(addressType!=$("#addressRoleTypeCode").val() && 
						!($("#bookingTemplateCount").val() == null || 
								$("#bookingTemplateCount").val() == ""|| 
								$("#bookingTemplateCount").val() == 0)&& 
								!($('#addressRoleTypeCode').val()=="01" || 
								$('#addressRoleTypeCode').val()=="02" || 
								$('#addressRoleTypeCode').val()=="03"))
				{
					$('#isActiveAROLDiv').hide();
					$('#affectedCount').dialog('open');
				}
				
				else
				{
					submitAllSelect();
					$('#addressRoleForm').attr("action","createUpdate");
					$('#orgActive').removeAttr("disabled");
					$('#addressRoleForm').submit();
					//$("#remarks").val('');
				}
			}
			else if(!($("#addressRoleId").val() == null || $("#addressRoleId").val() == "" ||
					(
							/*($("#sourceXRefCountForAROL").val() == null || $("#sourceXRefCountForAROL").val() == ""|| $("#sourceXRefCountForAROL").val() == 0) &&*/
						($("#mailingListAssociationCount").val() == null || $("#mailingListAssociationCount").val() == ""|| $("#mailingListAssociationCount").val() == 0) &&
						($("#destinationXRefCountForAROL").val() == null || $("#destinationXRefCountForAROL").val() == ""|| $("#destinationXRefCountForAROL").val() == 0) &&
						($("#bookingTemplateCount").val() == null || $("#bookingTemplateCount").val() == ""|| $("#bookingTemplateCount").val() == 0)
					)))
			{
				if(/*($("#sourceXRefCountForAROL").val() == null || $("#sourceXRefCountForAROL").val() == ""|| $("#sourceXRefCountForAROL").val() == 0) &&*/
						($("#destinationXRefCountForAROL").val() == null || $("#destinationXRefCountForAROL").val() == ""|| $("#destinationXRefCountForAROL").val() == 0))
				{
					
					$('#isActiveDiv').hide();
				}
				else
				{
					$('#isActiveDiv').show();
				}
				$('#affectedCount').dialog('open');
			}
			else
			{
				submitAllSelect();
				$('#addressRoleForm').attr("action","createUpdate");
				$('#addressRoleForm').submit();
				//$("#remarks").val('');
			}
			
    	}
		$('#orgActive').attr("disabled","disabled");
		return false;
    });
	
	$('#invalidatedCount').dialog({
		autoOpen: false,
		width: 510,
		modal: true
	});
		// Success Dialog Link
		$('#successButton').click(function(){
			$('#invalidatedCount').dialog("close");
			submitAllSelect();
			$('#addressRoleForm').attr("action","createUpdate");
			$('#addressRoleForm').submit();
			return false;
		});	
		// Success Dialog Link
		$('#cancelButton').click(function(){
			$('#invalidatedCount').dialog("close"); 
			document.location.href = _context + "/addressRole/edit?addressRoleId="+$("#addressRoleId").val();
			return false;
		});	
		
	
	// Dialog			
	$('#affectedCount').dialog({
		autoOpen: false,
		width: 510,
		modal: true
	});
	
	// Dialog Link
	$('#updateAccounts').click(function(){
		$('#affectedCount').dialog("close"); 
		submitAllSelect();
		$('#addressRoleForm').attr("action","createUpdate");
		$('#addressRoleForm').submit();
		return false;
	});
	// Dialog Link
	$('#updateCancel').click(function(){
		$('#orgActive').attr('disabled','disabled');
		$('#affectedCount').dialog("close"); 
		return false;
	});
	if($("#invalidSourceXRefCount").val() > 0 || 
			$("#invalidDestinationXRefCount").val() > 0  || 
			$("#invalidBillingOptionsCount").val() > 0  || 
			$("#invalidBillPrintOptionsCount").val() > 0  || 
			$("#invalidWebAuthsCount").val() > 0)
	{
		$('#invalidatedCount').dialog('open');
	}
		
	tabSequence('#addressRoleForm');
	
});