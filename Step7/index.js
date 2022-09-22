const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 1337;
const bodyParser = require('body-parser')
const cvstfjs = require("@microsoft/customvision-tfjs-node");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.raw({ limit: '10MB' }));
app.use(express.static('public'));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post('/predict', async (request, response) => {
    const imageData = request.body;

    let labels;
    try {
        const data = (await fs.readFileSync('tf-js-model/labels.txt')).toString();
        labels = data.split('\n');
    } catch (err) {
        console.log(err);
        return;
    }
    
    const model = new cvstfjs.ClassificationModel();
    try {
        await model.loadModelAsync('file://tf-js-model/model.json');
    } catch (err) {
        console.log(err)
        return;
    }

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
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));