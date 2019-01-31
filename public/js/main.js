$(function(){
	$.fn.riseIn = function(milli, cb){
		milli = milli || 400;
		if (this.css("display") == "none" || this.css("opacity") == "0") {
			this
			.css({
				display: "block",
				opacity: 0,
				marginTop: "50px"
			})
			.animate({
				marginTop: 0,
				opacity: 1
			}, milli, function() {
				$(this).css({
					marginTop: ""
				});
				if (cb) cb();
			});
		}
		return this;
	}

	$(".menu").click(function(){
		$("nav .link-group").slideDown(null, "easeOutExpo");
	});

	$(".close-menu").click(function(){
		$("nav .link-group").slideUp(null, "easeInExpo", function() {
			$(this).css("display", "");
		});
	});

	$("nav .link").click(function(e){
		if (window.innerWidth < 768 && $(this).hasClass("expand")) {
			e.preventDefault();
			$("." + this.id + "-sublist").stop().slideToggle();
		}
	})

	// bg auto-playing slideshow
	$("#index-reel > div:gt(0)").hide();
	setInterval(function() {
		$('#index-reel > div:first')
			.next()
			.show()
			.end()
			.fadeOut(2000)
			.appendTo('#index-reel');
	}, 4000);

	$(".products .thumb").each(function(i) {
		$(this).delay(i * 200).riseIn(1000)
	});

	$(".enlarge-img").click(function() {
		var img = $(this).parent().css("background-image");
		$("#imageView .image").css("background-image", img);
	});
});