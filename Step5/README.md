# Step5
Goal:
* Add AI opponent
* Show opponents move

## Changes in public/index.html
```HTML
  <main class="appContainer" id="appContainer">
    <div class="appPanel">
        <div class="appResults" id="appResults">
          <div class="answer"><span>User:&nbsp;</span><span class="appUserAnswer value">-</span></div>
          <div class="answer"><span>AI:&nbsp;</span><span class="appEngineAnswer value">-</span></div>
        </div>
        <div class="appRestart"><button id="appRestartButton" class="appRestartButton hide">NEW GAME</button></div>
    </div>
    <div class="appUserInput">
          <video id="video" autoplay></video>
          <div class="appCanvasContainer">
              <canvas class="appCanvas" id="myCanvas"></canvas>
          </div>
    </div>
    <div class="appVersusLabel"></div>
    <div class="appEnginePick"></div>
  </main>
```

## Changes in public/css/app.css
``` CSS
  .appContainer .appUserInput {
    ...
    height: 50%;
    ...
  }

    /** AI move **/

    .appContainer .appVersusLabel {
        height: 10%;
        background: url('../img/versus_sign.png') 0 0 no-repeat;
        background-size: contain;
        background-position: center center;
    }

    .appContainer .appEnginePick {
        height: 20%;
        background: url('../img/thinking.svg') 0 0 no-repeat;
        background-size: contain;
        background-position: center center;
    }

    .appContainer .appEnginePick.rock {
        background-image: url('../img/rock.png');
    }

    .appContainer .appEnginePick.paper {
        background-image: url('../img/paper.png');
    }

    .appContainer .appEnginePick.scissors {
        background-image: url('../img/scissors.png');
    }
```

## Changes in public/js/app.js
```javascript
// Global variables
...
const picks = ["rock", "paper", "scissors"];
const getEnginePick = () => {
    return picks[Math.floor(Math.random() * picks.length)];
};
...
startCounter()
    ...
    // Clear elements styles
    canvasElement.classList.add('hide');
    appRestartButton.classList.add('hide');
    const enginePickElement = document.querySelector('.appEnginePick');
    picks.forEach(pickLabel => {
        enginePickElement.classList.remove(pickLabel);
    });
...
processPrediction = (prediciton, enginePick) => {
    appResults.querySelector(".appUserAnswer").innerHTML = prediciton;
    appResults.querySelector(".appEngineAnswer").innerHTML = enginePick;
    document.querySelector('.appEnginePick').classList.add(enginePick);
    appRestartButton.classList.remove('hide');
};
...
submitImageFromCanvas()
    ...
    // Success!
    const prediction = JSON.parse(request.responseText).prediction;
    const enginePick = getEnginePick();
    processPrediction(prediction, enginePick);
```