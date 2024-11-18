# Intentclassification

### **About**
Circular audio visualization in javascript.

DISCLAIMER: The javascript code is asking for permission to use the microphone (IT DOESNT USE IT). Its used to make the audio file play without user-interaction.

### **Demo**
Live demo: https://zhiftydk.github.io/audiovisualizer/demo/

Code demo: https://github.com/zhiftyDK/audiovisualizer/tree/main/demo

### **Import**
```html
<script src="https://zhiftydk.github.io/audiovisualizer/audiovisualizer.js"></script>
```

### **How to use**
The canvas css can be changed by using the id = "visualizerCanvas"
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
</head>
<body>
    <script src="https://zhiftydk.github.io/audiovisualizer/audiovisualizer.js"></script>
    <audio id="audio" src="./test.mp3"></audio>
    <button onclick="playAudio()" >Play</button>
    <script>
        const audioElement = document.getElementById("audio");
        // Visualizer takes 5 arguments:
        // Audio element, Amount of bars, Widht of bars, Radius of circle, Color
        const viz = new Visualizer(audioElement, 100, 5, 100, "#000000");
        function playAudio() {
            viz.play();
            viz.addEventListener("ended", () => {
                audioElement.currentTime = 0;
            });
        }
    </script>
</body>
</html>
```
