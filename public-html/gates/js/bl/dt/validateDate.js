$(document).ready(function() {

  var billingOutgateDate=$('#billingOutgateDate').val();

     $('#billingOutgateDate').change(function() {
		var newbillingOutgateDate=$('#billingOutgateDate').val();			
		var isValidateDate= isValidDate(newbillingOutgateDate);

		if(isValidateDate!=null )	
		{
			$('#billingOutgateDate').val(isValidateDate);
			return true;	
		}		
		else		
		{		
			if(newbillingOutgateDate!=null && newbillingOutgateDate!='')	
			{		
			alert('Billing Outgate Date entered is not a valid Date.Enter date in Format(MM-dd-yyyy)');		
			$('#billingOutgateDate').val(billingOutgateDate);		
			}			
			else		
			{		
			$('#billingOutgateDate').val(billingOutgateDate);		
			}
		
		}				
	});

     var billingIngateDate=$('#billingIngateDate').val();

     $('#billingIngateDate').change(function() {
		var newbillingIngateDate=$('#billingIngateDate').val();			
		var isValidateDate= isValidDate(newbillingIngateDate);

		if(isValidateDate!=null )	
		{
			$('#billingIngateDate').val(isValidateDate);
			return true;	
		}		
		else		
		{		
			if(newbillingIngateDate!=null && newbillingIngateDate!='')	
			{		
			alert('Billing Ingate Date entered is not a valid Date.Enter date in Format(MM-dd-yyyy)');		
			$('#billingIngateDate').val(billingIngateDate);		
			}			
			else		
			{		
			$('#billingIngateDate').val(billingIngateDate);		
			}
		
		}				
	});

     
     


}); 

function isValidDate(date)
{
		var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
		var validDate=false;
		

	    var len1=date.length;

	 //   alert('matches:'+matches);

		if (matches == null) 		
		{			
			if(len1<'8' && len1>'10')
			{
				return false;
			}
			if(len1=='0'){
				return date;
			}
			if(len1=='8')
			{	
				var dt1  = date.substring(2,4); 
			    var mon1 = date.substring(0,2); 
			    var mn=mon1-1;
			    var yr1  = date.substring(4,8);
				var composedDate = new Date(yr1, mn,dt1 );		
				validDate=composedDate.getDate() == dt1 &&
				
				composedDate.getMonth() == mn &&
				
				composedDate.getFullYear() == yr1;

				if(validDate)		
				{	var newDate=mon1+"-"+dt1+"-"+yr1;
					
					return newDate;		
				}				
				else		
				{
					return null;				
				}				
			}
	
		}
		else
		{
			var d = matches[2];
			var m = matches[1] - 1;
			var y = matches[3];
			
			var composedDate = new Date(y, m, d);			
			  
			validDate=composedDate.getDate() == d &&
			
			composedDate.getMonth() == m &&
			
			composedDate.getFullYear() == y;
			
			if(validDate)		
			{	
				var newDate=matches[1]+"-"+d+"-"+y;
				return newDate;		
			}
			
			else		
			{
				return null;
			
			}
		}



}

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}
