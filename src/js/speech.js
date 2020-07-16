import query from '../api/weather';
import data from '../js/requests';
import fetchCovid from '../api/corona';
import fetchPx from '../api/pixabay';
function getRandomInt(min, max) {
  min = 1;
  max = 20;
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const talkBtn = document.querySelector('.talk-btn');
console.dir(talkBtn);
talkBtn.addEventListener('click', makeSpeech);
const inputSpeech = document.querySelector('.main-input');

const refs = {
  body: document.querySelector('body'),
  input: document.querySelector('.main-input'),
  citiesMemory: document.querySelector('.added-city'),
  deleteCityBtn: document.querySelector('.cross-btn'),
  saveCityBtn: document.querySelector('.save-btn'),
  citiesContainer: document.querySelector('.siema'),
  weatherContainerLocation: document.querySelector('.city'),
  weatherCity: document.getElementById('weather_city'),
  currentTemp: document.getElementById('weather_temp'),
  minTemp: document.getElementById('weather-min_temp'),
  maxTemp: document.getElementById('weather-max_temp'),
  weatherIcon: document.getElementById('weather_icon'),
  //   bottom block
  currentDate: document.getElementById('date'),
  currentDay: document.getElementById('day'),
  currentMonth: document.getElementById('month'),
  currentTimeHr: document.getElementById('current-time-hr'),
  currentTimeMin: document.getElementById('current-time-min'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
};

function makeSpeech() {
  let SpeechRecognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();
  SpeechRecognition.lang = 'ru-RU';
  SpeechRecognition.onresult = function resSpeech(event) {
    let voiceCity = event.results[0][0].transcript;

    inputSpeech.value = voiceCity;
    if (inputSpeech.value !== '') {
      makeSearch(voiceCity);
    }
  };
  SpeechRecognition.start();
}

function makeSearch(city) {
  query.fetchWeather(city).then(data => {
    let keys = Object.values(data.sys.country).join('');
    fetchCovid(keys);
    updatePageHtml(data);
    fetchPixabyBgImg(data.name);
    insertCityToTheMemor(data.name);
    let airlon = data.coord.lon;
    let airlat = data.coord.lat;
    let map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(airlat, airlon),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 11,
    });
    let t = new Date().getTime();
    let waqiMapOverlay = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        return (
          'https://tiles.aqicn.org/tiles/usepa-aqi/' +
          zoom +
          '/' +
          coord.x +
          '/' +
          coord.y +
          '.png?token=_TOKEN_ID_'
        );
      },
      name: 'Air  Quality',

    });
    map.overlayMapTypes.insertAt(0, waqiMapOverlay);
  });

  function updatePageHtml(data) {
    if (data.cod === 200) {
      let img = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      let dt = new Date(data.dt * 1000);
      refs.weatherIcon.src = img;
      refs.weatherIcon.classList.add('visible');
      refs.weatherCity.textContent = `${data.name}, ${data.sys.country}`;
      refs.currentTemp.textContent = `${data.main.temp.toFixed(1)}`;
      refs.minTemp.textContent = `${data.main.temp_min.toFixed(1)}`;
      refs.maxTemp.textContent = `${data.main.temp_max.toFixed(1)}`;
      refs.currentDate.textContent = dt.getDate();
      refs.currentDay.textContent = dt.toLocaleDateString('en-US', {
        weekday: 'short',
      });
      refs.currentMonth.textContent = dt.toLocaleDateString('en-US', {
        month: 'long',
      });
      refs.currentTimeHr.textContent =
        String(dt.getHours()).padStart(2, 0) + ':';
      refs.currentTimeMin.textContent = String(dt.getMinutes()).padStart(2, 0);
      refs.sunrise.textContent =
        String(new Date(data.sys.sunrise * 1000).getHours()).padStart(2, 0) +
        ':' +
        String(new Date(data.sys.sunrise * 1000).getMinutes()).padStart(2, 0);
      refs.sunset.textContent =
        String(new Date(data.sys.sunset * 1000).getHours()).padStart(2, 0) +
        ':' +
        String(new Date(data.sys.sunset * 1000).getMinutes()).padStart(2, 0);
    }
  }
}
function fetchPixabyBgImg(ct) {
  fetchPx.fetchBgImage(ct).then(parsedResponse => {
    parsedResponse.hits[getRandomInt()].largeImageURL;
    refs.body.style.backgroundImage = `url(${
      parsedResponse.hits[getRandomInt()].largeImageURL
    })`;
  });
}

function insertCityToTheMemor(name) {
  refs.saveCityBtn.classList.add('starred');
  setTimeout(() => {
    refs.saveCityBtn.classList.remove('starred');
  }, 250);

  if (!name || data.findedCities.includes(name)) {
    return;
  }

  data.findedCities.push(name);
  if (data.findedCities.length >= 7) {
    data.findedCities.splice(0, 1);
  }
  console.log(data.findedCities);
  const allLi = data.findedCities
    .map(
      city => `
		  <div id=${city} class="btn-wrapper">
			<span class="added-city">${city}</span>
			<button class="cross-btn" data-id=${city}></button>
		  </div>`,
    )
    .join('');

  refs.citiesContainer.innerHTML = allLi;
  refs.input.value = '';
  localStorage.setItem('Cities', JSON.stringify(data.findedCities));
}
