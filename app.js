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

var searchLocation = "";

$(document).ready(function () {
  const apiKey = "0dc8f315d2fd037983a62989954e536c";

  $("#search-btn").on("click keypress", function (e) {
    if (e.which === 13 || e.type === "click") {
      searchLocation = $("#city-search").val();
      if (!recentSearches.includes(searchLocation) && searchLocation) {
        recentSearches.unshift(searchLocation);
        var searchBtns = $("#recent-searches");
        recentSearches.forEach((item) => {
          var newBtn = $("<button>");
          newBtn.addClass("btn btn-secondary");
          newBtn.attr("type", "button");
          newBtn.text(item);

          searchBtns.append(newBtn);
        });
      }
      console.log(searchLocation);
      console.log(recentSearches);

      weatherStuff(searchLocation);
    }
  });

  function weatherStuff(location) {
    theWeather.location = location;
    var query = location; // Text from search or default or current
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      query +
      "&appid=" +
      apiKey +
      "&units=imperial";
    var UVurl = "";
    $.get(queryURL, function (weatherData) {
      console.log(weatherData);
      theWeather.temp = weatherData.main.temp;
      theWeather.windSpeed = weatherData.wind.speed;
      theWeather.humidity = weatherData.main.humidity;
      theWeather.description = weatherData.weather[0].description;
      var icon = weatherData.weather[0].icon;
      theWeather.iconURL =
        "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      var lat = weatherData.coord.lat;
      console.log(lat);
      var lon = weatherData.coord.lon;
      console.log(lon);
      UVurl =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey;
      console.log(UVurl);

      //   get UV index
      $.get(UVurl, function (UVdata) {
        theWeather.uvi = UVdata.value;
        console.log(UVdata);
        console.log(theWeather);

        // Set html with values
        wLocation.text(theWeather.location);
        wTemp.text(theWeather.temp);
        wHumidity.text(theWeather.humidity);
        wIcon.attr("src", theWeather.iconURL);
        wWind.text(theWeather.windSpeed);
        wUVI.text(theWeather.uvi);
      });
    });
  }

  weatherStuff(defaultLocation);
});
