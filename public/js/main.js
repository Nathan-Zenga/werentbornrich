$(function(){
	$(".menu").click(function(){
		$("nav .link-group").slideDown(null, "easeOutExpo");
	});

	$(".close-menu").click(function(){
		$("nav .link-group").slideUp(null, "easeOutExpo", function() {
			$(this).css("display", "");
		});
	});

	// bg auto-playing slideshow
	$("#bgreel > div:gt(0)").hide();
	setInterval(function() {
		$('#bgreel > div:first')
			.delay(1000)
			.fadeOut(2000)
			.next()
			.fadeIn(2000)
			.end()
			.appendTo('#bgreel');
	}, 5000);
});