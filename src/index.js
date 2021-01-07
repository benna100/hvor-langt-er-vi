import "./main.scss";

import "./chart.js";
import vaccinationData from "./data/vaccination.json";
import helper from "./helper.js";

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const language = helper.getDanguage();

const totalDanes = helper.getTotalDanes();
const numberOfDaysForAverage = 7;

const totalVaccinatedElement = document.querySelector(
    "h2.total-vaccinated strong.total-vaccinated"
);

const lastVaccinationDateElement = document.querySelector(
    "h2.total-vaccinated span.last-vaccination-date"
);

const [day, month, year] = vaccinationData[
    vaccinationData.length - 1
].date.split("-");
const lastVaccinationDate = new Date(`${year}-${month}-${day}`);
lastVaccinationDateElement.innerHTML = helper.getFormattedDate(
    lastVaccinationDate,
    language
);

const totalPercentageElement = document.querySelector(
    "h3.total-percentage strong"
);

const whenDoneElement = document.querySelector("h3.when-done strong");

const totalNumberOfVaccinated = vaccinationData.reduce(
    (acc, current) => acc + current.perDay,
    0
);

const totalPercentageVaccinated =
    vaccinationData[vaccinationData.length - 1].percentageTotal;

totalVaccinatedElement.innerHTML = totalNumberOfVaccinated.toLocaleString(
    language
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
    const numberOfPregnantPeople = 61273;
    // https://www.dst.dk/da/Statistik/emner/befolkning-og-valg/husstande-familier-boern/boern
    const numberOfYoungPeople = 1168222;

    const missingPeopleToVaccinate =
        totalDanes -
        totalNumberOfVaccinated -
        numberOfPregnantPeople -
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

const transportationButtons = document.querySelectorAll(
    ".graphs-wrapper button"
);
toggleButtons([...transportationButtons], (key) => {
    if (key === "total") {
        totalCanvas.style.display = "block";
        perDayCanvas.style.display = "none";
        percentCanvas.style.display = "none";
    }
    if (key === "per-day") {
        totalCanvas.style.display = "none";
        perDayCanvas.style.display = "block";
        percentCanvas.style.display = "none";
    }
    if (key === "percent") {
        totalCanvas.style.display = "none";
        perDayCanvas.style.display = "none";
        percentCanvas.style.display = "block";
    }
});
