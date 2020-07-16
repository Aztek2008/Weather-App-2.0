import fetchForeCust from '../api/forecast.js';
import templateLi from '../templates/hbs-li.hbs';
import templateLiChild from '../templates/hbs-liChild.hbs';
import Chart from 'chart.js';
import { data } from 'autoprefixer';

const refs = {
  CCName: document.querySelector('.cityName'),
  input: document.querySelector('.main-input'),
  modal: document.querySelector('.list-modal'),
  days: document.querySelector('.list--days'),
  modalLink: document.querySelectorAll('.more-info'),
};

let dataList = [];

document.addEventListener('click', openModal);

function openModal(e) {
  if (e.target && e.target.className === 'more-info') {
    const btn = e.target
    refs.modal.textContent = ''

    dataList.forEach((value) => {
      let dt = new Date(value.dt * 1000);
      if (dt.toLocaleDateString('en-US', {
        weekday: 'long'
      }) === btn.dataset.id) {
        refs.modal.insertAdjacentHTML('beforeend', templateLiChild({
          icon: `http://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`,
          temp: value.main.temp,
          humidity: value.main.humidity,
          pressure: value.main.pressure,
          wspeed: value.wind.speed,
          dayTime: `${String(dt.getHours()).padStart(2, 0)}:${String(dt.getMinutes()).padStart(2, 0)}`
        }))
      }
    })
  }
}

function renderGraph(temp, hum, wspeed, pres, dates) {
  const ctx = document.getElementById('myChart').getContext('2d');
  let labels = dates;
  let temperatureData = temp;
  let humidityData = hum;
  let windSpeedData = wspeed;
  let pressureData = pres;
  let datasets = [
    {
      label: ' — Temperature, C°   ',
      data: temperatureData,
      borderColor: 'rgb(255, 207, 8)',
      borderColor: 'rgb(255, 107, 8)',
      fill: false,
      lineTension: 0,
    },
    {
      label: ' —  Humidity, %   ',
      data: humidityData,
      borderColor: 'rgb(9, 6, 234)',
      fill: false,
      lineTension: 0,
    },
    {
      label: ' — Wind Speed, m/s   ',
      data: windSpeedData,
      borderColor: 'rgb(235, 155, 5)',
      fill: false,
      lineTension: 0,
    },
    {
      label: ' — Atmosphere Pressure, m/m',
      data: pressureData,
      borderColor: 'rgb(5, 120, 6)',
      fill: false,
      lineTension: 0,
    },
  ];

  let config = {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      title: {
        display: true,
        text: 'Value of indicators',
        position: 'left',
      },
      legend: {
        display: true,

        labels: {
          boxWidth: 13,
          boxHeight: 12,
          defaultFontColor: 'rgb(5, 120, 6)',
          padding: 0,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: 'rgba(255, 255, 255, 0.541)',
            },
            ticks: {
              padding: 20,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              color: 'rgba(255, 255, 255, 0.541)',
              stepSize: 2.5,
              zeroLineColor: 'rgba(255, 255, 255, 0.541)',
            },
            ticks: {
              padding: 18,
            },
          },
        ],
      },
    },
  };
  const myChart = new Chart(ctx, config);
}

function buildPostFeed(data) {
  dataList = data.list;
  let arrDays = {};
  const cityName = `${data.city.name}, ${data.city.country}`
  refs.CCName.textContent = cityName
  data.list.forEach(value => {
    let dt = new Date(value.dt * 1000);
    refs.days.textContent = ''
    if (dt.getDay() !== new Date().getDay() || true) {
      let day = dt.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      if (arrDays[day] === undefined) {
        arrDays[day] = {
          name: day,
          date: `${dt.getDate()} ${dt.toLocaleDateString('en-US', {
            month: 'short',
          })}`,
          icon: `http://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`,
          min: value.main.temp_min.toFixed(0),
          max: value.main.temp_max.toFixed(0),
        };
      } else {
        arrDays[day].min =
          arrDays[day].min > value.main.temp_min ?
            value.main.temp_min.toFixed(0) :
            arrDays[day].min;
        arrDays[day].max =
          arrDays[day].max < value.main.temp_max ?
            value.main.temp_max.toFixed(0) :
            arrDays[day].max;
      }
    }
  });
  for (let value in arrDays) {
    refs.days.insertAdjacentHTML('beforeend', templateLi(arrDays[value]));
  }
}

const reverseGeocoder = new BDCReverseGeocode();
const debounce = require('lodash.debounce');

let isActive = false

function loadDefaultRender() {
  reverseGeocoder.getClientLocation(function (result) {
    fetchForeCust(result.localityInfo.administrative[1].name).then(data => {
      buildPostFeed(data);
    })
  })
};

function searchFromInput(e) {
  isActive = true;
  fetchForeCust(e.target.value).then(data => {
    buildPostFeed(data);
    console.log(data);
    let temp = [
      `${data.list[1].main.temp}`,
      `${data.list[2].main.temp}`,
      `${data.list[3].main.temp}`,
      `${data.list[4].main.temp}`,
      `${data.list[5].main.temp}`,
    ];
    let humidity = [
      `${data.list[1].main.humidity}`,
      `${data.list[2].main.humidity}`,
      `${data.list[3].main.humidity}`,
      `${data.list[4].main.humidity}`,
      `${data.list[5].main.humidity}`,
    ];
    let wind = [
      `${data.list[1].wind.speed}`,
      `${data.list[2].wind.speed}`,
      `${data.list[3].wind.speed}`,
      `${data.list[4].wind.speed}`,
      `${data.list[5].wind.speed}`,
    ];
    let pressure = [
      `${data.list[1].main.pressure}`,
      `${data.list[2].main.pressure}`,
      `${data.list[3].main.pressure}`,
      `${data.list[4].main.pressure}`,
      `${data.list[5].main.pressure}`,
    ];
    let dates = [
      `${data.list[1].dt_txt}`,
      `${data.list[2].dt_txt}`,
      `${data.list[3].dt_txt}`,
      `${data.list[4].dt_txt}`,
      `${data.list[5].dt_txt}`,
    ];

    renderGraph(temp, humidity, wind, pressure, dates);
  });
}

if (!isActive) {
  loadDefaultRender();
} else {
  searchFromInput();
}

refs.input.addEventListener('input', debounce(searchFromInput, 1000));

let chartBox = document.querySelector('.chart-box');
const btnShowChart = document.querySelector('.show-chart-btn-js');
btnShowChart.addEventListener('click', event => {
  event.preventDefault();

  if (chartBox.style.display == 'none') {
    chartBox.style.display = 'block';
    event.target.text = 'Hide chart';
  } else {
    event.target.text = 'Show chart';
    chartBox.style.display = 'none';
  }
});
const btnHideChart = document.querySelector('.hide-chart-btn-js');
btnHideChart.addEventListener('click', event => {
  event.preventDefault();

  if (chartBox.style.display === 'block') {
    event.target.text = 'Show chart';
    chartBox.style.display = 'none';
  }
});