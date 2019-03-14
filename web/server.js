 var express = require('express');
 var app = express();

 app.use(function(req, res) {
 	res.end('good');
 })

 app.listen(3000, function() {
 	console.log('server running at 3000');
 });