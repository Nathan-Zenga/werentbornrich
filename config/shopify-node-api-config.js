const shopifyAPI = require("shopify-node-api");
const env = require("./env")();

module.exports = () => {
	return new shopifyAPI({
		shop: "werentbornrichteststore.myspotify.com",
		shopify_api_key: env.apiKey,
		shopify_shared_secret: env.apiSecret,
		access_token: env.access_token,
		verbose: false
	});
};
