// bamazon MANGER app

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "H33zy4s!",
  database: "bamazon"
});

/*

Running this application will:

                    List a set of menu options:

                        View Products for Sale

                        View Low Inventory

                        Add to Inventory

                        Add New Product

                    If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

                    If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

                    If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

                    If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

                    */

inquirer.
  prompt([
      {
        type:'list',
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        message: "Welcome, Manager. Choose what you would like to do.",
        name: "choice"
      }
    ]).then(function(user){
      console.log(user.choice);
      if(user.choice == "View Products for Sale"){
        viewProds();
      }else if(user.choice == "View Low Inventory"){
        lowInv();
      }else if(user.choice == "Add to Inventory"){
        addQty();
      }else if(user.choice == "Add New Product"){
        newItem();
      }else{
        console.log("something went sideways!");
        }  
   });


/* =============================================================== */
/* this works to display the products in a table */

function viewProds(){
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products;", function(err, res){
    if(err) throw err;
    // console.log(res);
	var aligns = [null, null, 'right', 'right'];
    // instantiate 
    var tableInventory = new Table({
    	head: ['Item ID', 'Product Name', 'Price', 'Quantity']
        , colWidths: [10, 48, 10, 10]
        , colAligns: aligns
    });

    // loop through products in store
    for(i=0; i<res.length; i++){
      // the tableInventory is an Array, so you can `push`, `unshift`, `splice` and the rest 
      tableInventory.push(
        [res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity] // .toFixed(2) forces trailing zeros in prices
      );   
    };
    console.log(tableInventory.toString());
  });
}



/* =============================================================== */
/* Display the products in a table with quantities lower than 5 */

function lowInv() {
  var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
  connection.query(query, function(err, res) {
  	if(err) throw err;
  	var aligns = [null, null, 'right', 'right'];
    // instantiate 
    var tableInventory = new Table({
    	head: ['Item ID', 'Product Name', 'Price', 'Quantity']
        , colWidths: [10, 48, 10, 10]
        , colAligns: aligns
    });
    for (var i = 0; i < res.length; i++) {
      // the tableInventory is an Array, so you can `push`, `unshift`, `splice` and the rest 
      tableInventory.push(
        [res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity] // .toFixed(2) forces trailing zeros in prices
      );   
    };
    console.log(tableInventory.toString());
  });
}



/* =============================================================== */
/* ADD more of a particular product to the inventory (database) */

function addQty(){

  	inquirer.
    prompt([
        {
          type:"input",
          message:"What item would you like to add more units to? Enter the Item ID.",
          name:"item" //,
          // to validate a item ID entry using regular expression to ensure that only six digits are entered
          /* validate: function (item) {
            var prod = item.match(/^( \D{6});
            if (prod) {
              return true;
              }
            return 'Please enter a valid item ID';
            } */
        },
        {
          type:'input',
          message:'How many would you like to add?',
          name:'qty',
          validate: function (qty) {
            var valid = !isNaN(parseFloat(qty));
            return valid || 'Please enter a number';
          }
      	},
    ]).then(function(increase){
        var updateQuery = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?;";
        // WHERE clause takes object consisting of key value pairs, hence the curlies
        connection.query(updateQuery, [ increase.qty, { item_id: increase.item }], function(err, res) {
        	if(err) throw err;
        	
        	console.log("You have successfully modified the product\'s quantity in inventory.");
        	console.log("Here is the updated record:");
        	
        });

        return increase.item;

    // show that record was updated successfully by calling the viewProd function that just displays the record that was updated (in table format)
    }).then (function(item){ 
    	viewProd(item);
	});
}


/* =============================================================== */
/* This displays only the product whose quantity was just updated OR just the new record added to the DB */

function viewProd(item){
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?;", 
  	{ item_id: item }, function(err, res){
	    if(err) throw err;
	    // console.log(res);
		var aligns = [null, null, 'right', 'right'];
	    // instantiate 
	    var tableInventory = new Table({
	    	head: ['Item ID', 'Product Name', 'Price', 'Quantity']
	        , colWidths: [10, 48, 10, 10]
	        , colAligns: aligns
    });

	// the tableInventory is an Array, so you can `push`, `unshift`, `splice` and the rest 
	tableInventory.push(
	  [res[0].item_id, res[0].product_name, res[0].price.toFixed(2), res[0].stock_quantity] // .toFixed(2) forces trailing zeros in prices
	);   
    console.log(tableInventory.toString());
  });
};

        
    
/* =============================================================== */
/* ADDS a NEW product to the inventory (database) */


function newItem(){
  inquirer.
    prompt([
        {
          type:"input",
          message:"Create a six-letter Item ID",
          name:"item"
        },
        {
          type:"input",
          message:"What is the Product Name of the item would you like to add?",
          name:"prodname"
        },
        {
          type:"list",
          choices: ["Sporting Goods", "Hardware", "Kitchen"],
          message:"What department does the product belong in?",
          name:"deptname"
        },
        {
          type:"input",
          message:"What will the item cost?",
          name:"newPrice"
        },
        {
          type:"input",
          message:"How many will go into the inventory intitially?",
          name:"qty"
        }
    ]).then(function(itsNew){
        console.log(itsNew.item);
        var insertQuery = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?, ?);"
        // var insertQuery = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (*);"
        connection.query(insertQuery, [ itsNew.item, itsNew.prodname, itsNew.deptname, itsNew.newPrice, itsNew.qty ], function(err, res) {
        		if(err) throw err;

				console.log("You have successfully added a product to your inventory.");
        		console.log("Here is the new record:");
        	
        	});

       return itsNew.item;

       // show that record was updated successfully by calling the viewProd function that just displays the record that was updated (in table format)
    }).then (function(item){ 
    	viewProd(item);
	});
};


/* 
          to validate a item ID entry using regular expression
          validate: function (item) {
            var prod = item.match(/^( \D{6});
            if (prod) {
              return true;
              }
            return 'Please enter a valid item ID';
            } 

        // item: user.item,
 */       
 






