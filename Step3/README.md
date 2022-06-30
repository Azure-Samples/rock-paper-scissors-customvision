# Step3 changes
Goal:
* Submit picture to index.js
* Receive picture on index.js
* Submit picture from index.js to Custom Vision API
* Receive predictions from Custom Vision

## Changes to public/js/app.js
``` javascript
    const submitImageFromCanvas = (canvasElement) => {
        const request = new XMLHttpRequest();
        request.open('POST', "/predict", true);
        request.setRequestHeader('Content-Type', 'application/octet-stream');
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                console.log(request.responseText);
            } else {
                console.error(request);
            }
        };
    
        request.onerror = function (error) {
            console.error(error);
        };
    
        canvasElement.toBlob(function(blob) {
            request.send(blob);
        });
    };

    const takePhoto = (videoElement, canvasElement) => {
        const canvasContext = canvasElement.getContext('2d');
        const videoSettings = webcamStream.getVideoTracks()[0].getSettings();
        canvasContext.drawImage(videoElement,
            0, 0, videoSettings.width, videoSettings.height,
            0, 0, canvasElement.width, canvasElement.height);
        submitImageFromCanvas(canvasElement);
    };
```

## Create config.js with CustomVision API keys
```json
{
    "Key": "<PUT_YOUR_KEY_HERE>",
    "PublishedIteration": "<PUT_PUBLISHED_ITERATION_HERE>", // example iteration name - Iteration4
    "ProjectId": "<PUT_PROJECT_ID_HERE>", // example project id - e75298bb-3275-4f77-9148-18b0e4f06bb4
    "Endpoint": "<PUT_PREDICTION_ENDPOINT_HERE>" // example prediction endpoint - https://rpscustomvision-prediction.cognitiveservices.azure.com
}
```

## Changes to index.js
```javascript
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
    const fs = require("fs");
    fs.writeFileSync("test.png", imageData);

    const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": PredictionConfig.Key } });
    const predictor = new PredictionApi.PredictionAPIClient(predictor_credentials, PredictionConfig.Endpoint);
    // post the data
    const results = await predictor.classifyImage(PredictionConfig.ProjectId, PredictionConfig.PublishedIteration, imageData);
    const predictions = results.predictions;
    console.log(predictions);
});
```

# Troubleshooting
In case you are getting errors about body size on POST, replace the following code in public/js/app.js:

```javascript
    canvasElement.toBlob(function(blob) {
        request.send(blob);
    });

```
with resizing via a new canvas

```javascript
    const resizeCanvas = document.createElement('canvas'),
    resizeCanvasContext = resizeCanvas.getContext('2d'),
    resizeRatio = 0.5; // Set appropriate resize ratio

    resizeCanvas.width = canvasElement.width * resizeRatio;
    resizeCanvas.height = canvasElement.height * resizeRatio;
    resizeCanvasContext.drawImage(canvasElement, 0, 0, resizeCanvas.width, resizeCanvas.height);

    resizeCanvas.toBlob(function(blob) {
        request.send(blob);
    });
```