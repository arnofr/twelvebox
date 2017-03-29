app.factory('postService', function ($resource) {
	return $resource('/api/posts/:id');
});

app.factory('productService', function ($resource) {
	return $resource('/api/products/:id');
})
app.factory('userService', function ($resource) {
	return $resource('/api/users/:id');
})
app.factory('vendorService', function ($resource) {
	return $resource('/api/vendors/:id');
})
app.factory('orderService', function ($resource) {
	return $resource('/api/orders/:id');
})