/* 

 Current location button: 
    if exist in local storage get it and display weather
    if doesnt exist
        Ask for user location and set in local storage on
    

If no set default location to Seattle
If user searches add search to beginning list that is stored in localstorage and used to create elements

set current display location in localstorage as user first then default then searched - this inital set only happens if there is nothing in localstorage otherwise it persists from previous 


Make API calls on page load or on location search/click of location button

On load 
    get list of previous searches from object
    create button elements and append to #recent-searches div (bootstrap btn-group-vertical)

    Get/set current display location in local storage
        get current location if set
        else use last searched
        else use default of Seattle

    Get location
    use location to make API call 1: current weather
    parse data
    display data in current weather div

    use location to make API call 2: Extended forecast
    parse data
    display data in tiles 1-5

    get future dates using JS date objects 
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

    Format date (from w3resource exercise)
        var today = new Date();
        var dd = today.getDate();

        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10) 
        {
        dd='0'+dd;
        } 

        if(mm<10) 
        {
        mm='0'+mm;
        } 
        today = mm+'-'+dd+'-'+yyyy;
        console.log(today);
        today = mm+'/'+dd+'/'+yyyy;
        console.log(today);
        today = dd+'-'+mm+'-'+yyyy;
        console.log(today);
        today = dd+'/'+mm+'/'+yyyy;
        console.log(today);
*/

var wLocation = $(".selected-location");
var wIcon = $(".current-icon");
var wTemp = $(".temp");
var wHumidity = $(".humidity");
var wWind = $(".wind-speed");
var wUVI = $(".uv-index");
var infoP =$(".info-text")
const apiKey = "0dc8f315d2fd037983a62989954e536c";



var theWeather = {
  location: "",
  windSpeed: "",
  description: "",
  humidity: "",
  iconURL: "",
  uvi: "",
};

var theForecast = [
  {
    day: 1,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
  {
    day: 2,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
  {
    day: 3,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
  {
    day: 4,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
  {
    day: 5,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
];

var recentSearches = [];

var defaultLocation = "seattle";


var useCurrent = false;


  



$(document).ready(function () {

  var searchLocation = "";
  var currentLocation = "";

  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    useCurrent = true;
    currentLocation= "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon="+ longitude + "&appid=" + apiKey + "&units=imperial";
    infoP.css("display", "none")
    console.log(currentLocation)
    weatherStuff(currentLocation)
  }

  function error() {
    infoP.text('Unable to retrieve your location');
  }

  $("#current-btn").on("click", function() {
    infoP.css("display", "block")
    if(!navigator.geolocation) {
        infoP.text('Geolocation is not supported by your browser');
      } else {
        infoP.text('Locating…');
        navigator.geolocation.getCurrentPosition(success, error);
      }
  })



  $("#search-btn").on("click", function () {
      useCurrent = false;
    infoP.css("display", "none")

    searchLocation = $("#city-search").val();
    $("#city-search").val("");
    // console.log(searchLocation);
    // console.log(recentSearches);

    weatherStuff(searchLocation);
  });

  $("#city-search").on("keypress", function (e) {
    if (e.which == 13) {
      $("#search-btn").click();
    }
  });

  function weatherStuff(location) {
      useCurrent ? theWeather.location = "Your Location" : theWeather.location = location;
    var lat = "";
    var lon = "";
    var query = location; // Text from search or default or current
    var queryURL = "";

    useCurrent ? queryURL = currentLocation : queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=imperial";


    var UVurl = "";
    var forecastURL = "";
    
    $.get(queryURL, function (weatherData) {
    //   console.log(weatherData);
      theWeather.temp = Math.round(weatherData.main.temp);
      theWeather.windSpeed = weatherData.wind.speed;
      theWeather.humidity = weatherData.main.humidity;
      theWeather.description = weatherData.weather[0].description;
      var icon = weatherData.weather[0].icon;
      theWeather.iconURL =
        "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      lat = weatherData.coord.lat;
    //   console.log(lat);
      lon = weatherData.coord.lon;
    //   console.log(lon);
      UVurl =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey;
    //   console.log(UVurl);
      
      forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon="+ lon + "&exclude=hourly,minutely&appid=" + apiKey + "&units=imperial"

      //   get UV index
      $.get(UVurl, function (UVdata) {
        theWeather.uvi = UVdata.value;
        // console.log(UVdata);
        // console.log(theWeather);

        // Set html with values
        wLocation.text(theWeather.location);
        wTemp.text(theWeather.temp);
        wHumidity.text(theWeather.humidity);
        wIcon.attr("src", theWeather.iconURL);
        wWind.text(theWeather.windSpeed);
        wUVI.text(theWeather.uvi);

        $.get(forecastURL, function(forecastData) {
            console.log(forecastData)
            for (var i = 0; i < 5; i++) {
                var day = forecastData.daily[i+1];
                console.log(day)
                var num = i; // had to use num instead of 
                var date = moment.unix(day.dt).format("ddd, MM/DD")
                console.log(theForecast[num])
                theForecast[i]["date"] = date;
                theForecast[i]["temp"] = Math.round(day.temp.day);
                theForecast[i]["humidity"] = day.humidity;
                var iconID = day.weather[0].icon;
                var iconURL = "http://openweathermap.org/img/wn/" + iconID + "@2x.png";
                theForecast[i]["icon"] = iconURL;
                console.log(theForecast) // returns object
            }

            var forecastTile = $(".tile");
            forecastTile.each(function (i, element) {
                console.log(element)
                $(element).find(".date").text(theForecast[i].date)
                $(element).find(".future-temp").text(theForecast[i].temp)
                $(element).find(".future-humidity").text(theForecast[i].humidity)
                $(element).find(".fas").css("display", "none")
                $(element).find(".weather-icon").attr("src", theForecast[i].icon)
            })
         })
      });
    })
      .done(function () {
        console.log("found");
        searchList();
      })
      .fail(function () {
          if (searchLocation) {
            infoP.text("Could not find " + searchLocation);
            infoP.css("display", "block")
          } else {
            infoP.text("Please enter a location");
            infoP.css("display", "block")
          }
        
        failure = true;
        console.log("Failure to search");
      });
  }

  weatherStuff(defaultLocation);

  function searchList() {
    if (!recentSearches.includes(searchLocation) && searchLocation) {
      recentSearches.unshift(searchLocation);
      var searchBtns = $("#recent-searches");
      searchBtns.empty();
      
      recentSearches.forEach((item) => {
        var newBtn = $("<button>");
        newBtn.addClass("btn btn-secondary");
        newBtn.attr("type", "button");
        newBtn.text(item);

        searchBtns.append(newBtn);
      });
    }
  }
});
