const splitPerRow = require("./split-per-row");
const Shopify = require("./shopify-node-api-config");

// for routes "/products" or "/products/:product"
module.exports = (req, res, next) => {
	Shopify().get("/admin/products.json", null, function(err, data) {
		if (err) return res.send(err);

		let arr;
		let headingTitle;

		if (!req.session.searchResults && !req.session.input) {
			let typeParam = req.params.product;
			let filteredList = [];

			if (typeParam) {
				data.products.forEach(product => {
					if (typeParam.includes(product.product_type)) filteredList.push(product);
				});
			}

			arr = filteredList.length ? filteredList : data.products;
			headingTitle = typeParam && filteredList.length ? typeParam : req.originalUrl === "/products" ? "Products" : null;
		} else {
			arr = req.session.searchResults;
			headingTitle = "Search Results: " + req.session.input;
		}

		if (headingTitle) {
			res.render("products", {
				headingTitle: headingTitle,
				products: splitPerRow(arr, 3)
			}, (err, html) => {
				if (err) return err;
				req.session.searchResults = undefined;
				req.session.input = undefined;
				res.send(html);
			})
		} else {
			next()
		}
	});

}