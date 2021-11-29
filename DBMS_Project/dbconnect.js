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
var covidanalysisPromise = function(req){
  return new Promise((resolve,reject)=>{
    query7 = `
    WITH cases_data_per_month as
  (SELECT DISTINCT l.states, AVG(c.cases) as avg_cases  FROM "NAYAN.JAIN".LOCATIONS l, "NAYAN.JAIN".COVID_19_CASE c, "NAYAN.JAIN".dates d WHERE c.fk_date_id = d.date_id and l.Location_id = c.fk_location_id
  and year = '${req.body.year}' and d.month = '${req.body.month}' GROUP BY l.states ORDER BY l.states)
  SELECT s.states, s.POPULATION_DENSITY, c.avg_cases FROM cases_data_per_month c, "NAYAN.JAIN".state s WHERE s.states =c.states ORDER BY s.population_density DESC
    `
    console.log(query7);
    var res1 = dbConnect(query7);
      resolve(res1);
  })
}
var airlinemanagementPromise = function(req){
  return new Promise((resolve,reject)=>{
    query6 =`
    select res2.Hourly_Flights, res2.DEPTIME, l.city from
  (select COUNT(*) as Hourly_Flights, deptime,  fl.fk_origin_id from 
      (select (cast(Round(CRS_DEP_TIME/100) AS INT)) AS deptime, fk_origin_id, fk_date_id from "NAYAN.JAIN".flights) fl,
  (select * from
    (
    select count(f.flight_id) as Number_of_flights, f.fk_origin_id from "NAYAN.JAIN".flights f, "NAYAN.JAIN".dates d 
    where f.fk_date_id = d.date_id and d.month=  '${req.body.month}'
    group by f.fk_origin_id order by Number_of_flights desc
    )
    where rownum < '${req.body.airport}') res1,
    "NAYAN.JAIN".dates d1 
    where res1.FK_ORIGIN_ID = fl.fk_origin_id 
    and fl.fk_date_id = d1.date_id and d1.month=  '${req.body.month}'
    group by deptime, fl.fk_origin_id 
    order by fl.fk_origin_id
    )res2 JOIN "NAYAN.JAIN".locations l on l.location_id = res2.fk_origin_id
    `
    console.log(query6);
    var res1 = dbConnect(query6);
      resolve(res1);
  })
}
var flightQueryPromise = function(req){
  return  new Promise((resolve, reject) => {
    query1 = `SELECT
    res1.number_of_flights,
    res1.month,
    res2.number_of_cases
  FROM
         (
        SELECT
            COUNT(f.flight_id) AS number_of_flights,
            d.month
        FROM
            "NAYAN.JAIN".flights f,
            "NAYAN.JAIN".dates   d
        WHERE
                f.fk_date_id = d.date_id
            AND f.fk_destination_id IN(
              SELECT l.location_id from "NAYAN.JAIN".locations l where l.states = '${req.body.state}'
              )
        GROUP BY
            d.month
        ORDER BY
            d.month
    ) res1
    JOIN (
           SELECT
    
sum(f.cases) as number_of_cases,
a.month
FROM
    "NAYAN.JAIN".covid_19_case f, "NAYAN.JAIN".dates a
WHERE
        f.fk_location_id IN (
          SELECT l.location_id from "NAYAN.JAIN".locations l where l.states = '${req.body.state}') And
        f.fk_date_id = a.DATE_ID AND
        a.year = 2020
       group by a.month
       order by a.month
        
    ) res2 ON res1.month = res2.month
    `
    console.log(query1);
    var res1 = dbConnect(query1);
    
      resolve(res1);
    
  });
}
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

app.get("/total", (req, res, next) => {
  query1 = `select a.*, b.* from (select sum(NUM_ROWS) from (select table_name, num_rows from all_tables where owner = 'NAYAN.JAIN')) b, (select table_name, num_rows from all_tables where owner = 'NAYAN.JAIN') a`
  var res1 = dbConnect(query1);
  console.log(res1)
  res1.then(function (result) {
    res.send(result);
  });
});

