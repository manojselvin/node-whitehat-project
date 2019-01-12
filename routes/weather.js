require('../server/config/config');

var express = require('express');
var router = express.Router();
var History = require('../server/models/history');
var path = require('path');
var request = require('request');

const WEATHER_API_KEY = 'd85203b77d7c0c795688665836299f8e';

/* GET weather search page. */
router.get('/', function(req, res, next) {
  
  getUserWeatherSearchHistory(req);

  function getUserWeatherSearchHistory(req) {
    
    History.find({userId: req.session.user._id}, function(err, history) {
      if(err) {
        res.render('weather/index', {user: req.session.user, userSearchHistory: []});
      } else {
        res.render('weather/index', {user: req.session.user, userSearchHistory: history});
      }
    });
  }

  
  // return res.sendFile(path.join(__dirname + '/../server/views/weather/index.html'));
});

router.post('/', function(req, res, next) {
  let cityName = req.body.cityName;
  
  // Saving search history
  saveToHistory(cityName, req);
  
  let url = `http://api.openweathermap.org/data/2.5/weather?mode=json&APPID=${WEATHER_API_KEY}&q=${cityName}`;

  request(url, function (error, response, body) {
    if (response && response.statusCode == 200) {
      // res.send(JSON.parse(response.body));
      let resp = JSON.parse(response.body);
      let weatherData = formatWeatherData(resp);
      
      res.send({status: 'success', msg: 'Weather Data Fetched', data: {weatherData}})
    } else {
      let weatherData = {cityName};
      res.status(404).send({status: 'error', msg: 'Invalid City Name', data: {weatherData}})
    }

    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });

  // Format weather data to required format
  function formatWeatherData(resp) {
    return {
      cityName: resp.name,
      temperature: {
        kelvin: Math.round(resp.main.temp * 100) / 100,
        deg: Math.round((resp.main.temp - 273.15) * 100) / 100,
        fahren: Math.round((resp.main.temp - 273.15) * 9/5 + 32 * 100) / 100, 
      },
      humidity: resp.main.humidity,
      windSpeed: resp.wind.speed,
      imgSrc: `http://openweathermap.org/img/w/${resp.weather[0].icon}.png`,
    };
  }

  function saveToHistory(cityName, req) {
    let historyData = {
      cityName: cityName,
      userId: req.session.user._id,
      createdAt: Date.now()
    };

    History.create(historyData, function (error, history) {
      if (error) {
          return false;
      } else {
        return true;
      }
    });
  }
  
});

module.exports = router;
