var prompt = require('prompt');

var inquiry

var mysql = require('mysql');

var colors = require("colors/safe");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'Bamazon'
});

connection.connect();


// Sets up the Express App
// =============================================================

var PORT = process.env.PORT || 1234;


var pArray = [];
var pObjects = [];

function placeOrder(id, amount) {
	var i = id-1;
	var orderedP = pObjects[i];
	connection.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?', [amount, id], function (err, rows, fields) {
	    if (err) throw err;
	    console.log('\r\nDatabase updated');
	    console.log('Total price = ' + orderedP.price * amount);
	    console.log('-------------------------------------------------------------------------------');

	});

}