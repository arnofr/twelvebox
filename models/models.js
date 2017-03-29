var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	created_by: String,		//should be changed to ObjectId, ref "User"
	created_at: {type: Date, default: Date.now},
	text: String
});

var userSchema = new mongoose.Schema({
	role:String,
	companyname:String,
	username: String,
	firstname:String,
	lastname:String,
	email:String,
	address:String,
	phonenumber:Number,
	zipcode:String,
	password:String,
	created_at: {type: Date, default: Date.now}
})

var productTypeMasterSchema = new mongoose.Schema({
	name:String,
	created_by: String,		//should be changed to ObjectId, ref "User"
	created_at: {type: Date, default: Date.now},
})
var productSchema = new mongoose.Schema({
	title:String,
	description:String,
	price:String,
	sku:String,
	vendor:String,
	visibleonlinestore:Boolean,
	producttype:String,
	imagepath:String,
	created_by: String,		//should be changed to ObjectId, ref "User"
	zipcode:String,
	created_at: {type: Date, default: Date.now},
})
var cartSchema = new mongoose.Schema({
	userid:String,
	productid:String,
	created_at: {type: Date, default: Date.now},
})

var orderSchema = new mongoose.Schema({
	userid:String,
	username:String,
	order_date: {type: Date, default: Date.now},
	products:[productSchema],
	totalprice:Number,
	status:String
})


mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);
mongoose.model('Product', productSchema);
mongoose.model('CartData', cartSchema);
mongoose.model('Order', orderSchema);
