const oracledb = require('oracledb');
var express = require("express");
var cors = require('cors');
var config = require('./config.json');
var app = express();
var result;
oracledb.initOracleClient({libDir: config.directory});
app.use(express.json());
app.use(cors());
app.listen(3000, () => {
  console.log("Server running on port 3000");
 });
app.get("/url", (req, res, next) => {
  var res1 = dbConnect();
  res1.then(function(result) {
    // here you can use the result of promiseB
    console.log("Hi",result.rows);
    res.json(result.rows);
});
  
  
 });
async function dbConnect() {
  let connection;
  try {
    connection = await oracledb.getConnection({ user: config.username, password: config.password, connectionString: "oracle.cise.ufl.edu:1521/orcl" });
    console.log("Successfully connected to Oracle Database",connection);

    result = await connection.execute(`select * from "NAYAN.JAIN".dates`);
    //console.log(result)
    return  result;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}