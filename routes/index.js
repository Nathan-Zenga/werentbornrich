const express = require("express");
const router = express.Router();
const env = require("../config/env")();
const shopifyAPI = require("shopify-node-api");

router.get("/", (req, res) => { res.render("index", {headingTitle: null}) });
router.get("/our-story", (req, res) => { res.render("about", {headingTitle: "Our Story"}) });
router.get("/contact", (req, res) => { res.render("contact", {headingTitle: "Contact"}) });
router.get("/cart", (req, res) => {
	const Shopify = new shopifyAPI({
		shop: 'werentbornrichteststore.myspotify.com',
		shopify_api_key: env.apiKey,
		shopify_shared_secret: env.apiSecret,
		access_token: env.access_token
	});

	Shopify.get("/admin/products/.json", null, function(err, data, headers){
		if (err) return err;

		res.render("cart", {
			headingTitle: "Cart",
			products: data.products,
			cart_items: req.session.items
		});
	});
});

router.get("/list", (req, res) => {
	const Shopify = new shopifyAPI({
		shop: 'werentbornrichteststore.myspotify.com',
		shopify_api_key: env.apiKey,
		shopify_shared_secret: env.apiSecret,
		access_token: env.access_token
	});

	Shopify.get("/admin/products/.json", null, function(err, data, headers){
		if (err) return err;
		res.send(data);
	});
});

router.get("*", (req, res) => {
	res.status(404).render("error", {
		headingTitle: "Error 404"
	})
});

module.exports = router;