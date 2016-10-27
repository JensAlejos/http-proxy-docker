$(document).ready(function () {
	
	colNamesForRateGrid=['id','message','edit'];
	                    
	colModelForRateGrid=[
	            {name:'id',index:'id', width:40, editable:false,hidden:true},
		   		{name:'message',index:'message', width:50, align:"center", editable:true, hidden:false },
		   		{name:'edit', index:'edit', width:20, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
		   	];
		   	
		   	createGrid(
					"gridId", // grid id for user
					"pagerId", // page id for user
					'/gates/condition/replicate/loadGrid', 
					'',
					'',
					'',
					'',
					colNamesForRateGrid, 
					colModelForRateGrid, 
					"",
					70,
					3,
					[3,6,9],
					true,
					true,
					true);
});