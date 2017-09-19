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

/* this works to display the products in a table */

function selectAll(){
  connection.query("SELECT item_id, product_name, price FROM products;", function(err, res){
    if(err) throw err;
    // console.log(res);

    // instantiate 
    var tableInventory = new Table({
      head: ['Item ID', 'Product Name', 'Price']
      , colWidths: [10, 48, 10]
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



// trying this as a mashup of what worked before with trying ot get the promot to populate with the product names

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

                // loop through products in store
                for(i=0; i<res.length; i++){
                  // the tableInventory is an Array, so you can `push`, `unshift`, `splice` and the rest 
                  tableInventory.push(
                    [res[i].item_id, res[i].product_name, res[i].price.toFixed(2)] // .toFixed(2) forces trailing zeros in prices
                  );   
                };
                console.log(tableInventory.toString());



   inquirer.
    prompt([
        {
          type:'list',
          choices: tableInventory[0],
          message: "Which product would you like to purchase?",
          name: "item",
          /* 
          to validate a item ID entry using regular expression
          validate: function (item) {
            var prod = item.match(/^( \D{6});
            if (prod) {
              return true;
              }
            return 'Please enter a valid item ID';
            } */
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
      ]).then(function(user){
       for (var i = 0; i < res.length; i++) {
          console.log(user.item);
          console.log(user.qty);
        }
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




// function selectAll(){
//     connection.query(“SELECT * FROM table”, function(err, res){
//         if(err) throw err;
//         console.log(res);
//     });
// }

*/