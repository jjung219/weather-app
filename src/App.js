import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios // get woeid
      .get(`https://www.metaweather.com/api/location/search/?query=${search}`)
      .then(res => {
        console.log(res.data);
        if (res.data.length === 0) {
          setLoading(false);
          setError('City Not Found');
          setSearch('');
        } else {
          setError('');
          const woeid = res.data[0].woeid
          axios //get 5 day forecast
            .get(`https://www.metaweather.com/api/location/${woeid}`)
            .then((res) => {
              console.log(res.data.consolidated_weather[0]);
              const todayWeather = res.data.consolidated_weather[0];
              setWeather(todayWeather);
              setCity(res.data.title);
              setCountry(res.data.parent.title);
              setSearch('');
              setLoading(false);
            });
        }
      });
  };


  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={onSearchSubmit}>
        <input 
          type="text" 
          placeholder="Search..."
          name="query"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button 
          type="submit"
        >Search</button>
      </form>
      {loading && (
        <p>Loading...</p>
      )}
      {error && (
        <p style={{color: 'red'}}>{error}</p>
      )}
      {weather && (
        <div>
          <h2>{`${city}, ${country}`}</h2>
          <h4>{weather.applicable_date}</h4>
          <p>Current Temperature: {weather.the_temp} degrees Celsius</p>
          <p>Min: {weather.min_temp} degrees Celsius</p>
          <p>Max: {weather.max_temp} degrees Celsius</p>
          <h4>{weather.weather_state_name}</h4>
        </div>
      )}
    </div>
  );
}

export default App;
