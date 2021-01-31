var Twitter = require("twitter");
require("dotenv").config();
const vaccinationData = require("./src/data/vaccination.json");

const language = "da";

const getLastVaccinationDate = () => {
    const [day, month, year] = vaccinationData[
        vaccinationData.length - 1
    ].date.split("-");
    const lastVaccinationDate = new Date(`${year}-${month}-${day}`);
    return getFormattedDate(lastVaccinationDate, language);
};

const getTotalNumberOfVaccinated = () => {
    return vaccinationData
        .reduce((acc, current) => acc + current.perDay, 0)
        .toLocaleString(language);
};
const getTotalNumberOfVaccinatedCompleted = () => {
    return vaccinationData
        .filter((data) => data.perDayCompleted !== null)
        .reduce((acc, current) => acc + current.perDayCompleted, 0)
        .toLocaleString(language);
};

const getTotalPercentageVaccinated = () =>
    vaccinationData[vaccinationData.length - 1].percentageTotal.toLocaleString(
        language
    );

const getTotalPercentageVaccinatedCompleted = () =>
    vaccinationData[
        vaccinationData.length - 1
    ].percentageTotalCompleted.toLocaleString(language, {
        minimumFractionDigits: 2,
    });

var client = new Twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret,
});

const tweetText = `Vi har færdigvaccineret ${getTotalNumberOfVaccinatedCompleted()} (${getTotalPercentageVaccinatedCompleted()}%)

Vi har påbegyndt vaccination for ${getTotalNumberOfVaccinated()} (${getTotalPercentageVaccinated()}%)

For mere info tjek 👇 #COVID19dk #dkpol #sundpol https://hvorlangtervi.dk/
`;

client
    .post("statuses/update", { status: tweetText })
    .then(function (tweet) {
        console.log(tweet);
    })
    .catch(function (error) {
        console.log(error);
    });
