const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Shopify = require("../config/shopify-node-api-config")();
const env = require("../config/env")();

router.get("/", (req, res) => res.render("index", {pagename: "homescreen index", headingTitle: null}));
router.get("/our-story", (req, res) => res.render("about", {pagename: "our-story", headingTitle: "Our Story"}));
router.get("/contact", (req, res) => res.render("contact", {pagename: "contact", headingTitle: "Contact"}));
router.get("/cart", (req, res) => {
	Shopify.get("/admin/products.json", null, function(err, data, headers){
		if (err) return err;
		res.render("cart", {
			pagename: "cart-view",
			headingTitle: "Cart",
			products: data.products,
			cart_items: req.session.items ? req.session.items : [],
			pk: env.stripePK
		});
	});
});

router.get("/list", (req, res) => {
	Shopify.get("/admin/products.json", null, function(err, data, headers){
		if (err) return err;
		res.send(data);
	});
});

router.get("*", (req, res) => {
	res.status(404).render("error", {
		pagename: "error",
		headingTitle: "Error 404"
	})
});

router.post('/send/message', (req, res) => {
	let empty = false;
	for (var k in req.body) if (req.body[k] === '') empty = true;
	if (empty) return res.send({err: "Please fill in the missing field(s)"});

	let isEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(req.body.email);
	if (!isEmail) return res.send({err: "Please enter a valid email address"});

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 465,
		secure: true,
		auth: {
			user: env.authUser,
			pass: env.authPass
		},
		tls: {
			rejectUnauthorized: true
		}
	});

	let mailOptions = {
		from: `"${req.body.name}" <${req.body.email}>`,
		to: 'admin@werentbornrich.com',
		subject: req.body.subject,
		text: `From ${req.body.name} (${req.body.email}):\n\n${req.body.message}`
	};

	transporter.sendMail(mailOptions, function(err, info) {
		if (err) return console.log(err), res.send("Could not send message");
		console.log("The message was sent!");
		console.log(info);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		res.send('Message sent');
	});
});

module.exports = router;