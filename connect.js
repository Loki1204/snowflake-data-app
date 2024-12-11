/**************************************
 *
 * connect.js
 *
 * This file set's up the connection to
 * Snowflake using the environment var-
 * iables from the .env file
 *
 **************************************/
const snowflake = require("snowflake-sdk");
const dotenv = require("dotenv");
const crypto = require("crypto");
const fs = require("fs");
const jwt = require("jsonwebtoken");

// Enable environment variables in .env file
dotenv.config();

// Load the private key from the file
const privateKeyFile = fs.readFileSync("C:/Users/Lokesh/rsa_key.p8");

// Get the private key from the file as an object.
const privateKeyObject = crypto.createPrivateKey({
  key: privateKeyFile,
  format: "pem",
});

// Extract the private key from the object as a PEM-encoded string.
const privateKey = privateKeyObject.export({
  format: "pem",
  type: "pkcs8",
});

// Debugging log
console.log("Private Key Loaded:", privateKey ? "Success" : "Failure");

// 4.2.2 get connection details from environment variables
const options = {
  account: process.env.ACCOUNT,
  username: 'TASTY_APP_API_USER',
  authenticator: "SNOWFLAKE_JWT",
  privateKey,
  database: process.env.DATABASE,
  schema: process.env.SCHEMA,
  warehouse: process.env.WAREHOUSE,
};

// 4.2.3 create the connection to the Snowflake account
const connection = snowflake.createConnection(options);
connection.connect((err, conn) => {
  if (err) {
    console.error("Unable to connect to Snowflake", err);
  } else {
    console.log("Connected to Snowflake account " + options.account);
  }
});

module.exports = connection;
