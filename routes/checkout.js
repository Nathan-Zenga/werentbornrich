const express = require("express");
const router = express.Router();
const env = require("../config/env")();
const stripe = require("stripe")(env.stripeSK);

router.post("/charge", (req, res, next) => {
	const amount = req.body.amount;
	const callback = (err, charge) => req.session.destroy(err => res.render("success", { headingTitle: "Checkout" }));
	
	if (req.session.items && req.session.items.length) {
		stripe.customers.create({
			email: req.body.stripeEmail,
			source: req.body.stripeToken
		})
		.then(customer => {
			stripe.charges.create({
				amount,
				description: "WBR Purchase",
				currency: "gbp",
				customer: customer.id
			});
		})
		.then(callback);
	} else {
		callback();
	}
});

module.exports = router;