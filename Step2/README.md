# Step2 changes
Goal:
* Initalize camera
* Take a picture
* Store it in canvas element

## index.html changes
```HTML
<div class="appUserInput">
    <video id="video" autoplay></video>
    <div class="appCanvasContainer">
        <canvas class="appCanvas" id="myCanvas"></canvas>
    </div>
</div>
```
## app.css changes
```CSS
/** Video + canvas **/

.appContainer .appUserInput {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.appContainer video {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.appUserInput .appCanvasContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
}

.appContainer .appCanvasContainer .appCanvas {
    margin: 0 auto;
    width: 100%;
    height: 100%;
}
```

## app.js changes, inside init() method
``` javascript
    // Global variables
    let webcamStream;
    let counter = 0;
    const counterStart = 0;
    const counterStop = 4;
    const counterStep = 1;
    const timerTick = 1000;
    const startCounter = () => {
        let counterTimer;
        const videoElement = document.querySelector("video");
        const canvasElement = document.querySelector("canvas");

        const counterTimerTick = function counterTimerTick() {
            if (counterTimer) {
                clearTimeout(counterTimer);
            }
            counter += counterStep;
            if (counter >= counterStop) {
                takePhoto(videoElement, canvasElement);
                return;
            }
            counterTimer = setTimeout(counterTimerTick, timerTick);
        };
    
        counter = counterStart;
        counterTimerTick();
    };

    const takePhoto = (videoElement, canvasElement) => {
        const canvasContext = canvasElement.getContext('2d');
        const videoSettings = webcamStream.getVideoTracks()[0].getSettings();
        canvasContext.drawImage(videoElement,
            0, 0, videoSettings.width, videoSettings.height,
            0, 0, canvasElement.width, canvasElement.height);
    };

    // Initialize camera
    function bindCamera(videoElement) {
        // Check that getUserMedia is supported
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(
                // constraints
                {
                    video: { facingMode: 'environment' },
                    audio: false
                }).then(
                // successCallback
                function (localMediaStream) {
                    try {
                        videoElement.srcObject = localMediaStream;
                    } catch (error) {
                        videoElement.src = window.URL.createObjectURL(localMediaStream);
                    }
                    webcamStream = localMediaStream;
                    startCounter();
                }).catch(
                // errorCallback
                function (err) {
                    console.log("The following error occured: " + err);
                }
            );
        } else {
            console.log("getUserMedia not supported");
        }
    }

    const videoElement = document.querySelector('video');
    bindCamera(videoElement);
```