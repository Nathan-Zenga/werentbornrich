const express = require("express");
const router = express.Router();
const showProducts = require("../config/show-products-callback");
let s3 = null;

if (process.env.PWD) {
	require('dotenv').config()
} else {
	s3 = new require('aws-sdk').s3({DB: process.env.DB})
}

router.get("/", (req, res) => { res.render("index") });
router.get("/products", showProducts);
router.get("/products/:product", showProducts);
router.get("/our-story", (req, res) => { res.render("about") });
router.get("/contact", (req, res) => { res.render("contact") });

router.get("/product/:id", (req, res) => {
	const Shopify = new require("shopify-node-api")({
		shop: 'werentbornrichteststore.myspotify.com',
		shopify_api_key: process.env.SHOPIFY_API_KEY,
		shopify_shared_secret: process.env.SHOPIFY_API_SECRET,
		access_token: process.env.SHOPIFY_ACCESS_TOKEN
	});

	Shopify.get("/admin/products/" + req.params.id + ".json", null, function(err, data, headers){
		if (err || data.errors) {
			res.redirect("/error")
		} else {
			res.render("product-view", { product: data.product })
		}
	});
});

router.get("/error", (req, res) => { res.status(404).render("error") });
router.get("*", (req, res) => { res.redirect("/error") });

module.exports = router;