/**
 * This method helps the user to select the 
 * predictive value on tab out or change of predictive
 * after a specified result is matched
*/


//Global variables 

var ssCode = null;
	var dataName =  null;
	var ssCodeList=new Array();
	var dataNameList=new Array();
	var counter=0;
	
//function for Predictive Auto Select
function predictiveAutoSelect(valueReceived)
{
	var value=valueReceived;
	if(ssCode==null ||ssCode==""){
		value=""; 
    	counter=0;
    	ssCodeList=new Array();
		dataNameList=new Array();
	}
	else if(counter==1){ 
		var index=ssCodeList.indexOf(value.toUpperCase());
		if(index!=-1)
			{
			value=(dataNameList[index]);	
			ssCode="";
			counter=0;
			ssCodeList=new Array();
			dataNameList=new Array();
			}
	}
	else if(counter>1)
		{
		var index=ssCodeList.indexOf(value.toUpperCase());
		if(index!=-1)
			{
			value=dataNameList[index];	
			ssCode="";
			counter=0;
			ssCodeList=new Array();
			dataNameList=new Array();
			}
		}
	else
		{
			value="";
			counter=0;
			ssCodeList=new Array();
			dataNameList=new Array();
		}
	counter=0;
	ssCodeList=new Array();
	dataNameList=new Array();
	return value;
}