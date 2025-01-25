// Make handleWalkingSound globally available
function handleWalkingSound (isWalking) {
    const walkingSound = document.getElementById("walkingSound");
    if (!walkingSound) return;

    if (isWalking && localStorage.getItem("isSoundOn") !== "false") {
        walkingSound.currentTime = 0;
        walkingSound.volume = 0.3;
        walkingSound.play().catch((error) => {
            console.log("Could not play walking sound:", error);
        });
    } else {
        walkingSound.pause();
    }
}

// Update toggleSound to check girlfriend's movement status
function toggleSound() {
    isSoundOn = !isSoundOn;
    localStorage.setItem("isSoundOn", isSoundOn.toString());

    if (isSoundOn) {
        if (bgMusic.currentTime < 10) {
            bgMusic.currentTime = 10;
        }
        bgMusic.play();
        if (girlfriend && girlfriend.isMoving) {
            handleWalkingSound(true);
        }
    } else {
        bgMusic.pause();
        handleWalkingSound(false);
    }
    updateSoundIcon();
}

function updateSoundIcon() {
    soundIcon.src = isSoundOn ? "/static/assets/img/sondon.png" : "/static/assets/img/soundoff.png";
}

function playMessageSound() {
    try {
        const messageSound = document.getElementById("messageSound");
        if (messageSound) {
            messageSound.currentTime = 0;
            messageSound.volume = 1.0;
            messageSound.play().catch((error) => {
                console.log("Could not play message sound:", error);
            });
        }
    } catch (error) {
        console.error("Error playing message sound:", error);
    }
}