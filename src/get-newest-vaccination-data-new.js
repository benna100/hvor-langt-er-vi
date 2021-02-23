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

                fs.createReadStream(`${fileName}.zip`).pipe(
                    unzipper.Extract({ path: "src/data/vaccination" })
                );

                fs.createReadStream(
                    "src/data/vaccination/ArcGIS_dashboards_data/Vaccine_DB/Vaccinationsdaekning_nationalt.csv"
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

                        console.log(yesterdaysTotalPerDay);

                        const yesterdaysTotalPerDayCompleted = vaccinationData.reduce(
                            (acc, current) => acc + current.perDayCompleted,
                            0
                        );

                        console.log(yesterdaysTotalPerDayCompleted);

                        // {"date":"20-02-2021","perDay":10515,"percentageTotal":5.32,"perDayCompleted":576,"percentageTotalCompleted":3.01}
                        console.log(row);

                        const date = fileName.split("-")[2];
                        const formattedDate = `${date.slice(0, 2)}-${date.slice(
                            2,
                            4
                        )}-${date.slice(4, 8)}`;

                        const percentageTotal =
                            row["Vacc.d�kning foerste vacc. (%)"];
                        const percentageTotalCompleted =
                            row["Vacc.d�kning faerdigvacc. (%)"];

                        const vaccinatedTotalToday = row["Antal f�rste vacc."];
                        const vaccinatedTotalCompletedToday =
                            row["Antal faerdigvacc."];

                        const perDay =
                            vaccinatedTotalToday - yesterdaysTotalPerDay;
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
                    })
                    .on("end", () => {
                        console.log("CSV file successfully processed");
                    });
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
