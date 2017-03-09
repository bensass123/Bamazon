'use strict';

var prompt = require('prompt');

var inquirer = require('inquirer');

var mysql = require('mysql');

var colors = require("colors/safe");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'Bamazon'
});

connection.connect();

var pArray = [];
var pObjects = [];

function addStock(product_name, stock) {
	console.log(product_name + ' ' + stock);

	connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?', [stock, product_name], function (err, rows, fields) {
	    if (err) throw err;
	    console.log('\r\nDatabase updated');
	    console.log('Added ' + stock + ' stock to ' + product_name);
	    console.log('-------------------------------------------------------------------------------');

	});
}

function addProduct(product_name, department_name, price, stock_quantity) {
	connection.query('INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)', 
	[product_name, department_name, price, stock_quantity], function (err, rows, fields) {
		if (err) throw err;
		console.log('Added product ' + product_name);
		showPArray();
	});
}

function createPArray(){
	connection.query('SELECT * FROM products', function (err, rows, fields) {
	    if (err) throw err;
	    for (var i = 0; i < rows.length; i++){
	    	pArray.push(rows[i].product_name);
	    }
	});    
}

function showPArray(){
	let pArray = []; 
	connection.query('SELECT * FROM products', function (err, rows, fields) {
	    if (err) throw err;
	    pObjects = rows;
	    for (var i = 0; i < rows.length; i++) {
	    	var products = '';
	      	products += "Product Id:            " + rows[i].item_id + '\r\n';
	      	products += "Product Name:          " + rows[i].product_name + '\r\n';
	      	products += "Department Name:       " + rows[i].department_name + '\r\n';
	      	products += "Price:                 " + rows[i].price + '\r\n';
	      	products += "In Stock:              " + rows[i].stock_quantity + '\r\n';
	      	pArray.push(products);
		 }
		for (i in pArray) {
			console.log('-------------------------------------------------------------------------------');
			console.log(pArray[i]);
			console.log('-------------------------------------------------------------------------------');
		}
	});
}

function showLows(){
	var pArray = []; 
	connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, rows, fields) {
	    if (err) throw err;
	    pObjects = rows;
	    for (var i = 0; i < rows.length; i++) {
	    	var products = '';
	      	products += "Product Id:            " + rows[i].item_id + '\r\n';
	      	products += "Product Name:          " + rows[i].product_name + '\r\n';
	      	products += "Department Name:       " + rows[i].department_name + '\r\n';
	      	products += "Price:                 " + rows[i].price + '\r\n';
	      	products += "In Stock:              " + rows[i].stock_quantity + '\r\n';
	      	pArray.push(products);
		 }
		for (i in pArray) {
			console.log('-------------------------------------------------------------------------------');
			console.log(pArray[i]);
			console.log('-------------------------------------------------------------------------------');
		}
	});
}

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



var output = [];

var questions = [
  {
    type: 'list',
    name: 'menuChoice',
    message: 'Please enter selection',
    choices: ['View Products For Sale','View Low Inventory', 'Add to Inventory', 'Add New Product']
  }
];

var addPrompt = [
  {
  	type: 'list',
  	name: 'addProduct',
  	message: 'Please select product:',
  	choices: pArray
  },
  {
  	type: 'input',
  	name: 'newStock',
  	message: 'How many to add?',
  	validate: function(x){
  		let reg = /^[0-9]*$/;
  		return reg.test(x);
  	}
  }
];

var newProductPrompt = [
	{
		type: 'input',
		name: 'name',
		message: 'Name of product: ',
	},
	{
		type: 'input',
		name: 'dept',
		message: 'Name of department: ',
	},
	{
	  	type: 'input',
	  	name: 'price',
	  	message: 'Price',
	  	validate: function(x){
	  		let reg = /^\d{0,5}(\.\d{1,2})?$/;
	  		return reg.test(x);
	  	}
  	},
  	{
	  	type: 'input',
	  	name: 'stock',
	  	message: 'Stock',
	  	validate: function(x){
	  		let reg = /^[0-9]*$/;
	  		return reg.test(x);
	  	}
  	}
];


function ask() {
	inquirer.prompt(questions).then(function (answers) {
		switch(answers.menuChoice) {
			case 'View Products For Sale':
				console.log('\r\nProducts for Sale:');
				showPArray();
				break;
			case 'View Low Inventory':
				console.log('\r\nView Low Inventory:');
				showLows();				
				break;	
			case 'Add to Inventory':
				console.log('\r\nAdd to Inventory:');
				inquirer.prompt(addPrompt).then(function (answers) {
					addStock(answers.addProduct, answers.newStock);
				});
				break;
			case 'Add New Product':
				console.log('\r\nAdd New Product:');
				inquirer.prompt(newProductPrompt).then(function (answers) {
					addProduct(answers.name, answers.dept, answers.price, answers.stock);
				});
				break;
		}
		ask();

  });

}


createPArray();
ask();

// product_name, department_name, price, stock_quantity
