const express = require("express");
const router = express.Router();
const showProducts = require("../config/show-products-callback");
const Shopify = require("../config/shopify-node-api-config")();
const splitPerRow = require("../config/split-per-row");
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
	let itemExists = false;

	req.session.items.forEach((item, i) => {
		if (item.variantID === req.body.variantID) {
			itemExists = true;
			req.session.items[i].quantity += 1;
		}
	});

	if (!itemExists) {
		req.session.items.push({
			variantID: req.body.variantID,
			quantity: 1
		});
	}

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

router.post("/item-quantity", extendSession, (req, res) => {
	let new_quantity;
	let increment = parseInt(req.body.incr);
	let itemRemoved = false;

	req.session.items.forEach((item, i) => {
		if (item.variantID === req.body.variantID) {
			req.session.items[i].quantity += increment;
			new_quantity = req.session.items[i].quantity;
			if (req.session.items[i].quantity < 1) {
				req.session.items.splice(i, 1);
				itemRemoved = true;
			}
		}
	});

	res.send({
		new_cart_count: req.session.items.length.toString(),
		new_quantity,
		itemRemoved
	});
});

router.post("/search", (req, res) => {
	Shopify.get("/admin/products.json", null, function(err, data) {
		if (err) return err;
		var valAutocomplete = req.body.valAutocomplete;
		var valFinal = req.body.valFinal;
		var results = [];
		if (valAutocomplete) {
			data.products.forEach(product => {
				let regex = RegExp(valAutocomplete, "i");

				if (regex.test(product.product_type)) {
					results.push({
						text: product.product_type
					})
				}
				if (regex.test(product.title)) {
					results.push({
						text: product.title,
						product_id: product.id
					})
				}
			});
			res.send(results);
		} else if (valFinal) {
			data.products.forEach(product => {
				let regex = RegExp(valFinal, "i");
				if (regex.test(product.product_type) || regex.test(product.title)) {
					results.push(product)
				}
			});

			req.session.searchResults = results;
			req.session.input = valFinal;
			res.end("/products");
		} else {
			res.end();
		}
	});
});

module.exports = router;