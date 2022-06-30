const express = require('express');
const app = express();
const PORT = process.env.PORT || 1337;
const bodyParser = require('body-parser')
const PredictionConfig = require("./config.json");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

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

    const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": PredictionConfig.Key } });
    const predictor = new PredictionApi.PredictionAPIClient(predictor_credentials, PredictionConfig.Endpoint);
    const results = await predictor.classifyImage(PredictionConfig.ProjectId, PredictionConfig.PublishedIteration, imageData);
    
    const mostLikelyPrediction = results.predictions.sort((a, b) => {
        return (a.probability > b.probability) ? -1 :
            (a.probability === b.probability ? 0 : 1)
        ;
    })[0].tagName;
    response.setHeader('Content-Type', 'text/json');
    response.end(`{ "prediction": "${mostLikelyPrediction}" }`);
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));