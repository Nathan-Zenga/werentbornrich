const aws = require('aws-sdk');
let s3 = null;

require('dotenv').config()

module.exports = function() {
	s3 = new aws.S3({
		apiKey: process.env.SHOPIFY_API_KEY,
		apiSecret: process.env.SHOPIFY_API_SECRET,
		access_token: process.env.SHOPIFY_ACCESS_TOKEN,
		authUser: process.env.NODEMAILER_AUTH_EMAIL,
		authPass: process.env.NODEMAILER_AUTH_PASS,
		stripePK: process.env.STRIPE_PUBLIC_KEY,
		stripeSK: process.env.STRIPE_PRIVATE_KEY
	});

	const variables = {
		apiKey: process.env.SHOPIFY_API_KEY,
		apiSecret: process.env.SHOPIFY_API_SECRET,
		access_token: process.env.SHOPIFY_ACCESS_TOKEN,
		authUser: process.env.NODEMAILER_AUTH_EMAIL,
		authPass: process.env.NODEMAILER_AUTH_PASS,
		stripePK: process.env.STRIPE_PUBLIC_KEY,
		stripeSK: process.env.STRIPE_PRIVATE_KEY
	};

	return variables
}
