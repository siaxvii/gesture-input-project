const videoElement = document.querySelector('video');
const overlayCanvas = document.getElementById('overlay');
const passcodeDisplay = document.getElementById('passcode-display');
const ctx = overlayCanvas.getContext('2d');

let passcode = [];
let shiftMode = false;  // Global shift mode (Caps Lock)
let lastInputTime = 0; // Time of the last input
const inputCooldown = 2000; // Cooldown period of 2 seconds between inputs

// Initialize MediaPipe Hands
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
    maxNumHands: 2, // Detect up to 2 hands
    modelComplexity: 1,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8,
});

hands.onResults(onResults);

// Initialize the camera
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480,
});
camera.start();

// Set canvas size to match video
overlayCanvas.width = 640;
overlayCanvas.height = 480;

// Visualize hand landmarks
function drawHandLandmarks(landmarks) {
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height); // Clear previous drawings
    
    ctx.strokeStyle = 'blue'; // Line color
    ctx.lineWidth = 2; // Line width

    // Draw lines between landmarks
    ctx.beginPath();
    for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i].x * overlayCanvas.width;
        const y = landmarks[i].y * overlayCanvas.height;
        ctx.lineTo(x, y); // Create a line to the next landmark
    }
    ctx.stroke();

    // Draw landmarks as dots
    landmarks.forEach((landmark) => {
        const x = landmark.x * overlayCanvas.width;
        const y = landmark.y * overlayCanvas.height;
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a small circle at each landmark
        ctx.fill();
    });
}

// Main function to handle results from MediaPipe
function onResults(results) {
    const handsCount = results.multiHandLandmarks ? results.multiHandLandmarks.length : 0;

    // If two hands are detected, turn on Caps Lock (Shift Mode)
    if (handsCount === 2) {
        shiftMode = true;
        console.log("Caps Lock (Shift Mode) Enabled");
    } else {
        shiftMode = false;
        console.log("Caps Lock (Shift Mode) Disabled");
    }

    // If at least one hand is detected, process gestures from the first hand
    if (handsCount > 0) {
        const primaryHandLandmarks = results.multiHandLandmarks[0];  // Use the first hand for gesture input
        drawHandLandmarks(primaryHandLandmarks);
        
        const letter = detectGesture(primaryHandLandmarks);
        if (letter && Date.now() - lastInputTime > inputCooldown) {
            if (letter === "thumbs_down") {
                handleDeleteCharacter(); // Delete the last character on thumbs down
            } else {
                handleInput(letter);  // Handle regular input
            }
            lastInputTime = Date.now(); // Update the last input time
            passcodeDisplay.innerText = "Passcode: " + passcode.join('');
        }
    }

    // Optionally: Process the second hand for Caps Lock only
    if (handsCount === 2) {
        const secondaryHandLandmarks = results.multiHandLandmarks[1];  // Get the second hand for Caps Lock checking
        // You can also visualize the second hand landmarks if needed
        drawHandLandmarks(secondaryHandLandmarks); // Optional visualization of the second hand
    }
}

// Gesture detection logic
function detectGesture(handLandmarks) {
    const thumbTip = handLandmarks[4];
    const indexTip = handLandmarks[8];
    const middleTip = handLandmarks[12];
    const ringTip = handLandmarks[16];
    const pinkyTip = handLandmarks[20];

    // Check if each finger is extended based on relative joint positions
    const extendedFingers = [
        indexTip.y < handLandmarks[6].y, // Index extended
        middleTip.y < handLandmarks[10].y, // Middle extended
        ringTip.y < handLandmarks[14].y, // Ring extended
        pinkyTip.y < handLandmarks[18].y, // Pinky extended
    ];

    const extendedCount = extendedFingers.filter(Boolean).length;

    if (detectThumbsDown(handLandmarks)) return "thumbs_down";

    
    // Detect specific finger gestures for letters a-f
    if (extendedCount === 1 && extendedFingers[0]) return shiftMode ? "A" : "a"; // 1 finger (index) -> a
    if (extendedCount === 2 && extendedFingers[0] && extendedFingers[1]) return shiftMode ? "B" : "b"; // 2 fingers (index + middle) -> b
    if (extendedCount === 3 && extendedFingers[0] && extendedFingers[1] && extendedFingers[2]) return shiftMode ? "C" : "c"; // 3 fingers -> c
    
    if (extendedFingers[0] && !extendedFingers[1] && !extendedFingers[2] && extendedFingers[3]) {
        return shiftMode ? "F" : "f"; // 'f' for pinky + pointer extended
    }
    if (extendedCount === 4 && extendedFingers[0] && extendedFingers[1] && extendedFingers[2] && extendedFingers[3]) return shiftMode ? "D" : "d"; // 4 fingers -> d
    if (extendedFingers[0] === false && extendedFingers[1] === false && extendedFingers[2] === false && extendedFingers[3] === true && thumbTip.y < handLandmarks[3].y) {
        return shiftMode ? "E" : "e"; // Thumb and pinky extended for E/e
    }
    
    return null; // No gesture detected
}

function detectThumbsDown(handLandmarks) {
    const thumbTip = handLandmarks[4];
    return thumbTip.y > handLandmarks[3].y && // Thumb is below the base joint
           thumbTip.x < handLandmarks[2].x; // Thumb is to the left (for right hand)
}

// Handle input
function handleInput(letter) {
    if (passcode.length < 6) {
        passcode.push(letter);
    }

    // Once the passcode reaches 6 characters, display it and reset
    if (passcode.length === 6) {
        console.log("Passcode Entered:", passcode.join(''));
        setTimeout(resetPasscode, 3000);
    }
}

function resetPasscode() {
    passcode = []; // Clear the passcode array
    passcodeDisplay.innerText = "Passcode: "; // Clear display
    console.log("Passcode has been reset.");
}


// Delete the last character on thumbs down gesture
function handleDeleteCharacter() {
    if (passcode.length > 0) {
        passcode.pop(); // Remove the last character
        console.log("Deleted last character. Current passcode:", passcode.join(''));
    }
}