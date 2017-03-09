// Dependencies
// =============================================================
var prompt = require('prompt');

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

function promptEm() {

  
  // 
  // Setting these properties customizes the prompt. 
  // 
  prompt.message = colors.rainbow("BAMAZON SHOPPING!");
  prompt.delimiter = colors.green("---");
 
  prompt.start();



  var schema = {
    properties: {
      id: {
      	description: colors.magenta("What is ID of product to purchase?"),
        pattern: /^[0-9]*$/,
        message: 'Name must be only numbers',
        required: true
      },
      toBuy: {
      	description: colors.red("Quantity desired?"),
        pattern: /^[0-9]*$/,
        message: 'Name must be only numbers',
        required: true
      }
    }
  };
 
  // Get two properties from the user: email, password 
  // 
  prompt.get(schema, function (err, result) {
    // 
    // Log the results. 
    // 
    if (pObjects.length >= result.id) {
    	var currentP = pObjects[result.id-1];
    }

    if (pObjects.length < result.id) {
    	console.log('ID out of range, highest id in stock is ' + pObjects.length + '.\r\n');
    	promptEm();
    }

    else if (result.toBuy > currentP.stock_quantity){
    	console.log('There are not enough in stock. Currently in stock: ' + currentP.stock_quantity + '.\r\n');
    	promptEm();
    }
    else {
    	console.log('-------------------------------------------------------------------------------');
	    console.log('\r\nHere is your order:');
	    console.log('   Id:                  ' + result.id);
	    console.log('   Purchase quantity:   ' + result.toBuy);
	    console.log('-------------------------------------------------------------------------------');
	    placeOrder(result.id, result.toBuy);
	}
  });
}


function showPArray(){
	connection.query('SELECT * FROM products', function (err, rows, fields) {
	    if (err) throw err;
	    pObjects = rows;
	    for (i in rows) {
	    	
	    	var products = '';
	      	products += "Product Id:            " + rows[i].item_id + '\r\n';
	      	products += "Product Name:          " + rows[i].product_name + '\r\n';
	      	products += "Department Name:       " + rows[i].department_name + '\r\n';
	      	products += "Price:                 " + rows[i].price + '\r\n';
	      	products += "In Stock:              " + rows[i].stock_quantity + '\r\n';
	      	pArray.push(products);
	    } 
	    for (i in pArray) {
			console.log(pArray[i]);
			console.log('-------------------------------------------------------------------------------');
		}
	promptEm();
	});
	// connection.end();
	
}

showPArray();

// function promptEm() {

//   // 
//   // Setting these properties customizes the prompt. 
//   // 
//   prompt.message = colors.rainbow("BAMAZON");
//   prompt.delimiter = colors.green("><");
 
//   prompt.start();
 
//   prompt.get({
//     properties: {
//       id: {
//         description: colors.magenta("What is your name?")
//       }
//     }
//   }, function (err, result) {
//     console.log(colors.cyan("You said your name is: " + result.name));
//   });

// }



 
  // prompt.get({
  //   properties: {
  //     name: {
  //       description: colors.magenta("What is the id of the product you'd like to buy?")
  //     }
  //   }
  // }, function (err, result) {
  //   console.log(colors.cyan("You said your name is: " + result.name));
  // });





// connection.end();