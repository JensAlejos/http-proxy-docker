$(document).ready(function() {
	
	$('input[type="button"][value="Edit"]').removeClass("formButton").addClass("buttonNoFloat");
	$('input[type="button"][value="Delete"]').removeClass("formButton").addClass("buttonNoFloat");
	
/*	if ($('#isTypeTranslate').val() == "true") {
		 
		$('input[type="button"][value="Delete"]').hide();
	}*/
	

	
	//- RefData List: Hide columns corresponding to codeDescription, activeBoolean, true, false
	$('th a', 'table.displaytagholder').each(function(index) {
    var linkText = $(this).html();
    if (linkText == "CodeDescription" || linkText == "ActiveBoolean" || linkText == "True" || linkText == "False") {
    	$('td:nth-child(' + (index+1) + '),th:nth-child(' + (index+1) + ')', 'table.displaytagholder').hide();
    }
    
    
    
	});
	
	
	if ($("select[name='object']").val() == 'com.matson.gates.refdata.domain.EmailTemplate') {
		
		$table = $('.displaytagtable');
		
		// 0, 1, 6, 7 , 11, 13, 14, 16, 17, 20
		
		hideCol($table, 0);
		hideCol($table, 1); //ActiveBoolean
		hideCol($table, 3); //CreateDate
		hideCol($table, 4); //CreateUser
		//hideCol($table, 5); //EmailBody
		hideCol($table, 6); //EmailCC
		hideCol($table, 10); // False
		hideCol($table, 19); // True
		moveCol($table, 20, 0);
		moveCol($table, 18, 2);
		moveCol($table, 19, 5);
		moveCol($table, 11, 9);
		/*
		//hideCol($table, 13);
		//hideCol($table, 14);


		moveCol($table, 5, 18);
		moveCol($table, 5, 18);
		
		
		*/

		$('a:contains("Module")').text('Application');
		$('a:contains("UniqueRefId")').text('');
		
	}
	
});  // ready method end

function hideCol($table, myIndex){
	$table.find("tr").each(function(){
		$(this).find("th:eq("+myIndex+"), td:eq("+myIndex+")").not('.footer').hide();
	});
}

function moveCol($table, fromIndex, toIndex){
	$table.find("tr").each(function(){
		;
		$(this).find("th:eq("+toIndex+")").before($(this).find("th:eq("+fromIndex+")"));
		$(this).find("td:eq("+toIndex+")").before($(this).find("td:eq("+fromIndex+")"));
	});
}

