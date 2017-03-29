var bCrypt = require('bcrypt-nodejs');
var express = require('express');
var queryString = require('query-string');
var urlString = require("url");
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');
var isodate = require("isodate");
var Post = mongoose.model('Post');
var Product = mongoose.model('Product');
var CartData = mongoose.model('CartData');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var CustomMapper = require("./mapper.js");
console.log(CustomMapper);
//Used for routes that must be authenticated.
function isAuthenticated(req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if (req.method === "GET") {
		return next();
	}
	if (req.isAuthenticated()) {
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};
//Register the authentication middleware
router.use('/posts', isAuthenticated);
router.route('/posts')
	//creates a new post
	.post(function (req, res) {

		var post = new Post();
		post.text = req.body.text;
		post.created_by = req.body.created_by;
		post.save(function (err, post) {
			if (err) {
				return res.send(500, err);
			}
			return res.json(post);
		});
	})
	//gets all posts
	.get(function (req, res) {
		console.log('debug1');
		Post.find(function (err, posts) {
			console.log('debug2');
			if (err) {
				return res.send(500, err);
			}
			return res.send(200, posts);
		});
	});

//post-specific commands. likely won't be used
router.route('/posts/:id')

	//gets specified post
	.get(function (req, res) {
		Post.findById(req.params.id, function (err, post) {
			if (err)
				res.send(err);
			res.json(post);
		});
	})
	//updates specified post
	.put(function (req, res) {
		Post.findById(req.params.id, function (err, post) {
			if (err)
				res.send(err);

			post.created_by = req.body.created_by;
			post.text = req.body.text;

			post.save(function (err, post) {
				if (err)
					res.send(err);

				res.json(post);
			});
		});
	})
	//deletes the post
	.delete(function (req, res) {
		Post.remove({
			_id: req.params.id
		}, function (err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});



router.route('/products')

	.get(function (req, res) {
		var parts = urlString.parse(req.url, true);
		var username = parts.query['user'];

		if (username) {
			Product.find({ "vendor": username }, function (err, Product) {
				if (err) {
					return res.send(500, err);
				}
				return res.send(200, Product);
			});
		} else {
			Product.find(function (err, Product) {
				if (err) {
					return res.send(500, err);
				}
				return res.send(200, Product);
			});
		}
		console.log(username);

	})

	.post(function (req, res) {

		var product = CustomMapper.mapProduct(req.body);
		product.save(function (err, product) {
			if (err) {
				return res.send(500, err);
			}
			return res.json(product);
		});
	});

router.route('/products/:id')
	//gets specified Product
	.get(function (req, res) {
		Product.findById(req.params.id, function (err, result) {
			if (err)
				result.send(err);
			res.json(result);
		});
	})
	//updates specified post
	.put(function (req, res) {
		Product.findById(req.params.id, function (err, product) {
			if (err)
				res.send(err);

			product.created_by = req.body.created_by;
			product.title = req.body.title;
			product.description = req.body.description;
			product.price = req.body.price;
			product.sku = req.body.sku;
			product.vendor = req.body.vendor;
			product.visibleonlinestore = req.body.visibleonlinestore;
			product.producttype = req.body.producttype;
			product.imagepath = req.body.imagepath;
			product.zipcode = req.body.zipcode;



			product.save(function (err, result) {
				if (err)
					res.send(err);

				res.json(result);
			});
		});
	})
	//deletes the post
	.delete(function (req, res) {
		Product.remove({
			_id: req.params.id
		}, function (err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});


//-------------------------- cart..
router.route('/cart/:uid')
	//creates a new cart
	.post(function (req, res) {
		var cartData = new CartData();
		cartData.userid = req.body.userid;
		cartData.productid = req.body.productid;
		cartData.save(function (err, result) {
			if (err) {
				return res.send(500, err);
			}
			return res.json(result);
		});
	})
	//gets all cart by user;
	.get(function (req, res) {
		CartData.find({ userid: req.params.uid }, function (err, result) {
			if (err) {
				return res.send(500, err);
			}
			return res.send(200, result);
		});
	});
/////////////////////////////////////////////////////////
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},

	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			if (err) return cb(err)
			cb(null, raw.toString('hex') + path.extname(file.originalname))
		})
	}
});
//var upload = multer({ storage : storage}).single('userPhoto');
var upload = multer({ storage: storage }).single('file');
router.route('/upload')
	.post(function (req, res) {
		upload(req, res, function (err) {
			if (err) {
				return res.end("Error uploading file.");
			}
			console.log('////////////////////////////')
			console.log('/uploads/' + req.file.filename)
			console.log('////////////////////////////')
			res.end('/uploads/' + req.file.filename);
		});
	});

