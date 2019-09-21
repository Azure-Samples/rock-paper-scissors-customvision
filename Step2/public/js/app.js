function init() {
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
        // getMedia polyfill
        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        // Check that getUserMedia is supported
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                // constraints
                {
                    video: { facingMode: 'environment' },
                    audio: false
                },
                // successCallback
                function (localMediaStream) {
                    try {
                        videoElement.srcObject = localMediaStream;
                    } catch (error) {
                        videoElement.src = window.URL.createObjectURL(localMediaStream);
                    }
                    webcamStream = localMediaStream;
                    startCounter();
                },
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
    // Do something
}

function onDocumentReady(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

onDocumentReady(init);