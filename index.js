const axios = require('axios');
const express = require('express');
const app = express();
const apiUrl = 'http://api.nbp.pl/api/exchangerates/tables/a/';
const ejs = require("ejs");

function fetchData() {
    axios.get(apiUrl)
      .then((response) => {
        jsonData = response.data[0].rates;
        lastDataFetchTimestamp = Date.now();
        console.log('Data refreshed at', new Date());
      })
      
  }
  fetchData();
  setInterval(fetchData, 300000);


app.set('view engine', 'ejs');
app.use((req, res, next) => {
    const currentTime = Date.now();
    const przestarzale = currentTime - lastDataFetchTimestamp >= 300000; 
    if (przestarzale) {
      fetchData(); 
      console.log("odswiezono dane")
    }
    next();
  });
  
app.get('/', (req, res) => {
    res.render("index", {text: 'Index'})
    if (jsonData) {
        const EURO = jsonData.find((item) => item.code === 'EUR');
        const GBP = jsonData.find((item) => item.code === 'GBP');
        const USD = jsonData.find((item) => item.code === 'USD');
        if (USD) {
          const foundObjectJSON = JSON.stringify(USD, null, 2);
          console.log(foundObjectJSON);
        } 

        if (GBP) {
          const foundObjectJSON = JSON.stringify(GBP, null, 2);
          console.log(foundObjectJSON);
        } 

        if (EURO) {
          const foundObjectJSON = JSON.stringify(EURO, null, 2);
          console.log(foundObjectJSON);
        }
    }
        
    
})



app.get('/euro', (req, res) => {
    if (jsonData) {
        const EURO = jsonData.find((item) => item.code === 'EUR');
        if (EURO) {
          const foundObjectJSON = JSON.stringify(EURO, null, 2);
          console.log(foundObjectJSON);
          res.send(foundObjectJSON);
        }
    }});
        



app.get('/frank', (req, res) => {
    if (jsonData) {
        const GBP = jsonData.find((item) => item.code === 'GBP');
        if (GBP) {
          const foundObjectJSON = JSON.stringify(GBP, null, 2);
          console.log(foundObjectJSON);
          res.send(foundObjectJSON);
        }
    }

});
    
app.get('/dolar', (req, res) => {
    if (jsonData) {
        const USD = jsonData.find((item) => item.code === 'USD');
        if (USD) {
          const foundObjectJSON = JSON.stringify(USD, null, 2);
          console.log(foundObjectJSON);
          res.send(foundObjectJSON);
        } 
    }});




app.listen(8081)

