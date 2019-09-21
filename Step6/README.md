# Step6
Goal:
* Visualize counter
* Show results

### Changes in public/index.html
```HTML
    <div class="appCounter" id="appCounter"></div>
    <div class="appPanel">
        <div class="appResults" id="appResults">
          <div class="answer"><span>User:&nbsp;</span><span class="appUserAnswer value">-</span></div>
          <div class="answer"><span>AI:&nbsp;</span><span class="appEngineAnswer value">-</span></div>
        </div>
        <div class="resultText"></div>
        <div class="appRestart"><button id="appRestartButton" class="appRestartButton hide">NEW GAME</button></div>
    </div>
```
## Changes in public/css/app.css
```CSS

/** Counter **/
.appContainer .appCounter {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.7);
    color: #000;
    border-radius: 50%;
    padding: 0 0.3em;
    display: block;
    font-size: 10em;
    z-index: 2;
}

.appPanel .resultText {
    flex: 1 0 0;
    align-self: center;
    font-size: 1.6em;
}

.appContainer.userWin {
    border: 1em dashed lightgreen;
    padding: 0;
}

.appContainer.userWin .resultText {
    color: lightgreen;
}

.appContainer.userLose .resultText{
    color: red;
}

.appContainer.userLose {
    border: 1em solid red;
    padding: 0;
}

.appContainer.draw {
    border: 1em dotted lightblue;
    padding: 0;
}

.appContainer.draw .resultText {
    color: lightblue;
} 
```

## Changes in public/js/app.js
```javascript
// Global variables
...
const appContainer = document.getElementById('appContainer');
const resultClasses = {
    WIN: "userWin",
    LOST: "userLose",
    DRAW: "draw"
};

const getWinner = (userPick, enginePick) => {
    var winnerScheme = {
        "rock": "scissors",
        "scissors": "paper",
        "paper": "rock",
    },
    userPickValue = userPick.toLowerCase(),
    enginePickValue = enginePick.toLowerCase();

    if (winnerScheme[userPickValue] === enginePickValue) {
        return "WIN";
    }

    if (winnerScheme[enginePickValue] === userPickValue) {
        return "LOST";
    }

    return "DRAW";
};
...
startCounter()
    ...
    // Reset elements
    canvasElement.classList.add('hide');
    appRestartButton.classList.add('hide');
    const enginePickElement = document.querySelector('.appEnginePick');
    picks.forEach(pickLabel => {
        enginePickElement.classList.remove(pickLabel);
    });
    Object.keys(resultClasses).forEach(function (key) {
        appContainer.classList.remove(resultClasses[key]);
    });
    appContainer.querySelector(".resultText").classList.add("hide");
    appResults.querySelector(".appUserAnswer").innerHTML = "-";
    appResults.querySelector(".appEngineAnswer").innerHTML = "-";
...
processPrediction()
    ...
    // Update results
    var result = getWinner(prediciton, enginePick);
    appContainer.classList.add(resultClasses[result]);
    appContainer.querySelector(".resultText").classList.remove("hide");
    appContainer.querySelector(".resultText").innerHTML = result;
    appRestartButton.classList.remove('hide');
```    