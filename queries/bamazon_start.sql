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
	department_id VARCHAR(6) NOT NULL UNIQUE,
	department_name VARCHAR(60) NOT NULL,
	over_head_costs INT(6) default 0,
	PRIMARY KEY (department_id)
);

SELECT * FROM departments;

