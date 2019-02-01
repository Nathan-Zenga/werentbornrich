const splitPerRow = require("../config/split-per-row");
const shopifyAPI = require("shopify-node-api");
const aws = require('aws-sdk');
let s3 = null;

if (process.env.SHOPIFY_API_KEY) {
	require('dotenv').config()
} else {
	s3 = new aws.S3({
		apiKey: process.env.SHOPIFY_API_KEY,
		apiSecret: process.env.SHOPIFY_API_SECRET,
		access_token: process.env.SHOPIFY_ACCESS_TOKEN
	})
}

const apiKey = process.env.SHOPIFY_API_KEY || s3.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET || s3.SHOPIFY_API_SECRET;
const access_token = process.env.SHOPIFY_ACCESS_TOKEN || s3.SHOPIFY_ACCESS_TOKEN;

module.exports = (req, res) => {

	var Shopify = new shopifyAPI({
		shop: "werentbornrichteststore.myspotify.com",
		shopify_api_key: apiKey,
		shopify_shared_secret: apiSecret,
		access_token: access_token
	});

	Shopify.get("/admin/products.json", null, function(err, data) {
		if (err) return res.send(err);

		let typeParam = req.params.product;
		let filteredList = [];

		if (typeParam) {
			data.products.forEach(product => {
				if (typeParam.includes(product.product_type)) filteredList.push(product);
			});
		}

		let arr = filteredList.length ? filteredList : data.products;
		let headingTitle = typeParam && filteredList.length ? typeParam : req.path === "/products" ? "Products" : null;

		if (headingTitle) {
			res.render("products", {
				headingTitle: headingTitle,
				products: splitPerRow(arr, 3)
			})
		} else {
			res.redirect("/error");
		}
	});

}