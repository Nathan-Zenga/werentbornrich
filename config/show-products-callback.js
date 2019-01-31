const splitPerRow = require("../config/split-per-row");
const shopifyAPI = require("shopify-node-api");

module.exports = (req, res) => {

	var Shopify = new shopifyAPI({
		shop: "werentbornrichteststore.myspotify.com",
		shopify_api_key: process.env.SHOPIFY_API_KEY,
		shopify_shared_secret: process.env.SHOPIFY_API_SECRET,
		access_token: process.env.SHOPIFY_ACCESS_TOKEN
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