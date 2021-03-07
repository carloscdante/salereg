# Salereg
### SALE REGistrator

Salereg is a terminal application that tracks sales and ranks sellers based on their total value sold (in dollars by default, can be changed to any currency). 
It was built using Node.JS with MongoDB as its database (you should have it installed and running for salereg to work.)

## Stack

Salereg was made using Node.JS, MongoDB and Yargs. 

### Observations

You need to have MongoDB installed and running on your machine to use the default configurations of Salereg.

Please use Mongoose version 5.11.15 or lower as there is an issue with the MongoDB driver in Mongoose 5.11.16 making every command display a warning (internal issue, not from Salereg)

# Installation
### Clone this repository and install it through npm
You can install salereg globally through npm (make sure you have the latest version of Node.js installed).

`git clone https://github.com/carloscdante/salereg`

`npm install -g .`

# Usage

### Initializing the database

Initialize the database by running this command with 5 sellers as arguments:

`salereg initialize -1 "Seller 1" -2 "Seller 2" -3 "Seller 3" -4 "Seller 4" -5 "Seller 5"`

Where Seller 1, 2, 3, 4 and 5 are the full names of the sellers to be registered.

### Adding a sale
Add a sale to the database by running the "add" command:

`salereg add -d "05/03/2021" -s "John Smith" -c "Mark B" -i "Product One" -p "299.99"`

Where -d is the date, -s is the seller name, -c is the customer name, -i is the item sold and -p is the price of the sale.
"add" adds the sale to the database and returns an updated sale list with the new one included.

### Edit a sale
Edit a sale by running the "edit" command:

`salereg edit -c 43944 -p price -v 399.99`

Where -c is the ID code of the sale, -p is the parameter to be changed and -v is the desired value to be stored into the parameter.

Possible parameters:

sellername - Seller's name.
customername - Customer's name.
date - Date of the sale.
product - Product name.
price - Price of the item sold.

### Delete a sale
Delete a sale like this:

`salereg delete -c 43944`

Where -c is the ID code of the sale.

### Listing all sales

List all sales (ranked by seller with the highest total sale value):

`salereg list`

### Displaying the ranking

Display the seller ranking.

`salereg rank`

### Note

All of the commands except for "help" keep running until you exit with Ctrl+C (or the exit command of your terminal of choice).

# Configuration
The sales and sellers are saved to a MongoDB database. You can modify any default parameter by changing the code and running it with your own modifications.

#### Authored by
Carlos Dante (carloscdante)

#### Dependencies
[mongoose](https://github.com/Automattic/mongoose)

[chalk](https://github.com/chalk/chalk)

[yargs](https://github.com/yargs/yargs)

[MongoDB](https://github.com/mongodb/mongo)

#### Code (Licensed under the GPLv2)

[Github](https://github.com/carloscdante/salereg)