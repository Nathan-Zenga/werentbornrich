const aws = require('aws-sdk');
let s3 = null;

require('dotenv').config()

module.exports = function() {
	s3 = new aws.S3({
		apiKey: process.env.SHOPIFY_API_KEY,
		apiSecret: process.env.SHOPIFY_API_SECRET,
		access_token: process.env.SHOPIFY_ACCESS_TOKEN
	});

	const variables = {
		apiKey: process.env.SHOPIFY_API_KEY,
		apiSecret: process.env.SHOPIFY_API_SECRET,
		access_token: process.env.SHOPIFY_ACCESS_TOKEN
	};

	return variables
}
