
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var bCrypt = require('bcrypt-nodejs');
var CustomMapper = {

    mapOrder:function(request){
      
        var _order = new Order();
        _order.username = request.username;
        _order.userid = request.userid;
        _order.products = request.products;
        _order.totalprice = request.totalprice;
        _order.status = "ordered"//preparing";//delivering//delivered
        return _order;
    },
    mapProduct: function (obj) {

        var _product = new Product();
        _product.title = obj.title;
        _product.description = obj.description;
        _product.price = obj.price;
        _product.sku = obj.sku;
        _product.vendor = obj.vendor;
        _product.visibleonlinestore = obj.visibleonlinestore;
        _product.producttype = obj.producttype;
        _product.created_by = obj.created_by;
        _product.created_at = obj.created_at;
        _product.zipcode = obj.zipcode;
        _product.imagepath = obj.imagepath;
        return _product;
    },
    mapUser: function (obj, username, password) {
        var newUser = new User();
        if(username && password){
            newUser.username = username;
            newUser.password = bCrypt.hashSync(obj.password, bCrypt.genSaltSync(10), null);
        }else{
            newUser.username = obj.username;
            newUser.password = bCrypt.hashSync(obj.password, bCrypt.genSaltSync(10), null);

            

        }
        // if (!obj) {
        //     return newUser;
        // }
        newUser.firstname = obj.firstname;
        newUser.lastname = obj.lastname;
        newUser.email = obj.email;
        newUser.address = obj.address;
        newUser.phonenumber = obj.phonenumber;
        newUser.role = obj.role; 
        return newUser;
    }
};
module.exports = CustomMapper;