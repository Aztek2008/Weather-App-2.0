import chartCode from "chart.js";

const moment = require("moment-timezone");
const ctx = document.getElementById("myChart").getContext("2d");
let chartData = {};
const average = (req, data) => {
  const values = data.map((e) => e[req]);
  const sum = values.reduce((previous, current) => (current += previous));
  const avg = sum / values.length;
  return Number(avg.toFixed(1));
};
const getChartData = () => {
  const data = (chartData.days = data.map((
    e //функция//;
  ) => moment(e.date * 1000).format("ll")));
  chartData.temp = data.map((e) => average("temp", e.forecast));
  chartData.humidity = data.map((e) => average("humidity", e.forecast));
  chartData.pressure = data.map((e) => average("pressure", e.forecast));
  chartData.speed = data.map((e) => average("speed", e.forecast));
};
const renderChart = (Chart) => {
  getChartData();
  new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.days,
      datasets: [
        {
          label: " — Temperature, C°",
          backgroundColor: "rgb(255, 107, 8)",
          borderColor: "rgb(255, 107, 8)",
          data: chartData.temp,
          fill: false,
        },
        {
          label: " —  Humidity, %",
          backgroundColor: "rgb(10, 6, 234)",
          borderColor: "rgb(10, 6, 234)",
          data: chartData.humidity,
          fill: false,
        },
        {
          label: " —  Speed, m/s",
          backgroundColor: "rgb(235, 155, 5)",
          borderColor: "rgb(235, 155, 5)",
          data: chartData.speed,
          fill: false,
        },
        {
          label: " —  Pressure, m/m",
          backgroundColor: "rgb(5, 120, 6)",
          borderColor: "rgb(5, 120, 6)",
          data: chartData.pressure,
          fill: false,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Value of indicators",
        position: "left",
      },
      legend: {
        display: true,
        align: "start",

        labels: {
          boxWidth: 13,
          boxHeight: 12,
          defaultFontColor: "rgb(5, 120, 6)",
          padding: 10,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: "rgba(255, 255, 255, 0.541)",
            },
            ticks: {
              padding: 20,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              color: "rgba(255, 255, 255, 0.541)",
              stepSize: 0.5,
              zeroLineColor: "rgba(255, 255, 255, 0.541)",
            },
            ticks: {
              padding: 18,
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

const btnShowChart = document.querySelector(".show-chart-btn-js");
const btnHideChart = document.querySelector(".hide-chart-btn-js");
const headerOfShowChart = document.querySelector(".show-chart-header-js");
const headerOfHideChart = document.querySelector(".hide-chart-header-js");
const boxOfShowChart = document.querySelector(".show-chart-box");
const chartBox = document.querySelector(".chart-box");

btnShowChart.addEventListener("click", onShowChartClick);
headerOfShowChart.addEventListener("click", onShowChartClick);
btnHideChart.addEventListener("click", onHideChartClick);
headerOfHideChart.addEventListener("click", onHideChartClick);

function onShowChartClick() {
  boxOfShowChart.classList.add("hidden") & chartBox.classList.add("visible");
  renderChart();
}

function onHideChartClick() {
  chartBox.classList.remove("visible") &
    boxOfShowChart.classList.remove("hidden");
}
