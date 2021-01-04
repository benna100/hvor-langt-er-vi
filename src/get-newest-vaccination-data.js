var pdf2table = require("pdf2table");
var fs = require("fs");

var http = require("http");

var request = require("request");

var wget = require("node-wget-promise");
wget(
    "https://files.ssi.dk/covid19/vaccinationstilslutning/vaccinationstilslutning-04012021-ja21"
).then((response) => {
    const fileName = response.headers["content-disposition"]
        .split('filename="')[1]
        .split(".pdf")[0];

    fs.readFile(fileName, function (err, buffer) {
        if (err) return console.log(err);
        pdf2table.parse(buffer, function (err, rows, rowsdebug) {
            if (err) return console.log(err);
            const vaccinationData = [];
            rows.forEach((row) => {
                if (row.length === 4) {
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
            exportJson(vaccinationData, "src/data/vaccination.json");
        });
    });
});

function exportJson(jsonToExport, filename) {
    let data = JSON.stringify(jsonToExport);
    fs.writeFileSync(filename, data);
}