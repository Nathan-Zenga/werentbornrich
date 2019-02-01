const express = require("express");
const router = express.Router();
const env = require("../config/env")();
const shopifyAPI = require("shopify-node-api");

router.get("/", (req, res) => { res.render("index") });
router.get("/our-story", (req, res) => { res.render("about") });
router.get("/contact", (req, res) => { res.render("contact") });
router.get("/cart", (req, res) => {
	const Shopify = new shopifyAPI({
		shop: 'werentbornrichteststore.myspotify.com',
		shopify_api_key: env.apiKey,
		shopify_shared_secret: env.apiSecret,
		access_token: env.access_token
	});

	Shopify.get("/admin/products/.json", null, function(err, data, headers){
		if (err) return err;

		var cart_items = [];

/*		data.products.forEach(product => {
			req.session.items.forEach(item => {
				if (product.id === item.productID) {
					product.variants.forEach(variant => {
						if (variant.id === item.variantID) {
							cart_items.push(variant);
						}
					})
				}
			})
		});
*/
		res.send(data);
		// res.render("cart", { items: cart_items });
	});
});

router.get("/error", (req, res) => { res.render("error") });

module.exports = router;