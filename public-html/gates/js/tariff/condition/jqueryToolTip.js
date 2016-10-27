$(document).ready(function() {
	$('.toolTip').hover(
		function() {
		this.tip = this.title;
		$(this).append(
			'<div class="toolTipWrapper">'
				+'<div class="toolTipTop"></div>'
				+'<div class="toolTipMid">'
					+this.tip
				+'</div>'
				+'<div class="toolTipBtm"></div>'
			+'</div>'
		);
		this.title = "";
		this.width = $(this).width();
		$(this).find('.toolTipWrapper').css({left:this.width-22})
		$('.toolTipWrapper').fadeIn(300);
	},
	function() {
		$('.toolTipWrapper').fadeOut(100);
		$(this).children().remove();
			this.title = this.tip;
		}
	);
});