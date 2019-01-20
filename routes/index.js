var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	res.render('index')
});

router.get('/products', (req, res) => {
	res.render('products', {
		headingTitle: "Products",
		clothingSection: [
			[

				{ imgSrc: 'https://assets.bigcartel.com/product_images/224256073/3AA09521-E79A-4ACC-B38C-79FADCEE4F61.jpeg?auto=format&fit=max&w=900', 
				productName: 'WBR Classic Tee (White)',
				price: "13.50" },

				{ imgSrc: 'https://assets.bigcartel.com/product_images/224256073/3AA09521-E79A-4ACC-B38C-79FADCEE4F61.jpeg?auto=format&fit=max&w=900', 
				productName: 'WBR Classic Tee (White)',
				price: "13.50" },

				{ imgSrc: 'https://assets.bigcartel.com/product_images/224256073/3AA09521-E79A-4ACC-B38C-79FADCEE4F61.jpeg?auto=format&fit=max&w=900', 
				productName: 'WBR Classic Tee (White)',
				price: "13.50" }

			], [

				{ imgSrc: 'https://assets.bigcartel.com/product_images/224256073/3AA09521-E79A-4ACC-B38C-79FADCEE4F61.jpeg?auto=format&fit=max&w=900', 
				productName: 'WBR Classic Tee (White)',
				price: "13.50" },

				{ imgSrc: 'https://assets.bigcartel.com/product_images/224256073/3AA09521-E79A-4ACC-B38C-79FADCEE4F61.jpeg?auto=format&fit=max&w=900', 
				productName: 'WBR Classic Tee (White)',
				price: "13.50" }

			]
		]
	});
});

router.get('/products/:product', (req, res) => {
	res.render('products', {
		headingTitle: req.params.product,
		clothingSection: null
	})
});

router.get('/our-story', (req, res) => {
	res.render('about')
});

router.get('/contact', (req, res) => {
	res.render('contact')
});

module.exports = router;