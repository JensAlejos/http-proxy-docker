$(document).ready(function () {
	
	colNamesForRateGrid2=['id','message','edit'];
	                    
	colModelForRateGrid2=[
	            {name:'id',index:'id', width:40, editable:false,hidden:true},
		   		{name:'message',index:'message', width:50, align:"center", editable:true, hidden:false },
		   		{name:'edit', index:'edit', width:20, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
		   	];
		   	
		   	createGrid(
					"gridId2", // grid id for user
					"pagerId2", // page id for user
					'/gates/condition/replicate/loadGrid2', 
					'',
					'',
					'',
					'',
					colNamesForRateGrid2, 
					colModelForRateGrid2, 
					"",
					70,
					3,
					[3,6,9],
					true,
					true,
					true);
});