## Hand Gesture-based Passcode Input

This mini-project is a real-time hand gesture-based input technique built using the MediaPipe Hands package. The system allows users to input a passcode by performing specific hand gestures detected via a webcam. 

## Features
- **Hand Gesture Recognition**: Uses the webcam to detect hand gestures in real-time.
- **Shift Mode (Caps Lock)**: Activate shift mode (capital letters) by detecting both hands.
- **Passcode Input**: Input letters based on finger gestures for entering a passcode.
- **Delete Gesture**: Perform a thumbs-down gesture with left hand to delete the last entered character.
- **Real-time Visualization**: The hand landmarks and gestures are visualized in real-time on the screen.
- **Character Display**: The passcode input is displayed as characters are appended, and deleted when necessary.

## Technologies Used
- **HTML**: For the basic structure of the web page.
- **JavaScript**: For handling MediaPipe, gesture recognition logic, and DOM manipulation.
- **MediaPipe Hands**: A machine learning-based solution from Google for real-time hand tracking.
- **CSS**: For basic styling and background image integration.

## Getting Started

### Prerequisites
- A web browser (Google Chrome, Firefox, Edge, etc.)
- A webcam for gesture detection

### Running the Project

1. **Download the Project Files**:
   Clone the repository or download the project files to your local machine.

2. **Open the HTML File**:
   Navigate to the folder where the project files are stored and double-click on the `index.html` file. It will open in your web browser.

3. **Webcam Access**:
   The webpage will ask for access to your webcam. Grant access for the gesture recognition to function.

### Passcode Input Instructions

- **Shift Mode (Caps Lock)**: 
  - Place two hands in view of the camera to enable Shift Mode. The next character will be capitalized. Make sure the second hand is making the same hand gesture as the first hand in order to properly input the capital letter. 
  
- **Gestures**:
  - **A**: Extend only your index finger. 
  - **B**: Extend both the index and middle fingers (peace sign).
  - **C**: Extend the index, middle, and ring fingers (like holding up a three).
  - **D**: Extend all four fingers (index, middle, ring, and pinky).
  - **E**: Extend the thumb and pinky finger (🤙).
  - **F**: Extend the index and pinky finger (horns up! 🤘).
  
- **Delete**: 
  - Perform a thumbs-down gesture with left hand to delete the last entered character.

## Notes:
- Passcodes are limited to 6 characters. Once 6 characters are entered, the passcode is logged, and the system resets after 3 seconds.
