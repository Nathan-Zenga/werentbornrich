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
		if (window.innerWidth < 992 && $(this).hasClass("expand")) {
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
		var button = $(this);
		var originalText = button.val();
		let form = button.parent("form");
		let data = {
			productID: form.data("product-id"),
			variantID: form.find("select").val()
		}

		$.post("/products/add-to-cart", data, function(val) {
			var selector = isNaN(val) ? ".err-msg" : ".cart .count";
			$(selector).text(val);
			if (isNaN(val)) {
				$(selector).delay(3000).fadeOut(function(){
					$(this).text("").css("display", "");
				});
			} else {
				button.val("ITEM ADDED TO CART").delay(2000).show(0, function() { $(this).val(originalText) });
			}
		});
	});

	$(".cart-view .item-remove").click(function(e) {
		e.preventDefault();
		var item = $(this).closest(".item");
		var data = {
			variantID: item.data("variant-id"),
			productID: item.data("product-id")
		};

		$.post("/products/remove-from-cart", data, function(new_count) {
			$(".cart .count").text(new_count);
			item.slideUp();
			var newTotal = parseFloat($(".total .num-value").text()) - parseFloat(item.find(".item-price .num-value").text());
			$(".total .num-value").text(newTotal.toFixed(2));
		});
	});

	$(".contact form #submit").click(function(e) {
		e.preventDefault();
		var form = $(this).closest("form");
		var data = {};

		form.find(".details").each(function(){
			let name = this.getAttribute("name");
			data[name] = this.value;
		});

		$.post("/send/message", data, function(res) {
			let isErr = res.err !== undefined;
			res = isErr ? res.err : res;
			if (isErr === false) $("textarea, input").not(":submit").val("");
			$(".contact .result").hide().text(res).slideDown().delay(3000).slideUp(function(){
				$(this).text("").css("display", "")
			})
		});
	});
});