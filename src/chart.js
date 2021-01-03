import vaccinationData from "./data/vaccination.json";
import helper from "./helper.js";
import Chart from "chart.js";

const dates = vaccinationData.map((day) => day.date);
const perDay = vaccinationData.map((day) => day.perDay);

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

const restToVaccinate = totalDanes - totalNumberOfVaccinated;

const canvasContextTotal = document
    .querySelector("canvas.total-vaccinated")
    .getContext("2d");

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
                        labelString: "Dato",
                    },
                },
            ],
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return parseInt(tooltipItem.value).toLocaleString("da");
                },
            },
        },
    },
});

const canvasPerDay = document.querySelector("canvas.per-day-vaccinated");

const canvasContextPerDay = canvasPerDay.getContext("2d");

const perDayChart = new Chart(canvasContextPerDay, {
    type: "bar",
    data: {
        labels: dates,
        datasets: [
            {
                data: perDay,
                label: "Per dag",
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
                        labelString: "Dato",
                    },
                },
            ],
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return parseInt(tooltipItem.value).toLocaleString("da");
                },
            },
        },
    },
});

canvasPerDay.style.display = "none";

const canvasPercent = document.querySelector("canvas.percent");

const canvasContextPercent = canvasPercent.getContext("2d");

const percentChart = new Chart(canvasContextPercent, {
    type: "pie",
    data: {
        labels: ["Vaccinerede", "Ikke vaccinerede"],
        datasets: [
            {
                data: [totalNumberOfVaccinated, restToVaccinate],
                label: "Per dag",
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
                    return parseInt(
                        data.datasets[0].data[tooltipItem.index]
                    ).toLocaleString("da");
                },
            },
        },
    },
});

canvasPercent.style.display = "none";
