const mysql = require("mysql");
const util = require("util");

//Conexión a la db:
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "node_company",
});

pool.query = util.promisify(pool.query);
module.exports = pool;
