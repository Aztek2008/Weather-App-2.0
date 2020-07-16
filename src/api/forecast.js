const urlForecast = "forecast"
const url = 'https://api.openweathermap.org/data/2.5/';
const apiKey = '51a63d6e6f44d74434ee7d0893876caf';

export default function fetchWeather(city) {
  return fetch(`${url}${urlForecast}?q=${city}&units=metric&appid=${apiKey}`)
  .then(response => response.json())
  .catch(error => console.error(error));
}
