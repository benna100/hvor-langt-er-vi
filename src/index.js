import "./main.scss";

import "./chart.js";
import vaccinationData from "./data/vaccination.json";
import helper from "./helper.js";

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const language = helper.getLanguage();

const totalDanes = helper.getTotalDanes();
const numberOfDaysForAverage = 21;

const totalVaccinatedElement = document.querySelector(
    "h3.total-vaccinated strong.total-vaccinated"
);

const totalVaccinatedCompletedElement = document.querySelector(
    "strong.total-vaccinated-completed"
);

const totalVaccinatedPercentageCompletedElement = document.querySelector(
    "strong.total-percentage-completed"
);

const lastVaccinationDateElement = document.querySelector(
    "span.last-vaccination-date"
);

lastVaccinationDateElement.innerHTML = helper.getLastVaccinationDate();

const totalPercentageElement = document.querySelector(
    "strong.total-percentage"
);

const whenDoneElement = document.querySelector("strong.when-done");

const totalPercentageVaccinated = helper.getTotalPercentageVaccinated();

const totalPercentageVaccinatedCompleted = helper.getTotalPercentageVaccinatedCompleted();

const totalNumberOfVaccinated = helper.getTotalNumberOfVaccinated();

totalVaccinatedElement.innerHTML = totalNumberOfVaccinated.toLocaleString(
    language
);

totalVaccinatedCompletedElement.innerHTML = helper.getTotalNumberOfVaccinatedCompleted();

totalVaccinatedPercentageCompletedElement.innerHTML = totalPercentageVaccinatedCompleted.toLocaleString(
    language,
    { minimumFractionDigits: 2 }
);

totalPercentageElement.innerHTML = totalPercentageVaccinated.toLocaleString(
    language
);

function getDateWhenEveryoneIsVaccinated(vaccinationData) {
    const dataToMakeAverageFrom = vaccinationData.slice(
        vaccinationData.length - numberOfDaysForAverage,
        vaccinationData.length
    );

    const totalVaccinated = dataToMakeAverageFrom.reduce(
        (acc, current) => acc + current.perDay,
        0
    );

    const vaccinatedPerDay = totalVaccinated / numberOfDaysForAverage;

    // https://sundhedsdatastyrelsen.dk/da/nyheder/2019/foedsler_28052019
    // Pregnant people gets vaccinated now aswell
    const numberOfPregnantPeople = 61273;
    // https://www.dst.dk/da/Statistik/emner/befolkning-og-valg/husstande-familier-boern/boern
    const numberOfYoungPeople = 1168222;

    const missingPeopleToVaccinate =
        totalDanes -
        totalNumberOfVaccinated -
        numberOfYoungPeople;

    const numberOfDaysToVaccinateRest =
        missingPeopleToVaccinate / vaccinatedPerDay;

    const lastDateString =
        dataToMakeAverageFrom[dataToMakeAverageFrom.length - 1].date;

    const [day, month, year] = lastDateString.split("-");
    const latestDate = new Date(`${year}-${month}-${day}`);

    const dateWhenEveryIsVaccinated = latestDate.addDays(
        numberOfDaysToVaccinateRest
    );

    return dateWhenEveryIsVaccinated;
}
const vavacationsPerDay = getDateWhenEveryoneIsVaccinated(vaccinationData);

whenDoneElement.innerHTML = helper.getFormattedDate(
    vavacationsPerDay,
    language
);

function _resetActiveButtons(buttonElements) {
    buttonElements.forEach((buttonElement) => {
        buttonElement.classList.remove("active");
    });
}

function toggleButtons(buttonElements, onButtonClick) {
    buttonElements.forEach((buttonElement) => {
        buttonElement.addEventListener("click", (buttonElementEvent) => {
            _resetActiveButtons(buttonElements);

            const target = buttonElementEvent.target;
            target.classList.add("active");

            const key = target.getAttribute("data-key");
            onButtonClick(key);
        });
    });
}

const totalCanvas = document.querySelector("canvas.total-vaccinated");
const perDayCanvas = document.querySelector("canvas.per-day-vaccinated");
const percentCanvas = document.querySelector("canvas.percent");
const totalCanvasCompleted = document.querySelector(
    "canvas.total-vaccinated-completed"
);
const perDayCanvasCompleted = document.querySelector(
    "canvas.per-day-vaccinated-completed"
);
const percentCanvasCompleted = document.querySelector(
    "canvas.percent-completed"
);

const transportationButtons = document.querySelectorAll(
    ".graphs-wrapper button"
);
toggleButtons([...transportationButtons], (key) => {
    if (key === "total") {
        totalCanvas.style.display = "block";
        perDayCanvas.style.display = "none";
        percentCanvas.style.display = "none";
        totalCanvasCompleted.style.display = "none";
        perDayCanvasCompleted.style.display = "none";
        percentCanvasCompleted.style.display = "none";
    }
    if (key === "per-day") {
        totalCanvas.style.display = "none";
        perDayCanvas.style.display = "block";
        percentCanvas.style.display = "none";
        totalCanvasCompleted.style.display = "none";
        perDayCanvasCompleted.style.display = "none";
        percentCanvasCompleted.style.display = "none";
    }
    if (key === "percent") {
        totalCanvas.style.display = "none";
        perDayCanvas.style.display = "none";
        percentCanvas.style.display = "block";
        totalCanvasCompleted.style.display = "none";
        perDayCanvasCompleted.style.display = "none";
        percentCanvasCompleted.style.display = "none";
    }
    if (key === "total-completed") {
        totalCanvas.style.display = "none";
        perDayCanvas.style.display = "none";
        percentCanvas.style.display = "none";
        totalCanvasCompleted.style.display = "block";
        perDayCanvasCompleted.style.display = "none";
        percentCanvasCompleted.style.display = "none";
    }
    if (key === "per-day-completed") {
        totalCanvas.style.display = "none";
        perDayCanvas.style.display = "none";
        percentCanvas.style.display = "none";
        totalCanvasCompleted.style.display = "none";
        perDayCanvasCompleted.style.display = "block";
        percentCanvasCompleted.style.display = "none";
    }
    if (key === "percent-completed") {
        totalCanvas.style.display = "none";
        perDayCanvas.style.display = "none";
        percentCanvas.style.display = "none";
        totalCanvasCompleted.style.display = "none";
        perDayCanvasCompleted.style.display = "none";
        percentCanvasCompleted.style.display = "block";
    }
});
