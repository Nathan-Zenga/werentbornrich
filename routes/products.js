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
};

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
		req.session.items.unshift({
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

router.post("/search/autocomplete", (req, res) => {
	Shopify.get("/admin/products.json", null, function(err, data) {
		if (err) return err;
		var inputValue = req.body.inputValue;
		var value = inputValue.toLowerCase().replace(/[ -]/g, "");
		var results = [];
		if (value) {
			data.products.forEach(product => {
				let type = product.product_type.toLowerCase().replace(/[ -]/g, "");
				let title = product.title.toLowerCase().replace(/[ -]/g, "");
				let regex = RegExp(value, "i");
				let titleArr = product.title.split(" ")
				let foundTitle = false;
				let lastInitialIndex;

				if (value[0] == type[0] && regex.test(type)) {
					results.push({
						text: product.product_type,
						category: true
					})
				}

				titleArr.forEach(word => {
					word = word.toLowerCase().replace(/[ -]/g, "");
					if (value[0] == word[0] && word.includes(value)) {
						foundTitle = true;
						results.push({
							text: product.title,
							product_id: product.id
						});
					} else if (value[0] == word[0]) {
						lastInitialIndex = title.indexOf(word);
					}
				});

				if (!foundTitle) {
					if (value[0] == title[lastInitialIndex] && (title.includes(value) || inputValue.toLowerCase().replace(/-/g, "").includes(product.title.toLowerCase().replace(/-/g, "")))) {
						results.push({
							text: product.title,
							product_id: product.id
						})
					}
				}
			});

			// reserving unique values only
			for(var i = 0; i < results.length; i++) {
				let count = 0;
				let target = results[i].text;
				for(var j = 0; j < results.length; j++) {
					if (results[j].text === target) count += 1;
				}
				if (count > 1) results.splice(i, 1);
			}

			res.send(results);
		} else {
			res.end();
		}
	});
});

router.get("/search/results", (req, res) => {
	Shopify.get("/admin/products.json", null, function(err, data) {
		if (err) return err;
		var query = req.query.q.replace(/[+]/g, " ");
		var results = [];
		if (query && query.replace(/ /g, "")) {
			data.products.forEach(product => {
				let regex = RegExp(query, "i");
				if (regex.test(product.product_type) || regex.test(product.title)) {
					results.push(product)
				}
			});

			res.render("products", {
				headingTitle: "Search Results: " + query,
				products: splitPerRow(results, 3)
			})
		} else {
			res.render("products", {
				headingTitle: "No Results",
				products: []
			})
		}
	});
});

module.exports = router;