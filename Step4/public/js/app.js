function init() {
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
    const startCounter = () => {
        let counterTimer;
        const videoElement = document.querySelector("video");
        const canvasElement = document.querySelector("canvas");
        canvasElement.classList.add('hide');
        appRestartButton.classList.add('hide');
        
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

    const processPrediction = (prediciton) => {
        appResults.querySelector(".appUserAnswer").innerHTML = prediciton;
        appRestartButton.classList.remove('hide');
    };

    const submitImageFromCanvas = (canvasElement) => {
        const request = new XMLHttpRequest();
        request.open('POST', "/predict", true);
        request.setRequestHeader('Content-Type', 'application/octet-stream');
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                const prediction = JSON.parse(request.responseText).prediction;
                processPrediction(prediction);
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
        canvasElement.classList.remove('hide');
        const canvasContext = canvasElement.getContext('2d');
        const videoSettings = webcamStream.getVideoTracks()[0].getSettings();
        canvasContext.drawImage(videoElement,
            0, 0, videoSettings.width, videoSettings.height,
            0, 0, canvasElement.width, canvasElement.height);
        submitImageFromCanvas(canvasElement);
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


    bindCamera(videoElement);
    appRestartButton.addEventListener("click", function(){
        startCounter();
    });
}

function onDocumentReady(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

onDocumentReady(init);