app.get("/states", (req, res, next) => {
  query1 = `SELECT distinct states FROM  "NAYAN.JAIN".locations`
  var res1 = dbConnect(query1);
  console.log(res1)
  var oracleResponse = result.rows;
  var stateName= oracleResponse.map(function(x) {
    return {
      state: x[0]
    };
  });
  var normalizedArray = stateName.map(function(obj) {
    return obj.state;
  });
  res1.then(function (result) {
    // here you can use the result of promiseB
    console.log("Hi", normalizedArray);
    res.json(normalizedArray);
  });
});


app.get("/chart", (req, res, next) => {
  query1 = `WITH cases_and_vaccinations as
  (select l.state_id, sum(c.cases) as TOTAL_CASES, sum(v.daily_vaccination) as TOTAL_VACCINATIONS from "NAYAN.JAIN".covid_19_case c, "NAYAN.JAIN".dates d, "NAYAN.JAIN".locations l , "NAYAN.JAIN".covid_19_vaccination v
  where c.fk_date_id = d.date_id and c.fk_location_id = l.location_id and v.fk_location_id = l.location_id and v.fk_date_id = d.date_id
  group by l.state_id 
  order by l.state_id),
  states_with_ids as
  (SELECT state_id, s.population_density from "NAYAN.JAIN".state s, "NAYAN.JAIN".locations l  WHERE l.states = s.states group by state_id, s.population_density)
  SELECT st.state_id,TOTAL_CASES,TOTAL_VACCINATIONS, st.population_density  FROM cases_and_vaccinations cv , states_with_ids st
  WHERE st.state_id = cv.state_id`
  var res1 = dbConnect(query1);
  console.log("Chart", res1)
  res1.then(function (result) {
   res.send(result)
  });
});


app.post('/flight-frequency', function (req, res) {
  console.log(req.body.state)
  flightQueryPromise(req).then(res1 => {
      // here you can use the result of promiseB
      var airplane =[];
      cases=[];
      flight =[];

ct =1
for(a of res1.rows){
  for(;ct<7;ct++){
    if(a[1]!=ct){
      airplane.push({
        "cases":0,
        "flight":0
      })
     
    }
    else{
      ct++;
      break;
    }
  }
  airplane.push({
    "cases":a[2],
    "flight":a[0]
  })  
}
airplane.forEach(function (arrayItem) {
  cases.push(arrayItem.cases);
  flight.push(arrayItem.flight);
});
result["cases"] = cases
result["flight"] = flight
      console.log("Hi",result);
      res.send(result)
   
  },reject=>{
    console.log(reject);
  })
})

app.post('/airline-management', function (req, res) {
  console.log(req)
  
  airlinemanagementPromise(req).then(res1 => {
    // here you can use the result of promiseB
    var airplane ={};
const mySet1 = new Set()
for(a of res1.rows){
  mySet1.add(a[2]) 
}
//console.log(mySet1)
var ct = 0;
for (const value of mySet1 ) {
  flightfrequency =[]
  //console.log(value);
  ct=0
  for (a of res1.rows) {
    if(a[2] == value){
      for(;ct<24;ct++){
        if(a[1]!=ct){
          flightfrequency.push(0);   
        }
        else{
          ct++;
          break;
        }
      }
        flightfrequency.push(a[0]);
      
    }
  }
  airplane[value] = flightfrequency
}
    console.log("Hi",airplane);
    res.send(airplane)
 
},reject=>{
  console.log(reject);
})
})

