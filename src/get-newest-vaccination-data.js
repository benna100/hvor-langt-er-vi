var pdf2table = require("pdf2table");
var fs = require("fs");
var wget = require("node-wget-promise");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

got("https://covid19.ssi.dk/overvagningsdata/vaccinationstilslutning")
    .then((response) => {
        const dom = new JSDOM(response.body);
        const firstVaccinationLink = dom.window.document.querySelector(
            "#top .main-content section.search-results accordions div.accordion:nth-child(1) ul li a"
        ).href;

        wget(firstVaccinationLink).then((response) => {
            const fileName = response.headers["content-disposition"]
                .split('filename="')[1]
                .split(".pdf")[0];

            fs.readFile(fileName, function (err, buffer) {
                if (err) return console.log(err);
                pdf2table.parse(buffer, function (err, rows, rowsdebug) {
                    if (err) return console.log(err);
                    const vaccinationData = [];
                    rows.forEach((row) => {
                        if (row.length === 6) {
                            const matchDateRegex = /\d{2}-\d{2}-\d{4}/;
                            const isStringADate = matchDateRegex.test(row[0]);
                            if (isStringADate) {
                                let [date, perDay, _, percentageTotal] = row;
                                perDay = parseInt(perDay.replace(".", ""));
                                percentageTotal = parseFloat(
                                    percentageTotal.replace(",", ".")
                                );
                                vaccinationData.push({
                                    date,
                                    perDay,
                                    percentageTotal,
                                });
                            }
                        }
                    });
                    // exportJson(vaccinationData, "src/data/vaccination.json");
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
