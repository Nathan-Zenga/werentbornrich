$(function(){
	var randomRGBA = (a) => {
		a = a || 1;
		var arr = [];

		for (var i = 0; i < 3; i++) {
			arr.push(Math.round(Math.random() * 255));
		}

		arr = "rgba(" + arr.join(",") + "," + a + ")";
		return arr;
	};

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

	$("#add_to_cart").click(function(e) {
		e.preventDefault();
		let form = $(this).parent("form");
		let data = {
			productID: form.data("product-id"),
			size: form.find("select").val()
		}

		$.post("/products/add-to-cart", data, function(val) {
			var selector = isNaN(val) ? ".err-msg" : ".cart .count";
			$(selector).text(val);
			if (isNaN(val)) $(selector).delay(3000).fadeOut(function(){
				$(this).text("").css("display", "");
			});
		});
	});

	$(".cart-view .item * ").each(function() {
		$(this).css("background-color", randomRGBA());
	});
});