app.post('/airline-performance', function (req, res) {
  console.log(req)
  
  query1 = `SELECT DISTINCT ac.unique_carrier, d.month, count(*) as cancelled_flight
  FROM "NAYAN.JAIN".Flights f, "NAYAN.JAIN".airline_company ac, "NAYAN.JAIN".dates d
  WHERE f.fk_airline_id=ac.airline_id and f.cancelled = 1 and d.date_id=f.fk_date_id
  GROUP BY ac.unique_carrier, d.month
  order by ac.unique_carrier asc`
  var res1 = dbConnect(query1);

  //console.log(res1)
  var airplane ={};
const mySet1 = new Set()
  res1.then(function(result) {
    // here you can use the result of promiseB
    for (a of result.rows) {
      mySet1.add(a[0]) 
  }
  //console.log(mySet1)
  for (const value of mySet1 ) {
      flightfrequency =[]
      for (a of result.rows) {
          if(a[0] == value){
              flightfrequency.push(a[2]);
          }
      }
      airplane[value] = flightfrequency
    }
    
    console.log("Hi",airplane);
    res.send(airplane)
});  
})

app.post('/covid-analysis', function (req, res) {
  console.log(req)
  covidanalysisPromise(req).then(res1 =>{
    console.log(res1)
  
    // here you can use the result of promiseB
    var state = [];
    var area = [];
    var cases = [];
    var response ={}
    let i = 0
    //airplane[state] = []
    for(a of result.rows){
if(i>0){
  state.push(a[0]);
  area.push(a[1]/10);
  cases.push(a[2]);
}
i = i +1;
    }
    response["state"] = state
    response["area"] = area
    response["cases"] = cases
    res.send(response)
  },reject=>{
    console.log(reject);
  })
})


app.post('/covid-impact', function (req, res) {
  console.log(req)
  
  query1 = `SELECT
  traveler_throughput,
  cases,
  vaccinations,
  m_month,
  m_year
FROM
  (
      SELECT
          *
      FROM
          (
              SELECT
                  SUM(t.traveler_throughput) AS traveler_throughput,
                  d.month                    AS m_month,
                  year                       AS m_year
              FROM
                  "NAYAN.JAIN".traveler_throughput t,
                  "NAYAN.JAIN".dates               d
              WHERE
                  t.fk_date_id = d.date_id
              GROUP BY
                  d.month,
                  year
              ORDER BY
                  year ASC,
                  d.month ASC
          ) res1
          LEFT JOIN (
              SELECT
                  SUM(c.cases) cases,
                  d.month,
                  year
              FROM
                  "NAYAN.JAIN".covid_19_case c,
                  "NAYAN.JAIN".dates          d
              WHERE
                  c.fk_date_id = d.date_id
              GROUP BY
                  d.month,
                  year
              ORDER BY
                  year ASC,
                  d.month ASC
          ) res2 ON res1.m_month = res2.month
                    AND res1.m_year = res2.year
  ) res3
  LEFT JOIN (
      SELECT
          SUM(c.daily_vaccination) AS vaccinations,
          d.month,
          year
      FROM
          "NAYAN.JAIN".covid_19_vaccination c,
          "NAYAN.JAIN".dates                d
      WHERE
          c.fk_date_id = d.date_id
      GROUP BY
          d.month,
          year
      ORDER BY
          year ASC,
          d.month ASC
  ) res4 ON res3.m_year = res4.year
            AND res3.m_month = res4.month
ORDER BY
  m_year ASC,
  m_month ASC`
  var res1 = dbConnect(query1);

  console.log(res1)
  res1.then(function(result) {
    var flight = [];
var cases = [];
var vaccine = [];
var output ={}
    // here you can use the result of promiseB
    for(a of result.rows){
      if(a[0] == null){
        flight.push(0)
      }
      else{
        flight.push(a[0])
      }
      if(a[1] == null){
        cases.push(0)
      }
      else{
        cases.push(a[1]*10)
      }
      if(a[2] == null){
        vaccine.push(0)
      }
      else{
        vaccine.push(a[2])
      }
      
    }
    output["flight"] = flight
    output["cases"] = cases
    output["vaccine"] = vaccine
    res.send(output)
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