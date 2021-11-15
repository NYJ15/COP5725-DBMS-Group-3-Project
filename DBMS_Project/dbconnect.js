const oracledb = require('oracledb');
var express = require("express");
var cors = require('cors');
var config = require('./config.json');
const { query } = require('express');
var app = express();
var result;
oracledb.initOracleClient({ libDir: config.directory });
app.use(express.json());
app.use(cors());
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/home", (req, res, next) => {
  query = `select * from "NAYAN.JAIN".traveler_throughput where rownum <2`
  var res1 = dbConnect(query);
  console.log(res1)
  res1.then(function (result) {
    // here you can use the result of promiseB
    console.log("Hi", result.rows);
    res.json(result.rows);
  });
});

app.post('/flight-frequency', function (req, res) {
  console.log(req)
  
  query1 = `select res1.Number_of_flights, res1.month, res2.Number_of_cases from (select count(f.flight_id) as Number_of_flights, d.month from "NAYAN.JAIN".flights f, "NAYAN.JAIN".dates d 
  where f.fk_date_id = d.date_id and f.fk_destination_id = 1545 group by d.month order by d.month)res1 JOIN (select sum(f.cases_id) as Number_of_cases, d.month from "NAYAN.JAIN".covid_19_cases f, "NAYAN.JAIN".dates d where f.fk_date_id = d.date_id and f.fk_location_id = 159 group by d.month order by d.month)res2 
  on res1.month = res2.month
  `
  var res1 = dbConnect(query1);

  console.log(res1)
  res1.then(function(result) {
    // here you can use the result of promiseB
    console.log("Hi",result.rows);
    res.send(result.rows)
});  
})

app.post('/airline-management', function (req, res) {
  console.log(req)
  
  query1 = `select res2.Hourly_Flights, res2.DEPTIME, l.city from
  (select COUNT(*) as Hourly_Flights, deptime,  fl.fk_origin_id from 
      (select (cast(Round(CRS_DEP_TIME/100) AS INT)) AS deptime, fk_origin_id, fk_date_id from "NAYAN.JAIN".flights) fl,
  (select * from
    (
    select count(f.flight_id) as Number_of_flights, f.fk_origin_id from "NAYAN.JAIN".flights f, "NAYAN.JAIN".dates d 
    where f.fk_date_id = d.date_id and d.month= 1 
    group by f.fk_origin_id order by Number_of_flights desc
    )
    where rownum < 6) res1,
    "NAYAN.JAIN".dates d1 
    where res1.FK_ORIGIN_ID = fl.fk_origin_id 
    and fl.fk_date_id = d1.date_id and d1.month= 1 
    group by deptime, fl.fk_origin_id 
    order by fl.fk_origin_id
    )res2 JOIN "NAYAN.JAIN".locations l on l.location_id = res2.fk_origin_id
  `
  var res1 = dbConnect(query1);

  console.log(res1)
  res1.then(function(result) {
    // here you can use the result of promiseB
    console.log("Hi",result.rows);
    res.send(result.rows)
});  
})

app.post('/airline-performance', function (req, res) {
  console.log(req)
  
  query1 = `SELECT DISTINCT ac.unique_carrier, d.month, count(*)
  FROM "NAYAN.JAIN".Flights f, "NAYAN.JAIN".airline_company ac, "NAYAN.JAIN".dates d
  WHERE f.fk_airline_id=ac.airline_id and f.cancelled = 1 and d.date_id=f.fk_date_id
  GROUP BY ac.unique_carrier, d.month`
  var res1 = dbConnect(query1);

  console.log(res1)
  res1.then(function(result) {
    // here you can use the result of promiseB
    console.log("Hi",result.rows);
    res.send(result.rows)
});  
})

app.post('/covid-analysis', function (req, res) {
  console.log(req)
  
  query1 = `WITH cases_data_per_month as
  (SELECT DISTINCT l.states, AVG(c.cases) as avg_cases  FROM "NAYAN.JAIN".LOCATIONS l, "NAYAN.JAIN".COVID_19_CASES c, "NAYAN.JAIN".dates d WHERE c.fk_date_id = d.date_id and l.Location_id = c.fk_location_id
  and year = 2020 and d.month = 3 GROUP BY l.states ORDER BY l.states)
  SELECT s.states, s.POPULATION_DENSITY, c.avg_cases FROM cases_data_per_month c, "NAYAN.JAIN".state s WHERE s.states =c.states ORDER BY s.population_density DESC`
  var res1 = dbConnect(query1);

  console.log(res1)
  res1.then(function(result) {
    // here you can use the result of promiseB
    console.log("Hi",result.rows);
    res.send(result.rows)
});  
})


app.post('/covid-impact', function (req, res) {
  console.log(req)
  
  query1 = `WITH traveller_data(total_travelers, month) as
  (select sum(t.traveler_throughput), d.month from "NAYAN.JAIN".traveler_throughput t, "NAYAN.JAIN".dates d where t.fk_date_id = d.date_id and year = 2020 group by d.month order by d.month asc),
  cases_data(total_cases, month) as
  (select sum(c.cases), d.month from "NAYAN.JAIN".covid_19_cases c, "NAYAN.JAIN".dates d where c.fk_date_id = d.date_id and year = 2020 group by d.month order by d.month asc),
  vaccination_data(total_vaccinations, month) as
  (select sum(c.daily_vaccination), d.month from "NAYAN.JAIN".covid_19_vaccination c, "NAYAN.JAIN".dates d where c.fk_date_id = d.date_id and year = 2021 group by d.month order by d.month asc)
  SELECT * from traveller_data t, cases_data c, vaccination_data v`
  var res1 = dbConnect(query1);

  console.log(res1)
  res1.then(function(result) {
    // here you can use the result of promiseB
    console.log("Hi",result.rows);
    res.send(result.rows)
});  
})




async function dbConnect(query) {
  let connection;
  try {
    connection = await oracledb.getConnection({ user: config.username, password: config.password, connectionString: "oracle.cise.ufl.edu:1521/orcl" });
    console.log("Successfully connected to Oracle Database", connection);
    result = await connection.execute(query);
    return result;
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