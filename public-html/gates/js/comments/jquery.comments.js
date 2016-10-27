/**
 *    
 * 
 * jquery plugin for comments functionality.
 * It handle comment for all the screens
 *   
 * 
 */

(function( $ ){
	var methods = {
		init: function() {
		
		}
	};


	$.fn.comments = function(optionsParameter) {
		var defaults = {
			entityType: null,
			entityId: null,
			commentId: null,
			commentType: 'MEMO',
			displayCommentTypes: 'MEMO',
			displayCount: true,
			viewOnly: false,
			url: _context+'/comments',
			commentsFrame: 'commentsFrame',
			param1:'',
			commentTypesForGrid: '_blank',
			isDeleteAllowed: false,
			isEditAllowed: false
		};
		
		// Replacing options parameters to default values
		var options = $.extend({}, defaults, {}, optionsParameter);
		
		// To set comment count while loading of the screen
		return this.each(function() {
			var component=$(this);
			if ($("#"+options.commentId).val() && options.displayCount) {
				var commentsElement = this;
				//- $.ajax to get count

				$.getJSON(options.url + '/count/'+options.entityType+'/' + $("#"+options.commentId).val()+"/"+options.commentTypesForGrid+"/"+ options.displayCommentTypes, function(data) {
					
					//- set count field while loading of the screen
					if(data==-1) {
						$(component).hide();
					}
					//D020000, For Comments in dispatch
					else if(options.commentId != "bookingCommentId"){
						$('#count', component).html("("+data+")");
					}
					
				});
			}
			
			$(this).click(function() {
				$('form').validationEngine('hideAll');
				//- launch comments dialog
				//creating URL to open comment dialog
				var isDelete = "N";
				if(options.isDeleteAllowed)
					isDelete = "Y";
				var isEdit = "N";
				if(options.isEditAllowed)
					isEdit = "Y";
				var link = options.url + "/?entityType="+options.entityType		
							+ "&commentId=" + $("#"+options.commentId).val()
							+ "&entityId=" +options.entityId
							+ "&displayCommentTypes=" +options.displayCommentTypes
							+ "&viewOnly=" +options.viewOnly
							+ "&displayCount=" +options.displayCount
							+ "&commentsFrame=" + options.commentsFrame
							+ "&commentIdSelector=" + options.commentId
							+ "&param1=" + options.param1
							+ "&commentSelector=" + $(this).attr('id')
							+ "&commentTypesForGrid=" + options.commentTypesForGrid
							+ "&isDeleteAllowed=" + isDelete
							+ "&isEditAllowed=" + isEdit;
				var xErrorCoordinate = window.pageXOffset;
				var yErrorCoordinate = window.pageYOffset;
				$("#"+options.commentsFrame)
				.attr('src', link)
				.dialog({
					width : 883,
					height : 735,
					title : 'Comments',
					autoResize : true,
					modal: true,
					close:function( event, ui ) {
						if ($("#"+options.commentId).val() && options.displayCount) {
							var commentsElement = this;
							//- $.ajax to get count

							$.getJSON(options.url + '/count/'+options.entityType+'/' + $("#"+options.commentId).val()+"/"+options.commentTypesForGrid+"/"+ options.displayCommentTypes, function(data) {
									
								//- set count field while loading of the screen
								if(data==-1) {
									$(component).hide();
								}
								//D020000, For Comments in dispatch
								else if(options.commentId != "bookingCommentId"){
									$('#count', component).html("("+data+")");
								}
								
							});
						}
					}
				})
				.width(873);
				setTimeout(function(){
				window.scrollTo(xErrorCoordinate, yErrorCoordinate);
				}, 250);
				//- attach handlers to update count and commentId
				//- @see comments.jsp
			});

		});
	};
})( jQuery );


