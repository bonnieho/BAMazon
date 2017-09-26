var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
// this lets us format EOL spacing around text so it's more readable doesn't overlap any resulting full or partial table
var os = require('os');



var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "H33zy4s!",
  database: "bamazon"
});


// Global spacing vars and function to help readability
var jsonText = os.EOL;
var oneLine = "\n\r";

function giveMeSpace() {
  console.log(jsonText);
  console.log(oneLine);
  }



/* this works to simply display the products in a table */

function selectAll(){
  connection.query("SELECT item_id, product_name, price FROM products;", function(err, res){
    if(err) throw err;
    // console.log(res);
    var aligns = [null, null, 'right'];
    // instantiate 
    var tableInventory = new Table({
      head: ['Item ID', 'Product Name', 'Price']
      , colWidths: [10, 48, 10]
      , colAligns: aligns
    });

    // loop through products in store
    for(i=0; i<res.length; i++){
      // the tableInventory is an Array, so you can 'push' ,'splice', etc.'
      tableInventory.push(
        [res[i].item_id, res[i].product_name, res[i].price.toFixed(2)] // .toFixed(2) forces trailing zeros in prices
      );   
    };
    console.log(tableInventory.toString());
  });
};

// selectAll();



// This is the mashup of what worked to display the table with also getting the prompt to populate with the product names

function buyItem(){
  connection.query("SELECT item_id, product_name, price FROM products;", function(err, res) {
    if (err) throw err;
    // console.log(res);
    var aligns = [null, null, 'right'];
    // instantiate 
    var tableInventory = new Table({
      head: ['Item ID', 'Product Name', 'Price']
      , colWidths: [10, 48, 10]
      , colAligns: aligns
    });

    // setting a name for a new array that gets all of the current product names pushed to it as the loop iterates
    var prodNames = [];

    // loop through products in store
    for(i=0; i<res.length; i++){
      // the tableInventory is an Array, so you can 'push', 'splice', etc.
      tableInventory.push(
        [res[i].item_id, res[i].product_name, res[i].price.toFixed(2)] // .toFixed(2) forces trailing zeros in prices
      ); 
      prodNames.push(res[i].product_name);  
    };

     // giving the table a caption
    console.log("\n\rCurrent Products for Sale");

    // displays the inventory table
    console.log(tableInventory.toString());

    // launching the prompt, listing the products to select from and then takes the customer's desired quantity amount
    inquirer.
    prompt([
        {
          type:'list',
          choices: prodNames,
          message: "\n\rWhich product would you like to purchase?\n\r",
          name: "item",
        },
        {
          type:'input',
          message:'How many would you like to buy?',
          name:'qty',
          validate: function (qty) {
            var valid = !isNaN(parseFloat(qty));
            return valid || 'Please enter a number';
          },
        }
      ]).then(function(order){
          var query = "SELECT stock_quantity, price FROM products WHERE ?";
          connection.query(query, { product_name: order.item }, function(err, res) {
            if (err) throw err;
            // console.log(res);
            // console.log(res[0].stock_quantity);
            // console.log(order.qty);
            /* check if your store has enough of the product to meet the customer's request. */
            if (res[0].stock_quantity < order.qty) {

              /* If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through. */

              console.log("We\'re sorry - We do not have sufficient quantities of the product in stock at this time!");
              console.log("Thank you for your interest. Please check back again soon.");
            } else {
               
              /* However, if your store does have enough of the product, you should fulfill the customer's order.
                  This means updating the SQL database to reflect the remaining quantity. */

              // Once the update goes through, show the customer the total cost of their purchase. 
              var total = (res[0].price*order.qty); 
              

              console.log("\n\rYou are placing an order for " + order.qty + " " + order.item + "(s) at $" + res[0].price.toFixed(2) + " each.");
              console.log("\n\rYour item is currently in stock.");
              console.log("\n\rThe total for this order is: $" + total.toFixed(2));
              console.log("\n\rThank you for shopping with us!");


              var query2 = "UPDATE products SET product_sales = product_sales + " + total + " WHERE ?";
              // console.log(query2);

              connection.query(query2, { product_name: order.item }, function(err, res) {
                if (err) throw err;

                // follow-up prompt
                whatNow();
              });
            }
          });
        });
  });

}    

buyItem();


// Follow-up prompt to do it again or quit
function whatNow(){
  inquirer.
      prompt([
          {
            type:'list',
            choices: ["Place Another Order?", "Quit this Program\n\r" ],
            message: "\nHow else can we be of service?\n",
            name: "choice"
          }
        ]).then(function(user){
          console.log(user.choice);
          if(user.choice == "Place Another Order?"){
            buyItem();
            console.log(oneLine);
          }else if (user.choice == "Quit this Program\n\r"){
            // giveMeSpace();
            console.log("\n\rThanks again for your patronage. Have a nice day!\n\r");
            console.log("Exiting the program ...\n\r");
            process.kill(process.pid);
          } else {
          console.log("something went sideways!");
          } 
       });
}

