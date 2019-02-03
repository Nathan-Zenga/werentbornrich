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
const extendSession = (req, res, next) => {
	var hour = 3600000;
	req.session.cookie.expires = new Date(Date.now() + hour);
	req.session.cookie.maxAge = hour;
	next();
}

router.get("/", showProducts);
router.get("/:product", showProducts);

router.get("/p/:id", (req, res, next) => {
	Shopify.get("/admin/products/" + req.params.id + ".json", null, function(err, data, headers){
		if (err || data.errors) {
			console.log();
			console.log(JSON.stringify(next));
			console.log();
			next()
		} else {
			res.render("product-view", {
				headingTitle: data.product.title,
				product: data.product
			})
		}
	});
});

router.post("/add-to-cart", extendSession, (req, res) => {
	if (!req.body.variantID) return res.send("Please select size");
	if (!req.session.items) req.session.items = [];

	req.session.items.push({
		productID: req.body.productID,
		variantID: req.body.variantID
	});

	res.send(req.session.items.length.toString());
});

router.post("/remove-from-cart", extendSession, (req, res) => {
	var index;
	req.session.items.forEach((item, i) => {
		if (item.variantID === req.body.variantID) {
			index = i;
		}
	});

	req.session.items.splice(index, 1);
	res.send(req.session.items.length.toString());
});

module.exports = router;