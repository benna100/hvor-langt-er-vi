var pdf2table = require("pdf2table");
var fs = require("fs");
var wget = require("node-wget-promise");
const got = require("got");
const jsdom = require("jsdom");
const unzipper = require("unzipper");
const csv = require("csv-parser");
const { JSDOM } = jsdom;

got("https://covid19.ssi.dk/overvagningsdata/download-fil-med-vaccinationsdata")
    .then((response) => {
        const dom = new JSDOM(response.body);
        const firstVaccinationLink = dom.window.document.querySelector(
            "#top .main-content section.teaser-list .w-max p a"
        ).href;

        wget(firstVaccinationLink).then((response) => {
            const fileName = response.headers["content-disposition"]
                .split('filename="')[1]
                .split(".zip")[0];

            fs.rename(fileName, `${fileName}.zip`, function (err) {
                if (err) throw err;
                console.log("File Renamed.");

                fs.createReadStream(`./${fileName}.zip`)
                    .pipe(unzipper.Extract({ path: "src/data/vaccination" }))
                    .promise()
                    .then(
                        () => {
                            console.log("finish");
                            fs.createReadStream(
                                "./src/data/vaccination/ArcGIS_dashboards_data/Vaccine_DB/Vaccinationsdaekning_nationalt.csv"
                            )
                                .pipe(csv())
                                .on("data", (row) => {
                                    var vaccinationDataUnformatted = fs.readFileSync(
                                        "src/data/vaccination.json"
                                    );
                                    // Define to JSON type
                                    var vaccinationData = JSON.parse(
                                        vaccinationDataUnformatted
                                    );
                                    const yesterdaysTotalPerDay = vaccinationData.reduce(
                                        (acc, current) => acc + current.perDay,
                                        0
                                    );
                                    // console.log(yesterdaysTotalPerDay);
                                    const yesterdaysTotalPerDayCompleted = vaccinationData.reduce(
                                        (acc, current) =>
                                            acc + current.perDayCompleted,
                                        0
                                    );
                                    let dateString = fileName.split("-")[2];
                                    const year = dateString.slice(4, 8);
                                    const month = dateString.slice(2, 4);
                                    const day = dateString.slice(0, 2);
                                    const entryDate = new Date(
                                        `${year}-${month}-${day}`
                                    );
                                    const yesterdaysDate = new Date(
                                        entryDate.getTime() -
                                            24 * 60 * 60 * 1000
                                    );
                                    let dateMonth =
                                        yesterdaysDate.getMonth() + 1;
                                    if (dateMonth < 10) {
                                        dateMonth = `0${dateMonth}`;
                                    }
                                    let dateDay = yesterdaysDate.getDate();
                                    if (dateDay < 10) {
                                        dateDay = `0${dateDay}`;
                                    }
                                    const date = `${dateDay}-${dateMonth}-${yesterdaysDate.getFullYear()}`;
                                    const percentageTotal = parseFloat(
                                        row["Vacc.d�kning p�begyndt vacc. (%)"]
                                    );
                                    const percentageTotalCompleted = parseFloat(
                                        row["Vacc.d�kning faerdigvacc. (%)"]
                                    );
                                    const vaccinatedTotalToday = parseInt(
                                        row["Antal f�rste vacc."]
                                    );
                                    const vaccinatedTotalCompletedToday = parseInt(
                                        row["Antal faerdigvacc."]
                                    );
                                    const perDay =
                                        vaccinatedTotalToday -
                                        yesterdaysTotalPerDay;
                                    const perDayCompleted =
                                        vaccinatedTotalCompletedToday -
                                        yesterdaysTotalPerDayCompleted;
                                    console.log(
                                        date,
                                        percentageTotal,
                                        percentageTotalCompleted,
                                        perDay,
                                        perDayCompleted
                                    );
                                    vaccinationData.push({
                                        date,
                                        perDay,
                                        percentageTotal,
                                        perDayCompleted,
                                        percentageTotalCompleted,
                                    });
                                    exportJson(
                                        vaccinationData,
                                        "src/data/vaccination.json"
                                    );
                                })
                                .on("end", () => {
                                    console.log(
                                        "CSV file successfully processed"
                                    );
                                });
                        },
                        (e) => {
                            console.log(error);
                        }
                    );
            });
        });
    })
    .catch((err) => {
        console.log(err);
    });

function exportJson(jsonToExport, filename) {
    let data = JSON.stringify(jsonToExport);
    fs.writeFileSync(filename, data);
}
