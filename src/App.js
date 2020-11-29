import React, { useState, useEffect } from 'react';
import axios from 'axios'
import moment from 'moment'

function App() {
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState({});
  const [autoDetect, setAutoDetect] = useState(false);
  useEffect(() => {
    getMyLocation();
  }, []);

  useEffect(() => {
    if (autoDetect) {
      const storedWeather = JSON.parse(localStorage.getItem('weather'));
      if (storedWeather && new Date().getTime() < new Date(storedWeather.time).getTime()) {
        setWeather(storedWeather);
      }
      else {
        search();
      }
      setAutoDetect(false);
    }
  }, [coords.latitude, autoDetect]);

  const search = async () => {
    let api = `https://weather-app-task-api.herokuapp.com/api/weather`;

    if (coords.longitude && autoDetect) {
      api = `${api}?lat=${coords.latitude}&long=${coords.longitude}`
    } else {
      api = `${api}?city=${city}`
    }
    try {
      const result = await axios.get(api)
      setWeather(result.data);
      if (autoDetect) {
        localStorage.setItem('weather', JSON.stringify(result.data));
        setAutoDetect(false);
      }
    }
    catch (e) {
      alert("City Not Found")
      setWeather({})
    }

  }
  const getMyLocation = () => {

    const location = window.navigator && window.navigator.geolocation

    if (location) {
      location.getCurrentPosition((position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setAutoDetect(true);
      }, (error) => {
        console.log(error)
      })
    }

  }

  return (
    <div className="app-container">
      <div className="search-box">
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          onChange={e => setCity(e.target.value)}
          value={city}
        />
      </div>
      <div className="buttons-list">
        <button className="Search" onClick={() => city && search()}>
          Search
          </button>
        <button className="detectBTN" onClick={() => getMyLocation()}>
          Detect Location
          </button>
      </div>
      <div className="location">
        <p className="city">{weather.city ? `${weather.city}, ${weather.country}` : ''} </p>
        <p id="dateZone" className="date">{moment(new Date()).format('MMMM Do YYYY')}</p>
      </div>
      <div className="current">
        <p className="temp">{weather.temperature ? `${weather.temperature} °c` : ''}</p>
        <p className="weather">{weather.conditionsGroup ? weather.conditionsGroup : ''}</p>
      </div>
    </div>
  );
}

export default App;
