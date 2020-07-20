
// const baseUrl = 'https://corona.lmao.ninja/v2/countries/';
// export default function fetchCovid(query) {
//   return fetch(`${baseUrl}${query}`)
//     .then(response => {
//       return response.json();
//     })
//     .then(data => {
//       console.log(data)
//       renderCovidInfo(data);
//     });
// }
// let covidRefs = {
//   country: document.querySelector('.covidCountry'),
//   sickNow: document.querySelector('.sickNow'),
//   todayCases: document.querySelector('.todayCases'),
//   todayRecovered: document.querySelector('.todayRecovered'),
//   todayDeaths: document.querySelector('.todayDeaths'),
//   totalCases: document.querySelector('.totalCases'),
//   recovered: document.querySelector('.recovered'),
//   deaths: document.querySelector('.deaths')
// };
// function renderCovidInfo(data) {
//   covidRefs.country.textContent = `${data.country}`;
//   covidRefs.sickNow.textContent = `${data.active}`;
//   covidRefs.todayCases.textContent = `${data.todayCases}`;
//   covidRefs.todayRecovered.textContent = `${data.todayRecovered}`;
//   covidRefs.todayDeaths.textContent = `${data.todayDeaths}`;
//   covidRefs.totalCases.textContent = `${data.cases}`;
//   covidRefs.recovered.textContent = `${data.recovered}`;
//   covidRefs.deaths.textContent = `${data.deaths}`
// };
