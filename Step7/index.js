const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 1337;
const bodyParser = require('body-parser')
const cvstfjs = require("@microsoft/customvision-tfjs-node");

(async () => {
    let labels;
    try {
        const data = fs.readFileSync('tf-js-model/labels.txt').toString();
        labels = data.split('\n');
    } catch {
        console.log("Could not load labels.txt");
    }

    let model;
    try {
        model = new cvstfjs.ClassificationModel();
        await model.loadModelAsync('file://tf-js-model/model.json');
    } catch {
        console.log("Could not load model.json");
        return;
    }

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.raw({ limit: '10MB' }));
    app.use(express.static('public'));

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.post('/predict_offline', async (request, response) => {
        try {
            const imageData = request.body;

            const results = await model.executeAsync(imageData);

            const mostLikelyPrediction = results.map((v, i) => ({
                probability: v,
                tagName: labels[i]
            })).sort((a, b) => {
                return (a.probability > b.probability) ? -1 :
                    (a.probability === b.probability ? 0 : 1)
                    ;
            })[0].tagName;
            response.setHeader('Content-Type', 'text/json');
            response.end(`{ "prediction": "${mostLikelyPrediction}" }`);
        } catch {
            response.status(500);
            response.end();
        }
    });

    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})();