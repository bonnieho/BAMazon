var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

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
      // the tableInventory is an Array, so you can `push`, `unshift`, `splice` and the rest 
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
      // the tableInventory is an Array, so you can `push`, `unshift`, `splice` and the rest 
      tableInventory.push(
        [res[i].item_id, res[i].product_name, res[i].price.toFixed(2)] // .toFixed(2) forces trailing zeros in prices
      ); 
      prodNames.push(res[i].product_name);  
    };
    console.log(tableInventory.toString());

    // launching the prompt, listing the products to select from and then takes the customer's desired quantity amount
    inquirer.
    prompt([
        {
          type:'list',
          choices: prodNames,
          message: "Which product would you like to purchase?",
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
              console.log("You are placing an order for " + order.qty + " " + order.item + "(s) at $" + res[0].price.toFixed(2) + " each.");
              console.log("Your item is currently in stock.");
              console.log("The total for this order is: $" + total.toFixed(2));
              console.log("Thank you for shopping with us!");
            }
        })
      })
  });
}    

buyItem();







/*

var questions = [
    {
          type:'list',
          choices: res.product_name,
          message: "Which product would you like to purchase?",
          name: "item"
        },
        {
          type:'input',
          message:'How many would you like to buy?',
          name:'qty',
          validate: function (qty) {
            var valid = !isNaN(parseFloat(qty));
            return valid || 'Please enter a number';
          }
];

inquirer.prompt(questions).then(function (answers) {
  console.log('\nYour order:');
  console.log(JSON.stringify(answers, null, '  '));
});
*/


/*

inquirer.
  prompt([
      {
        type:‘list’,
        choices: [“POST AN ITEM”, “BID ON ITEM”],
        message: “Choose one!“,
        name: “first”
      }
    ]).then(function(user){
      console.log(user.first);
      if(user.first == “POST AN ITEM”){
        console.log(“POST SQL”);
        PostItem();
      }
        else{
          console.log(“BID SQL”);
          BidItem();
        }
      
   });

function PostItem(){
  inquirer.
    prompt([
        {
          type:“input”,
          message:“What item would you like to add?“,
          name:“item”
        }
      ]).then(function(user){
        console.log(user.item);
        // connection.query(“INSERT INTO post SET ?“, {
        // item: user.item,
        // }, function(err, res) {});
      })
}  

function BidItem(){
  connection.query(“SELECT * FROM item”, function(err, res) {
    if (err) throw err;
    console.log(res);

   inquirer.
    prompt([
        {
          type:‘list’,
          choices: res,
          message: “Which item do you want to bid on?“,
          name: “item”
        },
        {
          type:“input”,
          message:“How much do you want to bid?“,
          name:“price”
        }
      ]).then(function(user){
        

       for (var i = 0; i < res.length; i++) {
          console.log(user);
        }
        // connection.query(“INSERT INTO post SET ?“, {
        // item: user.item,
        // }, function(err, res) {});
      })
  });
}    


*/

