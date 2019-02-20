const splitPerRow = require("./split-per-row");
const Shopify = require("./shopify-node-api-config");

// for routes "/products" or "/products/:product"
module.exports = (req, res, next) => {
	Shopify().get("/admin/products.json", null, function(err, data) {
		if (err) return res.send(err);

		let typeParam = req.params.product;
		let filteredList = [];

		if (typeParam) {
			data.products.forEach(product => {
				if (typeParam.includes(product.product_type)) filteredList.push(product);
			});
		}

		let arr = filteredList.length ? filteredList : data.products;
		let headingTitle = typeParam && filteredList.length ? typeParam : req.originalUrl === "/products" ? "Products" : null;

		if (headingTitle) {
			res.render("products", {
				headingTitle: headingTitle,
				products: splitPerRow(arr, 3)
			})
		} else {
			next()
		}
	});

}