const express = require("express");
const router = express.Router();
const showProducts = require("../config/show-products-callback");
const env = require("../config/env")();
const shopifyAPI = require("shopify-node-api");
const Shopify = new shopifyAPI({
	shop: 'werentbornrichteststore.myspotify.com',
	shopify_api_key: env.apiKey,
	shopify_shared_secret: env.apiSecret,
	access_token: env.access_token
});

router.get("/", showProducts);
router.get("/:product", showProducts);

router.get("/p/:id", (req, res) => {
	Shopify.get("/admin/products/" + req.params.id + ".json", null, function(err, data, headers){
		if (err || data.errors) {
			res.redirect("/error")
		} else {
			res.render("product-view", { product: data.product })
		}
	});
});

router.post("/add-to-cart", (req, res) => {
	if (!req.body.size) return res.send("Please select size");
	if (!req.session.items) req.session.items = [];

	req.session.items.push({
		productID: req.body.productID,
		variantID: req.body.variantID
	});

	res.send(req.session.items.length.toString());
});

module.exports = router;