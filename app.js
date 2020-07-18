/* 

 Current location button: 
    if exist in local storage get it and display weather
    if doesnt exist
        Ask for user location and set in local storage on
    

If no set default location to Seattle
If user searches add search to a list that is stored in localstorage

set current display location in localstorage as user first then default then searched - this inital set only happens if there is nothing in localstorage otherwise it persists from previous 


Get location
use location to make API call 1: current weather
    parse data
    display data in current weather div

use location to make API call 2: Extended forecast
    parse data
    display data in tiles 1-5

*/