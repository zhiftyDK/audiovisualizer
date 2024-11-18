class Visualizer {
    constructor(audio, bar_amount, bar_width, circle_radius, color="#ffffff") {
        const canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.zIndex = -1;
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.id = "visualizerCanvas"
        document.body.appendChild(canvas);
        this.audio = audio;
        this.ended = () => {}; // Default to a no-op function
        
        var constraints = { audio: true } // add video constraints if required
        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            const ctx = new AudioContext();
            const audioSource = ctx.createMediaElementSource(audio);
            const analyzer = ctx.createAnalyser();

            audioSource.connect(analyzer);
            audioSource.connect(ctx.destination);
            
            const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
            analyzer.getByteFrequencyData(frequencyData);
    
            let canvasCtx = canvas.getContext("2d");
            
            function renderFrame() {
                // set to the size of device
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                    
                // find the center of the window
                const center_x = canvas.width / 2;
                const center_y = canvas.height / 2;
            
                analyzer.getByteFrequencyData(frequencyData);
                    
                for(let i = 0; i < bar_amount; i++){
                        
                    //divide a circle into equal parts
                    const rads = Math.PI * 2 / bar_amount;
                    const bar_height = frequencyData[i] * 0.5 || 10;
            
                    const x = center_x + Math.cos(rads * i) * circle_radius;
                    const y = center_y + Math.sin(rads * i) * circle_radius;
                    const x_end = center_x + Math.cos(rads * i) * (circle_radius + bar_height);
                    const y_end = center_y + Math.sin(rads * i) * (circle_radius + bar_height);
                        
                    //draw a bar
                    drawBar(x, y, x_end, y_end, bar_width, frequencyData[i]);
                }
            
                window.requestAnimationFrame(renderFrame);
            }
            
            function drawBar(x1, y1, x2, y2, width, frequency) {
                // Style bars
                let lineColor = color;
                canvasCtx.strokeStyle = lineColor;
    
                // Draw bars
                canvasCtx.lineWidth = width;
                canvasCtx.beginPath();
                canvasCtx.moveTo(x1, y1);
                canvasCtx.lineTo(x2, y2);
                canvasCtx.stroke();
            }
            
            renderFrame();
        })       
    }

    addEventListener(eventType, callback) {
        if (eventType !== "ended") return;
        if (typeof callback !== "function") return;
        this.ended = callback;
    }

    play() {
        this.audio.volume = 1.0;
        this.audio.play();
        this.audio.addEventListener("ended", () => {
            if (typeof this.ended === "function") {
                this.ended();
            }
        });
    }
}