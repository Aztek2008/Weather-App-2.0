import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';

import query from '../api/weather';
import memoryBuilder from '../templates/memory.hbs';
import fetchPixabay from '../api/pixabay';
import { defaults } from '@pnotify/core';
import { alert, notice, info, success, error } from '@pnotify/core';
// import getTileUrl from '../api/airq'

const debounce = require('lodash.debounce');

const refs = {
  body: document.querySelector('body'),
  input: document.querySelector('.main-input'),
  saveCityBtn: document.querySelector('.star-btn'),
  citiesMemory: document.querySelector('.added-city'), // memory.hbs
  deleteCityBtn: document.querySelector('.cross-btn'),
  citiesContainer: document.querySelector('.siema'),
  weatherContainerLocation: document.querySelector('.city'),
  weatherCity: document.getElementById('weather_city'),
  currentTemp: document.getElementById('weather_temp'),
  minTemp: document.getElementById('weather-min_temp'),
  // SWITCH BUTTONS
  todayBTN: document.querySelector('.todayBTN'),
  daysBTN: document.querySelector('.daysBTN'),
  maxTemp: document.getElementById('weather-max_temp'),
  weatherIcon: document.getElementById('weather_icon'),
  // BOTTOM BLOCK
  currentDate: document.getElementById('date'),
  currentDay: document.getElementById('day'),
  currentMonth: document.getElementById('month'),
  currentTimeHr: document.getElementById('current-time-hr'),
  currentTimeMin: document.getElementById('current-time-min'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
};

//  ===================  CURRENT CITY START CODE
const reverseGeocoder = new BDCReverseGeocode();
let cityName;
window.addEventListener('load', loadDefaultRender); // LOADING DOM...

function fetchPixabayBgImg(currentLocation) {
  fetchPixabay.fetchBgImage(currentLocation).then(parsedResponse => {
    const backBigImge = parsedResponse.hits[getRandomInt()].largeImageURL;
    refs.body.style.backgroundImage = `url(${backBigImge})`;
  });
}

// ===========  CURRENT CITY BY BROWSER'S COORDS
function loadDefaultRender() {

  reverseGeocoder.getClientLocation(function (result) {
    const currentLocation = result.localityInfo.administrative[1].name;
    fetchPixabay.searchQuery = currentLocation;
    console.log('CURRENT LOCATION', currentLocation);

    fetchPixabayBgImg(fetchPixabay.searchQuery);

    //============= WEATHER AT CURRENT CITY
    query
      .fetchWeather(currentLocation)
      .then(data => {
        citiesMemoryMarkUp = {
          name: data.name,
          html: memoryBuilder(data),
        };

        updatePageHtml(data);

        refs.weatherIcon.classList.add('visible');
      })
      .catch(err => {
        console.log('ERRORRRRR')
        const myError = error({
          delay: 2000,
          maxTextHeight: null,
          text: "CAN'T FIND YOUR REQUEST. PLEASE TRY AGAIN.",
        });
      });
  });

};

const storedCities = JSON.parse(localStorage.getItem('Cities'));
const findedCities = [];

//================ ОТРИСОВКА СОХРАНЕННЫХ ГОРОДОВ ИЗ ЛОКАЛСТОРА
export default { findedCities, storedCities };

if (storedCities !== null) {
  storedCities.forEach(value => {
    cityName = value;

    insertCityToTheMemory();
  });
}

let citiesMemoryMarkUp = null;

refs.input.addEventListener('input', debounce(searchFromInput, 1500));
refs.saveCityBtn.addEventListener('click', insertCityToTheMemory);
document.addEventListener('click', removeCityFromMemory);
document.addEventListener('click', renderCityWeather);
refs.daysBTN.addEventListener('click', hideAndShowYarik);
refs.todayBTN.addEventListener('click', hideAndShowSasha);

function hideAndShowYarik() {
  document.querySelector('.weather-container').classList.add('move-out-of-screen');
  document
    .querySelector('.date-citation-wrapper')
    .classList.add('move-down-from-screen');
  setTimeout(() => {
    document.querySelector('.weather-container').style = 'display: none';
    document.querySelector('.date-citation-wrapper').style = 'display:none';
    document.querySelector('.modal').style = 'display: block';
  }, 1050);
  setTimeout(() => {
    document.querySelector('.modal').classList.remove('modalEffects');
  }, 1051);
}

function hideAndShowSasha() {
  document.querySelector('.modal').classList.add('modalEffects');
  document.querySelector('.modal').style = 'display: none';
  document.querySelector('.weather-container').style = 'display: flex';
  document.querySelector('.date-citation-wrapper').style = 'display:flex';
  setTimeout(() => {
    document.querySelector('.weather-container').classList.remove('move-out-of-screen');
    document.querySelector('.date-citation-wrapper')
      .classList.remove('move-down-from-screen');
  }, 10);
}


function renderCityWeather(e) {
  if (e.target.className !== 'added-city') {
    return;
  }
  const clickedCityName = e.target.textContent;
  fetchPixabay.searchQuery = clickedCityName;
  refs.input.value = '';

  fetchPixabayBgImg(fetchPixabay.searchQuery);

  query.fetchWeather(clickedCityName).then(data => {
    let keys = Object.values(data.sys.country).join('');
    fetchPixabayBgImg(keys);
    updatePageHtml(data);

    fetchPixabay.searchQuery = data.name;

    citiesMemoryMarkUp = {
      name: data.name,
      html: memoryBuilder(data),
    };
  });
}

function searchFromInput(e) {
  let city = e.target.value;

  query
    .fetchWeather(city)
    .then(data => {

      if (data.cod === 200 && !findedCities.includes(data.name)) {
        refs.saveCityBtn.classList.remove('starred');
        fetchPixabay.searchQuery = data.name;
        fetchPixabayBgImg(fetchPixabay.searchQuery);
        cityName = data.name;
        citiesMemoryMarkUp = {
          name: data.name,
          html: memoryBuilder(data),
        };
        updatePageHtml(data);
      } else {
        console.log("ERRORRRR AT SEARCH FROM INPUT DOES NOT FALL TO CATCH !!!")
        citiesMemoryMarkUp = null;
      }
    })
    .catch(err => {
      
      const myError = error({
        delay: 2000,
        maxTextHeight: null,
        text: "CAN'T FIND YOUR REQUEST. PLEASE TRY AGAIN.",
      });
    });
}

function insertCityToTheMemory() {
  refs.saveCityBtn.classList.add('starred');//====FIXME:make swich color
  setTimeout(() => {
    refs.saveCityBtn.classList.remove('starred');
  }, 250);

  let value = cityName;

  if (!value || findedCities.includes(value)) {
    return;
  }

  findedCities.push(value);
  if (findedCities.length >= 7) {
    findedCities.splice(0, 1);
  }

  const allLi = findedCities
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
  localStorage.setItem('Cities', JSON.stringify(findedCities));
}

//   findedCities.length > 4 ? 4 : findedCities.length

function removeCityFromMemory(e) {
  if (e.target && e.target.className === 'cross-btn') {
    let id = e.target.dataset.id;
    document.getElementById(id).remove();
    findedCities.splice(findedCities.indexOf(id), 1);
    // УДАЛЕНИE ЭЛЕМЕНТА ИЗ МАССИВА B ЛОКАЛЬНОM ХРАНИЛИЩE
    storedCities.splice(storedCities.indexOf(id), 1);
    console.log(storedCities);
    localStorage.setItem('Cities', JSON.stringify(storedCities));
  }
}

function updatePageHtml(data) {
  if (data.cod === 200) {
    let img = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    console.log('img in update page:', img)
    let dt = new Date(data.dt * 1000);
    refs.weatherIcon.src = img;
    refs.weatherIcon.classList.add('visible');
    console.log('refs.weatherIcon:', refs.weatherIcon)
    refs.weatherCity.textContent = `${data.name}, ${data.sys.country}`;
    refs.currentTemp.textContent = `${Math.round (data.main.temp)}`;
    refs.minTemp.textContent = `${data.main.temp_min}`;
    refs.maxTemp.textContent = `${data.main.temp_max}`;
    console.dir(data.main.temp_max)
    refs.currentDate.textContent = dt.getDate();
    refs.currentDay.textContent = dt.toLocaleDateString('en-US', {
      weekday: 'short',
    });
    refs.currentMonth.textContent = dt.toLocaleDateString('en-US', {
      month: 'long',
    });
    refs.currentTimeHr.textContent = String(dt.getHours()).padStart(2, 0) + ':';
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

function getRandomInt(min, max) {
  min = 1;
  max = 20;
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
