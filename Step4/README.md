# Step4
Goal:
* Return best match prediction to client-side
* Render result to HTML page

## Changes in index.js
```javascript
    const customVisionPostRequest = https.request(customVisionPostOptions, (predictionResponse) => {
        predictionResponse.on('data', function (data) {
            const customVisionResponse = JSON.parse(data);
            const predictions = customVisionResponse.predictions;
            console.log(predictions);
            const mostLikelyPrediction = predictions.sort((a, b) => {
                return (a.probability > b.probability) ? -1 :
                    (a.probability === b.probability ? 0 : 1)
                ;
            })[0].tagName;
            response.setHeader('Content-Type', 'text/json');
            response.end(`{ "prediction": "${mostLikelyPrediction}" }`);
        });
    });
```

## Changes in public/index.html
```HTML
    <div class="appPanel">
      <div class="appResults" id="appResults">
        <div class="answer"><span>User:&nbsp;</span><span class="appUserAnswer value">-</span></div>
      </div>
      <div class="appRestart"><button id="appRestartButton" class="appRestartButton hide">NEW GAME</button></div>
    </div>
```

## changes in public/css/app.css
```CSS
/** Results panel **/
.appContainer .appPanel {
    position: relative;
    height: 20%;
    width: 100%;
    font-size: 1.3em;
    box-sizing: border-box;
    background: #3c3c3c;
    color: #cccccc;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
}

.appPanel .appResults {
    flex: 1 0 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.appResults .answer {
    flex: 0;
    padding: 0.5em;
    text-transform: uppercase;
}

.appResults .answer .value {
    font-weight: bold;
}

.appPanel .appRestart {
    flex: 1 0 0;
    align-self: center;
}

.appPanel .appRestartButton {
    padding: 0.25em 0.5em;
    font-size: 1em;
    border-radius: 1em;
}

.hide {
    visibility: hidden;
}
```
### for .appContainer .appUserInput 
change `height: 80%;`

## Changes in public/js/app.js
### reorder + optimise a bit
```javascript
// Global variables
let webcamStream;
const appResults = document.getElementById('appResults');
const videoElement = document.querySelector('video');
const appRestartButton = document.getElementById('appRestartButton');

let counter = 0;
const counterStart = 0;
const counterStop = 4;
const counterStep = 1;
const timerTick = 1000;
```
### in submitImageFromCanvas()
```javascript
    ...
    // Success!
    const prediction = JSON.parse(request.responseText).prediction;
    processPrediction(prediction);
    ...
```
### Add new method
```javascript
    const processPrediction = (prediciton) => {
        appResults.querySelector(".appUserAnswer").innerHTML = prediciton;
        appRestartButton.classList.remove('hide');
    };
```
### in startCounter()
```javascript
    ...
    canvasElement.classList.add('hide');
    appRestartButton.classList.add('hide');
```
### in const takePhoto = (videoElement, canvasElement) => {
```javascript
    ...
    canvasElement.classList.remove('hide');
```
### After bindCamera(videoElement); call
```javascript
    ...
    bindCamera(videoElement);
    appRestartButton.addEventListener("click", function(){
        startCounter();
    });
```
