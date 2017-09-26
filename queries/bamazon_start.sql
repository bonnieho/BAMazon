DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id VARCHAR(6) NOT NULL UNIQUE,
  product_name VARCHAR(60) NOT NULL,
  department_name VARCHAR(60) NOT NULL,
  price INT(6,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;


-- adding new column for product_sales

USE bamazon;
ALTER TABLE products
ADD COLUMN product_sales DECIMAL(6,2) NOT NULL default 0;



-- adding new table departments

CREATE TABLE departments (
  department_id INT(6) AUTO_INCREMENT NOT NULL UNIQUE,
  department_name VARCHAR(60) NOT NULL,
  over_head_costs INT(6) default 0,
  PRIMARY KEY (department_id)
);

SELECT * FROM departments;



-- inserting initial overhead costs into departments table based on initial departments in products table

USE bamazon;

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Sporting Goods', '1200');

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Hardware', '2200');

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Kitchen', '750');

