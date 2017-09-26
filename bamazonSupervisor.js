// bamazon MANGER app

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// this lets us format EOL spacing around the main menu so that it doesn't overlap any resulting full or partial table
var os = require('os');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "H33zy4s!",
  database: "bamazon"
});

/*

Running this application will list a set of menu options:


                View Product Sales by Department

Create New Department

            

            When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

        department_id   department_name     over_head_costs     product_sales   total_profit
        01  Electronics     10000   20000   10000
        02  Clothing    60000   100000  40000

            The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.

If you can't get the table to display properly after a few hours, then feel free to go back and just add total_profit to the departments table.

                Hint: You may need to look into aliases in MySQL.

Hint: You may need to look into GROUP BYs.

Hint: You may need to look into JOINS.
*/


var jsonText = os.EOL;
var oneLine = "\n\r";

function giveMeSpace() {
  console.log(jsonText);
	console.log(oneLine);
	}



startMeUp();


function startMeUp() {
	inquirer.
	  prompt([
	      {
	        type:'list',
	        choices: ["View Product Sales by Department", "Create New Department", "Quit this Program\n\r" ],
	        message: "\nWelcome, Supervisor. Choose what you would like to do:\n",
	        name: "choice"
	      }
	    ]).then(function(user){
	      console.log(user.choice);
	      if(user.choice == "View Product Sales by Department"){
	        viewSales();
	        console.log(oneLine);
	        startMeUp();
	      }else if(user.choice == "Create New Department"){
	        console.log("\nCreating entry for new department ...\n");
          giveMeSpace();
          newDept();
          console.log(oneLine);
	      }else if(user.choice == "Quit this Program\n\r"){
	      	giveMeSpace();
	      	console.log("Exiting the program ...\n\r");
	        process.kill(process.pid);
	      }else{
	        console.log("something went sideways!");
	        }  
	   });
}

/* =============================================================== */
/* this works to display the product sales by department in a table */

function viewSales(){
	// adding space before rendered table
  console.log(oneLine);

  connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM (products.product_sales) AS product_sales FROM products INNER JOIN departments ON departments.department_name=products.department_name GROUP BY departments.department_id, departments.department_name;", function(err, res){

    if(err) throw err;
    
    // console.log(res);

    var aligns = [null, null, 'right', 'right', 'right'];
    // instantiate 
    var tableDepts = new Table({
    	head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit']
        , colWidths: [16, 36, 16, 16, 16]
        , colAligns: aligns
    });

    /*
        


        WISH LIST:

        I want the result table to also show ALL departments' records regardless if there are any items in the store 
        (since there ARE overhead costs, it seems like you'd want to show the losses, too.)




    */

    // loop through store's departments
    for(i=0; i<res.length; i++){
      var total_profit = (res[i].product_sales - res[i].over_head_costs);
      // the tableDepts is an Array, so you can 'push','splice', etc.
      tableDepts.push(
        [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, total_profit] 
      );   
    };
    // giving the table a caption
   	console.log("Current Sales by Department");

    console.log(tableDepts.toString());

    // adding space AFTER rendered table
   	console.log(oneLine);
   	console.log("Use Up or Down Arrow Keys to Continue ...")
   	console.log(oneLine);
   	giveMeSpace();
  });
}



/* =============================================================== */
/* ADDS a NEW department to the bamazon store (database) */


function newDept(){
  inquirer.
    prompt([
        {
          type:"input",
          message:"Enter a name for the new department:",
          name:"dept"
        },
        {
          type:"input",
          message:"What are the anticipated overhead costs (in whole dollars)?",
          name:"costs"
        }
    ]).then(function(itsNew){
        var insertQuery = "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?);"
        connection.query(insertQuery, [ itsNew.dept, itsNew.costs ], function(err, res) {
            if(err) throw err;

            var boldNewDept = itsNew.dept.toUpperCase();

            console.log("You have successfully added a new department called " + boldNewDept + " to your store.");
            console.log("Here is the new record:");
          
          });

       return itsNew.dept;

       // show that record was updated successfully by calling the viewDept function that just displays the record that was updated (in table format)
    }).then (function(dept){ 
      viewDept(dept);
  });
};



/* =============================================================== */
/* This displays only the new department record added to the DB */

function viewDept(dept){
  connection.query("SELECT department_id, department_name, over_head_costs FROM departments WHERE ?;", 
  	{ department_name: dept }, function(err, res){
	    if(err) throw err;
	    // console.log(res);
		var aligns = [null, null, 'right'];
    // instantiate 
    var deptList = new Table({
    	head: ['Department ID', 'Department Name', 'Overhead Costs']
        , colWidths: [16, 36, 16]
        , colAligns: aligns
    });

	// the deptList is an Array, so you can 'push', 'splice', etc.
	deptList.push(
	  [res[0].department_id, res[0].department_name, res[0].over_head_costs] 
	);   
    console.log(deptList.toString());

    // adding space after rendered table
   	console.log(oneLine);
   	console.log("Use Up or Down Arrow Keys to Continue ...")
   	console.log(oneLine);
   	giveMeSpace();
  });
  startMeUp();
};

