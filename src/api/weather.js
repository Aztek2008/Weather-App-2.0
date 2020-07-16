
const apiKey = '51a63d6e6f44d74434ee7d0893876caf';
const url = `https://api.openweathermap.org/data/2.5/weather?q=`;

export default {
  fetchWeather(city) {
    return fetch(`${url}${city}&units=metric&appid=${apiKey}`)
    .then(response =>
      response.json(),
    );
  },
};