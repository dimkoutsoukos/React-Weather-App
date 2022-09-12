import { useState, useEffect } from "react";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import Hourly from "./components/hourly/hourly";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

//main app function
function App() {

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

    //coordinates for Athens
    const [lat, lon] = [37.983810,23.727539];
    // constant for the fetch command, asking from the api to bring current weather data and future forecast
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    


    //useEffect is a hook used to actually make the api call once and stop further requests
    useEffect(() => {

      //actual async api call, bring data and proceeding for the second call before the first data handling is done
      Promise.all([currentWeatherFetch, forecastFetch])
        .then(async (response) => {
          const weatherResponse = await response[0].json();
          const forcastResponse = await response[1].json();

          setCurrentWeather({ city: 'Athens', ...weatherResponse });
          setForecast({ city: 'Athens', ...forcastResponse });
        })
        .catch(console.log);
    }, []);

  

  // form the shape of the app, creating the tabs for hourly and daily forecast
  const tab = document.querySelectorAll(".tab");
  const panel = document.querySelectorAll(".panel");
  //function to handle the changing of tabs
  function onTabClick(event) {


  
    for (let i = 0; i < tab.length; i++) {
      tab[i].classList.remove("active");
    }
  
    for (let i = 0; i < panel.length; i++) {
      panel[i].classList.remove("active");
    }
  
  
    //set the active tab
    event.target.classList.add('active');
    let classString = event.target.getAttribute('data-target');
    console.log("classString");
    document.getElementById('panels').getElementsByClassName(classString)[0].classList.add("active");
  }
  
  for (let i = 0; i < tab.length; i++) {
    tab[i].addEventListener('click', onTabClick, false);
  }

  return (
    //html form of the container with the forecasts
    <div className="container">
      {currentWeather && <CurrentWeather data={currentWeather} />}
      <div class="tabs">
        <div class="tab active" data-target="Hourly">3-Hour Forecast</div>
        <div class="tab" data-target="Forecast">5 Days Forecast</div>
      </div>
      <div id="panels">
        <div class="Hourly panel active">
          {forecast && <Hourly data={forecast} />}          
        </div>
        <div class="Forecast panel">
          {forecast && <Forecast data={forecast} />}
        </div>
      </div>
      
      
      
    </div>
  );

}

export default App;
