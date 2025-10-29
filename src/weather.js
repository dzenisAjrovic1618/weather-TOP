const btn = document.querySelector("button");
import {API_KEY} from "./config"
// const api = API_KEY;
const main = document.querySelector("main");

// import 

class City {
    constructor(name){
        this.name = name;
        this.lat = null;
        this.lon = null;
        this.country = null;
        this.city = null;
    }
    async getCity() {
        try {
            const geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${this.name}&limit=1&appid=${API_KEY}`);
            if(!geo.ok){
                console.warn("Please enter a valid City!");
                return;
            }
            const geoData = await geo.json();
            if (geoData.length === 0) {
                console.warn("City not found!");
                return;
            }
            
            if (geoData.length === 0) {
                console.warn("Please enter a valid city!");
                return;
            }
            console.log(geoData);
            this.lat = geoData[0].lat;
            this.lon = geoData[0].lon;
            this.country = geoData[0].country; // optional 
                console.log(this.lat);
                console.log(this.lon);
                console.log(this.country); //   TEMPORARY, creating via DOM soon
            }
            catch(error) {
                console.error("Something went wrong: ", error);
            }
        }
    }
    
    class Weather extends City {
        constructor(name) {
            super(name);    
            this.temperature = null;
            this.description = null;
            this.tempMax = null;
            this.feelsLike = null;
            this.visibility = null;
            this.timezone = null;
            this.clouds = null;
            this.wind = null;
        }
        async getWeather() {
            const unit = "metric";
            const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${API_KEY}&units=${unit}`);
            const weatherData = await weather.json();
            console.log(weatherData);

            main.innerHTML = "";
            
            const createElements = (() => {
                const container = document.createElement("div");
                container.classList.add("weatherContainer");
                const name = document.createElement("h1");
                name.classList.add("name");
                name.textContent = weatherData.name;
                
                const cityDom = document.createElement("p");
                cityDom.textContent = this.city;
                
                const temperature = document.createElement("h1");   //  Current Temperature
                temperature.classList.add("temperature")
                this.temperature = Math.round(weatherData.main.temp);
                temperature.textContent = `${this.temperature} \u00B0C`;
                
                const description = document.createElement("p");   // Description
                description.classList.add("description");
                let desc = () => {
                    return weatherData.weather[0].description
                    .trim()
                    .split(/\s+/)
                    .map(word => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ");
                }
                this.description = desc();
                description.textContent = `${this.description}`;

                const country = document.createElement("p");
                country.classList.add("country");
                country.textContent = `Country: ${this.country}`;

                const feelsLike = document.createElement("p");
                feelsLike.classList.add("feelsLike");
                this.feelsLike = Math.round(weatherData.main.feels_like);
                feelsLike.textContent = `Feels like: ${this.feelsLike} \u00B0C`;

                const visibility = document.createElement("p");
                visibility.classList.add("visibility");
                this.visibility = weatherData.visibility;
                visibility.textContent = `Visibility: ${(this.visibility / 1000).toFixed(1)} km`;

                const timeZone = document.createElement("p");
                timeZone.classList.add("timeZone");
                this.timezone = weatherData.timezone;
                timeZone.textContent = `Timezone: ${this.timezone / 3600} UTC`;

                const clouds = document.createElement("p");
                clouds.classList.add("clouds");
                this.clouds = weatherData.clouds.all;
                clouds.textContent = `Clouds: ${this.clouds}%`;


                const wind = document.createElement("p");
                wind.classList.add("wind");
                this.wind = weatherData.wind.speed;
                wind.textContent = `Wind: ${this.wind} m/s`;

                const infos = document.createElement("div");
                infos.classList.add("infos");

                const infos3 = document.createElement("div");
                infos3.classList.add("infos3");

                const infos2 = document.createElement("div");
                infos2.classList.add("infos2");
                
                const mainInfos = document.createElement("div");
                mainInfos.classList.add("mainInfos");
                mainInfos.append(name,temperature,description);
                infos3.append(visibility,clouds,wind);
                infos2.append(country,feelsLike,timeZone);
                infos.append(infos3,infos2);


                container.appendChild(mainInfos);
                container.appendChild(infos);
                main.appendChild(container);    
                // main.append(container);
            })();
    }
}

btn.addEventListener("click", async () => {
    const search = document.querySelector("#search").value;
    if(search.trim() === ""){
        console.log("Please enter a City"); //  pressing on search when input is empty
        return;
    }
    const cityWeather = new Weather(search); // NOTE:   only one weather object to be created. //   NOTE: done.
        await cityWeather.getCity();
        await cityWeather.getWeather();
})
