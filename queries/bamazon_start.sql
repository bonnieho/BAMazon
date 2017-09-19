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