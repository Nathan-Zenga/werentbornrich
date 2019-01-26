const express = require('express');
const router = express.Router();
const dotenv = require("dotenv");
const crypto = require("crypto");
const cookie = require("cookie");
const nonce = require("nonce");
const querystring = require("querystring");
const request = require("request-promise");
const shopifyAPI = require("shopify-node-api");

require('dotenv').config();

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'write_products';

// replacing actual forwarding address
const forwardingAddress = "http://9cc144f3.ngrok.io";

router.get('/', (req, res) => {
	const shop = req.query.shop;
	if (shop) {

		const state = nonce()();
		const Shopify = new shopifyAPI({
			shop: shop,
			shopify_api_key: apiKey,
			shopify_shared_secret: apiSecret,
			shopify_scope: scopes,
			redirect_uri: forwardingAddress + "/shopify/callback",
			nonce: state
		});

		res.cookie("state", state);
		res.redirect(Shopify.buildAuthURL());
	} else {
		return res.status(400).send("missing shop parameters. Please add '?shop=your-dev-shop.myspotify.com' to your request")
	}
});

// route for when unlisted app is installed (redirected)
router.get("/callback", (req, res) => {
	const { shop, hmac, code, state } = req.query;
	const stateCookie = cookie.parse(req.headers.cookie).state;

	if (state !== stateCookie) {
		return res.status(403).send('Request origin cannot be verified');
	}

	if (shop && hmac && code) {
		// DONE: Validate request is from Shopify
		const map = Object.assign({}, req.query);
		delete map['hmac'];
		const message = querystring.stringify(map);
		const generatedHash = crypto
			.createHmac('sha256', apiSecret)
			.update(message)
			.digest('hex');

		if (generatedHash !== hmac) {
			return res.status(400).send('HMAC validation failed');
		}

		// DONE: Exchange temporary code for a permanent access token
		const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
		const accessTokenPayload = {
			client_id: apiKey,
			client_secret: apiSecret,
			code
		};

		console.log("before accessToken");
		request.post(accessTokenRequestUrl, { json: accessTokenPayload })
		.then(accessTokenResponse => {
			const accessToken = accessTokenResponse.access_token;

			console.log("accessToken: " + accessToken);

			// DONE: Use access token to make API call to 'products' endpoint
			const shopRequestUrl = 'https://' + shop + '/products.json';
			const shopRequestHeader = { 'X-Shopify-Access-Token': accessToken };

			request.get(shopRequestUrl, { headers: shopRequestHeader })
			.then(apiResponse => {
				res.status(200).end(apiResponse);
			})
			.catch(error => {
				res.status(error.statusCode).send(error.error.error_description);
			});
		})
		.catch(error => {
			res.status(error.statusCode).send(error.error.error_description);
		});

	} else {
		res.status(400).send('Required parameters missing');
	}
});

module.exports = router;