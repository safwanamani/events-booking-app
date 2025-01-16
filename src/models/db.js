const mysql = require("mysql2/promise");
const { db } = require("../../config");

const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
});

pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release();
  })
  .catch((error) => {
    console.log(`Database connection failed: ${error.message}`);
  });

module.exports = pool;