//-------------------------------------------------- user api



router.route('/users')
	.get(function (req, res) {
		User.find({ role: { $ne: "Admin" } }, function (err, result) {
			if (err) {
				return res.send(500, err);
			}
			return res.send(200, result);
		});
	});
router.route('/users/:id')
	.get(function (req, res) {

		User.findOne({ _id: req.params.id }, { password: 0 }, function (err, result) {
			if (err) {
				return res.send(500, err);
			}

			return res.send(200, result);
		});
	})
	.put(function (req, res) {
		User.findById(req.params.id, function (err, result) {
			if (err)
				res.send(err);

			result.username = req.body.username;
			result.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
			result.firstname = req.body.firstname;
			result.lastname = req.body.lastname;
			result.email = req.body.email;
			result.address = req.body.address;
			result.phonenumber = req.body.phonenumber;
			result.save(function (err, message) {
				if (err)
					res.send(err);
				res.json(message);
			});
		});
	})
	.delete(function (req, res) {
		User.remove({
			_id: req.params.id
		}, function (err) {
			if (err)
				res.send(err);
			res.json(req.params.id + "deleted successfully");
		});
	});





router.route('/vendors')
	.get(function (req, res) {
		User.find({ role: "Vendor" }, function (err, result) {
			if (err) {
				return res.send(500, err);
			}
			return res.send(200, result);
		});
	});
router.route('/vendors/:id')
	.get(function (req, res) {

		User.findOne({ _id: req.params.id }, { password: 0 }, function (err, result) {
			if (err) {
				return res.send(500, err);
			}

			return res.send(200, result);
		});
	})
	.put(function (req, res) {
		User.findById(req.params.id, function (err, result) {
			if (err)
				res.send(err);

			result.username = req.body.username;
			result.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
			result.firstname = req.body.firstname;
			result.lastname = req.body.lastname;
			result.email = req.body.email;
			result.address = req.body.address;
			result.phonenumber = req.body.phonenumber;
			result.save(function (err, message) {
				if (err)
					res.send(err);
				res.json(message);
			});
		});
	})
	.delete(function (req, res) {
		User.remove({
			_id: req.params.id
		}, function (err) {
			if (err)
				res.send(err);
			res.json(req.params.id + "deleted successfully");
		});
	});

//////////////////////////////////////////////////////////



router.route('/orders')

	.get(function (req, res) {

		var parts = urlString.parse(req.url, true);
		var fromDate = parts.query['from']
		var toDate = parts.query['to']

	
		

		if (fromDate && toDate) {
		
			Order.find(
				{order_date: {
					$gte: new Date(fromDate),
					$lte: new Date(toDate)
				}},function (err, result) {
					if (err) {
						return res.send(500, err);
					}
					return res.send(200, result);
			});



		} else {
			Order.find(function (err, result) {
				if (err) {
					return res.send(500, err);
				}

				return res.send(200, result);
			});
		}

	})



	.post(function (req, res) {

		var order = CustomMapper.mapOrder(req.body);
		order.save(function (err, result) {
			if (err) {
				return res.send(500, err);
			}
			return res.json(result);
		});
	});


router.route('/orders/:id')
	.put(function (req, res) {
		Order.findById(req.params.id, function (err, result) {
			if (err)
				res.send(err);

			result.status = req.body.status;

			result.save(function (err, message) {
				if (err)
					res.send(err);
				res.json(message);
			});
		});
	})




module.exports = router;