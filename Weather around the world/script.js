const searchbar = document.querySelector(".searchInput");
const toggleButton = document.querySelector(".unit");


//loading screen
window.onload = () => {
    const loader = document.querySelector('.loader-div');
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1500);
}

//dealing with metric and imperial system
let unit = "metric";
let isMetric = true;

toggleButton.addEventListener("click", () => {
    isMetric = !isMetric;
    
    if(isMetric){
        unit = "metric";
    }else{
        unit = "imperial";
    }
    weather.search_reload();
})


//api
let city = "";
let tz = 0;

let weather = {
    "apiKey": "db08a99b37dc6918d2151f9adaf8a6e2",
    fetchWeather: function(cityName) {
        city = cityName;
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=" + unit + "&appid=" + this.apiKey)
        .then((response) => {
            if (!response.ok) {
              console.log("No city found at that name.")
              document.querySelector(".weather").style.visibility = "hidden";
              document.querySelector(".error_msg").style.visibility = "visible";
              throw new Error(response.status);
            }
            document.querySelector(".error_msg").style.visibility = "hidden";
            document.querySelector(".weather").style.visibility = "visible";
            return response.json();
          })
          .then((data) => this.displayWeather(data))
    },
    displayWeather: function(data) {
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity, feels_like} = data.main;
        const {speed} = data.wind;
        const {timezone} = data;
        tz = timezone;
        console.log(name, icon, description, temp, humidity, speed, feels_like, timezone)
        document.querySelector("#city").innerText = name;
        if(isMetric){
            document.querySelector("#temp").innerText = temp.toFixed(1) + " °C";
            document.querySelector("#feels-like").innerText = "Feels like: " + feels_like.toFixed(1) + " °C";
            document.querySelector("#wind-speed").innerText = "Wind speed: " + speed + " m/s";
            document.querySelector("#humidity").innerText = "Humidity: " + humidity + "%";
        }else{
            document.querySelector("#temp").innerText = temp.toFixed(1) + " °F";
            document.querySelector("#feels-like").innerText = "Feels like: " + feels_like.toFixed(1) + " °F";
            document.querySelector("#wind-speed").innerText = "Wind speed: " + speed + " MPH";
            document.querySelector("#humidity").innerText = "Humidity: " + humidity;
        }
        document.querySelector("#icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector("#description").innerText = description.toUpperCase();
    },
    searching: function() {
        this.fetchWeather(searchbar.value);
    },

    search_reload: function() {
        this.fetchWeather(city);
    },

};

//dealing with time
let AM_PM = "AM"; //am = before midday
const timeInt = setInterval(() => {
    let date = new Date();
    let utc_hour = date.getUTCHours();
    let utc_minutes = date.getUTCMinutes();
    let utc_seconds = date.getUTCSeconds();
    let hour = 0;
    let diff_in_hours = parseInt(tz/3600);
    if(tz % 3600 == 0){

        hour = utc_hour + (diff_in_hours);
        if(hour >= 24){
            AM_PM = "AM";
            hour -= 24;
        }
        else if(hour >= 12){
            AM_PM = "PM";
            hour -= 12;
            if(hour == 0){
                hour = 12;
            }
        else if(hour < 0){
            hour = abs(hour);
            AM_PM = "PM";
        }
        }else{
            AM_PM = "AM";
        }

        if(hour == 12){
            AM_PM = "PM";
        }

        if(hour < 0){
            hour += 12;
        }
    }else{
        hour = utc_hour + (diff_in_hours); 
        if( tz > 0){
            m_minute = (tz % 3600)/60;
            hour = utc_hour + (diff_in_hours); 
            utc_minutes += m_minute;

            if(utc_minutes >= 60){
                utc_minutes -= 60;
                hour += 1;
            }

            if(hour >= 24){
                AM_PM = "AM";
                hour -= 24;
            }
            else if(hour >= 12){
                AM_PM = "PM";
                hour -= 12;
                if(hour == 0){
                    hour = 12;
                }
            }else{
                AM_PM = "AM";
            }

            if(hour == 12){
                AM_PM = "PM";
            }
            if(hour < 0){
                hour += 12;
            }

        //if diff is negative
        }else{
            AM_PM = "AM";
            m_minute = (tz % 3600)/60;
            utc_minutes -= m_minute;

            if(utc_minutes < 0){
                utc_minutes += 60;
                hour -= 1;
            }

            if(hour >= 12){
                AM_PM = "PM";
                hour -= 12;
                if(hour == 0){
                    hour = 12;
                }
            }else if(hour < 0){
                hour = abs(hour);
                AM_PM = "PM";
            }
            else{
                AM_PM = "AM";
            }

            if(hour == 12){
                AM_PM = "PM";
            }

            if(hour < 0){
                hour += 12;
            }
        }
    }

    if(utc_minutes < 10 && utc_seconds < 10 ){
        document.querySelector(".clock").innerHTML = hour + ":0" + utc_minutes + ":0" + utc_seconds + " " + AM_PM;
    }
    else if(utc_seconds < 10){
        document.querySelector(".clock").innerHTML = hour + ":" + utc_minutes + ":0" + utc_seconds + " " + AM_PM;
    }
    else if(utc_minutes < 10){
        document.querySelector(".clock").innerHTML = hour + ":0" + utc_minutes + ":" + utc_seconds + " " + AM_PM;
    }else{
        document.querySelector(".clock").innerHTML = hour + ":" + utc_minutes + ":" + utc_seconds + " " + AM_PM;    
    }
    }, 0
);

setInterval(timeInt, 1000);

//searching
document.querySelector(".searchButton").addEventListener("click", function () {
    if(searchbar.value){
        weather.searching();
    }
});

searchbar.addEventListener("keyup", function (event){
    if (event.key == "Enter"){
        if (searchbar.value){
            console.log(event);
            weather.searching();
            searchbar.value = "";
        }
    }
});

weather.fetchWeather("Gyula");