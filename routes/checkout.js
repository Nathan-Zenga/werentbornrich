const express = require("express");
const router = express.Router();
const env = require("../config/env")();
const stripe = require("stripe")(env.stripeSK);

router.post("/charge", (req, res, next) => {
	const amount = req.body.amount;
	
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
	.then((err, charge) => res.redirect("/checkout/success"));
});

router.get("/success", (req, res, next) => {
	res.render("success", {
		headingTitle: "Checkout"
	})
});

module.exports = router;