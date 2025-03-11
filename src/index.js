import './styles.css';
import './assets/webfontkit-Achemost_and_Hawthorne/stylesheet2.css';
import './assets/webfontkit-Merriweather/stylesheet.css';
import './assets/images/yue-su-YAXSmnTcAh8-unsplash.jpg';
import 'weather-icons/css/weather-icons.min.css';


import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";



const weatherIcons = {
    snow: "wi wi-snow",
    "snow-showers-day": "wi wi-day-snow-thunderstorm",
    "snow-showers-night": "wi wi-night-showers",
    "thunder-rain": "wi wi-thunderstorm",
    "thunder-showers-day": "wi wi-day-thunderstorm",
    "thunder-showers-night": "wi wi-night-thunderstorm",
    rain: "wi wi-rain",
    "showers-day": "wi wi-day-showers",
    "showers-night": "wi wi-night-showers",
    fog: "wi wi-fog",
    wind: "wi wi-windy",
    cloudy: "wi wi-cloudy",
    "partly-cloudy-day": "wi wi-day-cloudy",
    "partly-cloudy-night": "wi wi-night-cloudy",
    "clear-day": "wi wi-day-sunny",
    "clear-night": "wi wi-night-clear",
};

function capitalizeFirstLetter(str) {
    let newString = str.trim();
    return newString.charAt(0).toUpperCase() + newString.slice(1);
}

function removeAllClasses(){
    const ALL_DIV = document.getElementById('all');
    ALL_DIV.classList.remove(...ALL_DIV.classList);
}


const weatherData = async function getWeatherData(location) {
    const VC_KEY = "UCZUQNM6UTG4NTYL8FS9Z54K9";
    const currentDate = format(new Date(), "yyyy-MM-dd");
    // console.log(currentDate);
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${currentDate}?key=${VC_KEY}&include=current&unitGroup=metric`;
    try {
        const response = await fetch(url, { mode: "cors" });
        const weatherData = await response.json();
        // console.log(weatherData);
        const weatherConditions = weatherData.days[0].conditions;
        let temperature = null;
        let precip = null;
        let precipType = null;
        let weatherIcon = null;
        if (weatherData.currentConditions) {
            temperature = weatherData.currentConditions.temp;
            precip = weatherData.currentConditions.precip;
            precipType = weatherData.currentConditions.preciptype;
            weatherIcon = weatherData.currentConditions.icon;
        } else {
            temperature = weatherData.days[0].temp;
            precip = weatherData.days[0].precip;
            precipType = weatherData.days[0].preciptype;
            weatherIcon = weatherData.days[0].icon;
        }
        const address = weatherData.resolvedAddress;
        const addressInEnglish = weatherData.address;
        const locationTimeZone = weatherData.timezone;
        const latitude = weatherData.latitude;
        const longitude = weatherData.longitude;

        // console.log({
        //     weatherConditions,
        //     temperature,
        //     precip,
        //     precipType,
        //     weatherIcon,
        //     address,
        //     locationTimeZone,
        //     latitude,
        //     longitude,
        //     addressInEnglish
        // });
        return {
            weatherConditions,
            temperature,
            precip,
            precipType,
            weatherIcon,
            address,
            locationTimeZone,
            latitude,
            longitude,
            addressInEnglish
        };
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

const weatherDetails = async function weatherDetailsCollection(locationValue) {
    // console.log(locationValue);
    const weatherInfo = await weatherData(locationValue);
    // console.log(weatherInfo);
    if (weatherInfo) {

        document.getElementById(
            "main-weather-feature"
        ).textContent = `Conditions: ${weatherInfo.weatherConditions}`;
        document.getElementById(
            "temperature"
        ).textContent = `Temperature: ${weatherInfo.temperature}°C`;

        document.getElementById("location-display").textContent = weatherInfo.address;

        if (weatherInfo.precip || weatherInfo.precipType) {
            let preciptypeText = capitalizeFirstLetter(
                weatherInfo.precipType.join(", ")
            );
            document.getElementById(
                "precipitation"
            ).textContent = `Precipitation: ${preciptypeText} (${weatherInfo.precip})`;
        } else {
            document.getElementById("precipitation").textContent = "";
        }

        const weatherIconDescription = weatherInfo.weatherIcon;
        removeAllClasses();
        document.getElementById('all').classList.add(weatherIconDescription);
        // Get the appropriate icon class
        const iconClass =
            weatherIcons[weatherIconDescription] || "wi wi-na";
        // Apply the icon to an element
        document.getElementById("weather-icon").className = iconClass;
        const searchedTimeZone = weatherInfo.locationTimeZone;
        const date = new Date();
        const zonedDate = toZonedTime(date, searchedTimeZone);
        const formattedTime = format(zonedDate, "hh:mm aaa", {
            searchedTimeZone,
        });
        const formattedDate = format(zonedDate, "dd-MM-yyyy", {
            searchedTimeZone,
        });
        // console.log("Searched Time:", formattedTime);
        // console.log("Searched Date:", formattedDate);
        document.getElementById(
            "current-date"
        ).textContent = `Date: ${formattedDate}`;
        document.getElementById(
            "current-time"
        ).textContent = `Time: ${formattedTime}`;

        const this_latitude = weatherInfo.latitude;
        const this_longitude = weatherInfo.longitude;

        const this_latitudeDMS = convertToDMS(this_latitude, 'lat');
        const this_longitudeDMS = convertToDMS(this_longitude, 'long');

        document.getElementById('coordinates').textContent = `(${this_latitudeDMS},     ${this_longitudeDMS})`;
    } else {
        document.getElementById("current-date").textContent = "Date: -";
        document.getElementById("current-time").textContent = "Time: -";
        document.getElementById("precipitation").textContent =
            "Precipitation: -";
        document.getElementById("location-display").textContent =
            "Location Unavailable";
        document.getElementById("main-weather-feature").textContent =
            "Conditions: N/A";
        document.getElementById("temperature").textContent =
            "Temperature: N/A";
        document.getElementById('coordinates').textContent = '(-)';
        document.getElementById("weather-icon").className = "wi wi-na";
    }
    // upDate();
    // upTime();
    // console.log("Test data");
};

const handleFormData = function formDataHandling() {
    const myForm = document.getElementById("location-form");
    myForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const locationValue = document.getElementById("location").value;
        // console.log(locationValue);

        weatherDetails(locationValue);
        document.getElementById("location").value = "";
    });
};

handleFormData();


function convertToDMS(decimal, type) {
    const degrees = Math.floor(Math.abs(decimal));
    const minutesFloat = (Math.abs(decimal) - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = ((minutesFloat - minutes) * 60).toFixed(2);

    const direction = 
        type === "lat" 
            ? (decimal >= 0 ? "N" : "S") 
            : (decimal >= 0 ? "E" : "W");

    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};



function initializeDisplay() {
    const modernCities = [
        "Tokyo", 
        "New York", 
        "London", 
        "Shanghai", 
        "Dubai", 
        "Singapore", 
        "Seoul", 
        "Hong Kong", 
        "San Francisco", 
        "Berlin",
        "Paris", 
        "Sydney", 
        "Toronto", 
        "Los Angeles", 
        "Beijing", 
        "Chicago", 
        "Amsterdam", 
        "Barcelona", 
        "Mumbai", 
        "São Paulo",
        "Lagos"
    ];

    const arrayLength = modernCities.length;
    const randomCityIndex = Math.floor(Math.random() * arrayLength);
    weatherDetails(modernCities[randomCityIndex]);
};

initializeDisplay();
