// Current Date
var dateEl = document.getElementById("date");
dateEl.innerText = moment().format("MMMM Do, YYYY");

// Create An Array of Cities
var cityArr = []
if (localStorage.getItem("Cities")) {
    cityArr = JSON.parse(localStorage.getItem("Cities"))
}

var appendImm = function () {
    // loop through cities and create list items
    function generateListItems (cityArr) {
        var cities = "";
        for (let i = 0; i < cityArr.length; i++) {
            cities += `<button class="prevCities">${cityArr[i]}</button>`;
        }
        return cities;
    } 

    // generateListItems(cityArr) and put it in unordered list
    document.querySelector(".searchHist").innerHTML = `
    <ul>
    ${generateListItems(cityArr)}
    </ul>
    `;

var items = $('.prevCities > ul').get();
items.sort(function(a,b){
  var keyA = $(a).text();
  var keyB = $(b).text();

  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
});
var ul = $('.prevCities');
$.each(items, function(i, ul){
  ul.append(li); /* This removes li from the old spot and moves it */
});


    console.log("before on click")
    // add Event Listener to search hist
    var searchCities = $(".prevCities")
    searchCities.on("click", function() {
        console.log("clicked", searchCities)
        var cityName = $(this).text()
        weather.fetchWeather(cityName)
    });
};

// fetch and display functions for all weather
var weather = {
    "apiKey": "f06df96322709f9b0254307f0735bb9c",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&units=imperial&appid=" 
        + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));

    },

    fetchUVI: function (data) {
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat="
        + data.coord.lat
        + "&lon="
        + data.coord.lon
        + "&units=imperial&appid=" 
        + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => {
            this.fiveDay(data)
            this.displayUVI(data)});
    },

    displayWeather: function (data) {
        var { name } = data;
        if (cityArr.includes(name) === false) {
            cityArr.push(name)
            localStorage.setItem("Cities", JSON.stringify(cityArr))
            appendImm();
        }
        
        var { icon, description } = data.weather[0];
        var { temp, humidity } = data.main;
        var { speed } = data.wind;
        
        document.getElementById("city").innerText = name;
        document.getElementById("temp").innerText = temp + "°F";
        document.getElementById("descr").innerText = description;
        document.getElementById("icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.getElementById("humid").innerText = "Humidity: " + humidity + "%";
        document.getElementById("speed").innerText = "Wind Speed: " + speed + " MPH";
        this.fetchUVI(data)
    },
    search: function () {
        this.fetchWeather(document.querySelector(".searchBar").value); 
    },

    displayUVI: function (data) {
        var { uvi } = data.daily[0];
        document.getElementById("uvi").innerText = uvi;


        // color code based on uv index
        if ( uvi > 0 && uvi < 5) {
            document.getElementById("uvi").setAttribute('style', "background-color: rgba(0, 128, 0, 0.419);");
        } else if (uvi > 5 && uvi < 7) {
            document.getElementById("uvi").setAttribute('style', "background-color: rgba(113, 128, 0, 0.419);")
        } else {
            document.getElementById("uvi").setAttribute('style', "background-color: rgba(128, 23, 0, 0.419);")
        }
    },

    // for loop for five day weather
    fiveDay: function (data) {
        var day = document.querySelector(".fiveDay");
        
        day.innerHTML = "";
        for (var i = 1; i < 6; i++) {
            console.log(moment(data.daily[i].dt,"X").format("MMMM Do, YYYY"));
            day.innerHTML += 
        `<div>
            <div id="date2">${moment(data.daily[i].dt,"X").format("MMMM Do, YYYY")}</div>
            <h2 id="temp">${data.daily[i].temp.day}°F</h2>
                <p class="iconDescr" id="descr">${data.daily[i].weather[0].description}
                <img class="iconDescr2" id="icon" src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png" alt=""></p>
            <p id="humid">Humidity: ${data.daily[i].humidity}%</p>
            <p id="speed">Wind Speed: ${data.daily[i].wind_speed} MPH</p>
        </div>`
        }
        
    }
};

// Event Listeners

// Generate City List Item When Enter Key Is Pressed While In Input Area 
document.querySelector(".searchBar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
    weather.search();
    generateListItems();
    }
});

// Generate City List Item When Search Button Is Clicked 

document.querySelector(".btn").addEventListener("click", function () {
    weather.search();
    generateListItems();
});

// Refreshes Placeholder Text For Input Area When Search Button Is Clicked

$(function(){

    $(".btn").on("click", function () {     
    return $('.searchBar').val('');
    });
    
});

// Clear Local Storage When Clear Button Is Clicked

document.querySelector(".clear").addEventListener("click", function () {
    localStorage.clear();
});

// Reload Page When Clear Button Is Clicked

const refreshButton = document.querySelector('.clear');

const refreshPage = () => {
    location.reload();
}

refreshButton.addEventListener('click', refreshPage)

// Neumorphism Search Bar

const input = document.querySelector(".finder__input");
const finder = document.querySelector(".finder");
const form = document.querySelector("form");

input.addEventListener("focus", () => {
  finder.classList.add("active");
});

input.addEventListener("blur", () => {
  if (input.value.length === 0) {
    finder.classList.remove("active");
  }
});

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  finder.classList.add("processing");
  finder.classList.remove("active");
  input.disabled = true;
  setTimeout(() => {
    finder.classList.remove("processing");
    input.disabled = false;
    if (input.value.length > 0) {
      finder.classList.add("active");
    }
  }, 1000);
});