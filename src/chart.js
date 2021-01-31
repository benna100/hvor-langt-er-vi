import vaccinationData from "./data/vaccination.json";
import helper from "./helper.js";
import Chart from "chart.js";

const viewportWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
);

const language = helper.getLanguage();

const dates = vaccinationData.map((day) => day.date);

const datesCompleted = vaccinationData
    .filter((data) => data.perDayCompleted !== null)
    .map((day) => day.date);

const perDay = vaccinationData.map((day) => day.perDay);

const perDayCompleted = vaccinationData
    .filter((data) => data.perDayCompleted !== null)
    .map((day) => day.perDayCompleted);

const totalDanes = helper.getTotalDanes();
let total = 0;
const totalVaccinated = vaccinationData.map((day) => {
    total = total + day.perDay;

    return total;
});

const totalNumberOfVaccinated = vaccinationData.reduce(
    (acc, current) => acc + current.perDay,
    0
);

let totalCompleted = 0;
const totalVaccinatedCompleted = vaccinationData
    .filter((data) => data.perDayCompleted !== null)
    .map((day) => {
        console.log(totalCompleted);
        totalCompleted = totalCompleted + day.perDayCompleted;

        return totalCompleted;
    });

const totalNumberOfVaccinatedCompleted = vaccinationData
    .filter((data) => data.perDayCompleted !== null)
    .reduce((acc, current) => acc + current.perDayCompleted, 0);

const restToVaccinate = totalDanes - totalNumberOfVaccinated;
const restToVaccinateCompleted = totalDanes - totalNumberOfVaccinatedCompleted;

const canvasTotal = document.querySelector("canvas.total-vaccinated");

const canvasContextTotal = canvasTotal.getContext("2d");

const totalChart = new Chart(canvasContextTotal, {
    type: "line",
    data: {
        labels: dates,
        datasets: [
            {
                data: totalVaccinated,
                label: "Total",
                borderColor: "#3fb8af",
                fill: false,
                labels: dates,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    scaleLabel: {
                        display: false,
                        labelString: language === "en" ? "Date" : "Dato",
                    },
                    ticks: {
                        maxTicksLimit: 10,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        callback: function (value) {
                            return parseInt(value).toLocaleString(language);
                        },
                    },
                },
            ],
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return parseInt(tooltipItem.value).toLocaleString(language);
                },
            },
        },
    },
});

const canvasTotalCompleted = document.querySelector(
    "canvas.total-vaccinated-completed"
);

const canvasContextTotalCompleted = canvasTotalCompleted.getContext("2d");
const totalChartCompleted = new Chart(canvasContextTotalCompleted, {
    type: "line",
    data: {
        labels: datesCompleted,
        datasets: [
            {
                data: totalVaccinatedCompleted,
                label: "Total",
                borderColor: "#3fb8af",
                fill: false,
                labels: datesCompleted,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    scaleLabel: {
                        display: false,
                        labelString: language === "en" ? "Date" : "Dato",
                    },
                    ticks: {
                        maxTicksLimit: 10,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        callback: function (value) {
                            return parseInt(value).toLocaleString(language);
                        },
                    },
                },
            ],
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return parseInt(tooltipItem.value).toLocaleString(language);
                },
            },
        },
    },
});

canvasTotalCompleted.style.display = "none";

const canvasPerDay = document.querySelector("canvas.per-day-vaccinated");

const canvasContextPerDay = canvasPerDay.getContext("2d");

const perDayChart = new Chart(canvasContextPerDay, {
    type: "bar",
    data: {
        labels: dates,
        datasets: [
            {
                data: perDay,
                label: language === "en" ? "Per date" : "Per Dato",
                borderColor: "#3e95cd",
                backgroundColor: "#3fb8af",
                labels: dates,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            mode: "index",
            intersect: false,
        },
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    scaleLabel: {
                        display: false,
                        labelString: language === "en" ? "Date" : "Dato",
                    },
                    ticks: {
                        maxTicksLimit: 10,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        callback: function (value) {
                            return parseInt(value).toLocaleString(language);
                        },
                    },
                },
            ],
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return parseInt(tooltipItem.value).toLocaleString(language);
                },
            },
        },
    },
});

canvasPerDay.style.display = "none";

const canvasPerDayCompleted = document.querySelector(
    "canvas.per-day-vaccinated-completed"
);

const canvasContextPerDayCompleted = canvasPerDayCompleted.getContext("2d");

const perDayChartCompleted = new Chart(canvasContextPerDayCompleted, {
    type: "bar",
    data: {
        labels: datesCompleted,
        datasets: [
            {
                data: perDayCompleted,
                label: language === "en" ? "Per date" : "Per Dato",
                borderColor: "#3e95cd",
                backgroundColor: "#3fb8af",
                labels: datesCompleted,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            mode: "index",
            intersect: false,
        },
        legend: {
            display: false,
        },
        scales: {
            xAxes: [
                {
                    scaleLabel: {
                        display: false,
                        labelString: language === "en" ? "Date" : "Dato",
                    },
                    ticks: {
                        maxTicksLimit: 10,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        callback: function (value) {
                            return parseInt(value).toLocaleString(language);
                        },
                    },
                },
            ],
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return parseInt(tooltipItem.value).toLocaleString(language);
                },
            },
        },
    },
});

canvasPerDayCompleted.style.display = "none";

const canvasPercent = document.querySelector("canvas.percent");

const canvasContextPercent = canvasPercent.getContext("2d");

const percentChart = new Chart(canvasContextPercent, {
    type: "pie",
    data: {
        labels: [
            language === "en" ? "Vaccinated" : "vaccinerede",
            language === "en" ? "Not vaccinated" : "Ikke vaccinerede",
        ],
        datasets: [
            {
                data: [
                    vaccinationData[vaccinationData.length - 1].percentageTotal,
                    100 -
                        vaccinationData[vaccinationData.length - 1]
                            .percentageTotal,
                ],
                label: language === "en" ? "Per date" : "Per Dato",
                borderColor: "transparent",
                backgroundColor: ["#3fb8af", "#ccc"],
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            mode: "index",
            intersect: false,
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    return `${parseFloat(
                        data.datasets[0].data[tooltipItem.index]
                    ).toLocaleString(language)}%`;
                },
            },
        },
    },
});

canvasPercent.style.display = "none";

const canvasPercentCompleted = document.querySelector(
    "canvas.percent-completed"
);

const canvasContextPercentcompleted = canvasPercentCompleted.getContext("2d");

const percentChartCompleted = new Chart(canvasContextPercentcompleted, {
    type: "pie",
    data: {
        labels: [
            language === "en" ? "Vaccinated" : "vaccinerede",
            language === "en" ? "Not vaccinated" : "Ikke vaccinerede",
        ],
        datasets: [
            {
                data: [
                    vaccinationData[vaccinationData.length - 1]
                        .percentageTotalCompleted,
                    100 -
                        vaccinationData[vaccinationData.length - 1]
                            .percentageTotalCompleted,
                ],
                label: language === "en" ? "Per date" : "Per Dato",
                borderColor: "transparent",
                backgroundColor: ["#3fb8af", "#ccc"],
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            mode: "index",
            intersect: false,
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    return `${parseFloat(
                        data.datasets[0].data[tooltipItem.index]
                    ).toLocaleString(language)}%`;
                },
            },
        },
    },
});

canvasPercentCompleted.style.display = "none";
