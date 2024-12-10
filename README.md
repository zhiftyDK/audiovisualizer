# Audio Visualizer

### **About**
Circular audio visualization in javascript.

DISCLAIMER: The javascript code is asking for permission to use the microphone (IT DOESNT USE IT). Its used to make the audio file play without user-interaction.

### **Demo**
Live demo: https://zhiftydk.github.io/audiovisualizer/demo/

### **How to use**
Import:
```html
<script src="https://zhiftydk.github.io/audiovisualizer/audiovisualizer.js"></script>
```

Create visualizer:
```js
const viz = new Visualizer(audioElement, "#000000"); // Audio Element, Color
```

Initialize visualizer (bar or curve):
```js
// Cant use both at the same time, unless you have 2 viz classes and 2 individual audioelements assigned to each class

viz.bars(100, 5, 100); // bar_amount, bar_width, circle_radius
viz.curve(5, 100, true); // curve_width, circle_radius, filled
```

Play visualization and audio:
```js
viz.play();
```

Event "ended" fires when visualization and audio has stopped:
```js
viz.addEventListener("ended", () => {
    // Do whatever when viz has ended
    // If you are using the same sound file you could reset it:
    audioElement.currentTime = 0;
});
```


### **Canvas CSS**
The canvas css can be changed by using the id = "visualizerCanvas"
```css
// The default css is:
#visualizerCanvas {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
}
```

### **Examples**
Audio visualizer with bar graph:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bars</title>
</head>
<body>
    <script src="../audiovisualizer.js"></script>
    <audio id="audio" src="./test.mp3"></audio>
    <button onclick="playAudio()" >Play</button>
    <script>
        const audioElement = document.getElementById("audio");
        const viz = new Visualizer(audioElement, "#000000"); // Audio Element, Color
        viz.bars(100, 5, 100); // bar_amount, bar_width, circle_radius

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

Audio visualizer with curve graph:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Curve</title>
</head>
<body>
    <script src="../audiovisualizer.js"></script>
    <audio id="audio" src="./test.mp3"></audio>
    <button onclick="playAudio()" >Play</button>
    <script>
        const audioElement = document.getElementById("audio");
        const viz = new Visualizer(audioElement, "rgba(0,0,0,0.5)"); // Audio Element, Color
        viz.curve(5, 100, true); // curve_width, circle_radius, filled

        function playAudio() {
            viz.play();
            viz.addEventListener("ended", () => {
                audio1.currentTime = 0;
            });
        }
    </script>
</body>
</html>
```
