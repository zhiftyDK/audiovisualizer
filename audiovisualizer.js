class Visualizer {
    constructor(audio, color="#000000") {
        this.color = color;
        this.audio = audio;
        this.ended = () => {}; // Default to a no-op function       
    }

    bars(bar_amount, bar_width, circle_radius) {
        const color = this.color;
        var constraints = { audio: true } // add video constraints if required
        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            const canvas = document.createElement("canvas");
            canvas.style.position = "absolute";
            canvas.style.zIndex = -1;
            canvas.style.top = 0;
            canvas.style.left = 0;
            canvas.id = "visualizerCanvas";
            document.body.appendChild(canvas);

            const ctx = new AudioContext();
            const audioSource = ctx.createMediaElementSource(this.audio);
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

    curve(curve_width, circle_radius, filled = true) {
        const color = this.color;
        var constraints = { audio: true }; // Add video constraints if required
        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            const canvas = document.createElement("canvas");
            canvas.style.position = "absolute";
            canvas.style.zIndex = -1;
            canvas.style.top = 0;
            canvas.style.left = 0;
            canvas.id = "visualizerCanvas";
            document.body.appendChild(canvas);

            const ctx = new AudioContext();
            const audioSource = ctx.createMediaElementSource(this.audio);
            const analyzer = ctx.createAnalyser();

            audioSource.connect(analyzer);
            audioSource.connect(ctx.destination);

            const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
            analyzer.getByteFrequencyData(frequencyData);

            let canvasCtx = canvas.getContext("2d");

            function renderFrame() {
                // Set to the size of device
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                // Find the center of the window
                const center_x = canvas.width / 2;
                const center_y = canvas.height / 2;

                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                canvasCtx.beginPath();

                analyzer.getByteFrequencyData(frequencyData);

                // Calculate positions for smooth curve
                let points = [];
                for (let i = 0; i < 100; i++) {
                    const rads = Math.PI * 2 / 100;
                    const bar_height = frequencyData[i] * 1.2 || 10;

                    const x = center_x + Math.cos(rads * i) * (circle_radius + bar_height);
                    const y = center_y + Math.sin(rads * i) * (circle_radius + bar_height);

                    points.push({ x, y });
                }

                // Draw smooth curve
                drawCurve(points, filled);
                window.requestAnimationFrame(renderFrame);
            }

            function drawCurve(points, filled) {
                if (points.length < 2) return;

                // Find the center of the window
                const center_x = canvas.width / 2;
                const center_y = canvas.height / 2;
            
                // Define paths for the outer curve and inner circle
                const outerPath = new Path2D();
                const innerCirclePath = new Path2D();
            
                // Inner circle path
                innerCirclePath.arc(center_x, center_y, circle_radius, 0, Math.PI * 2, true);
                innerCirclePath.closePath();  // This is the path for the inner circle (to exclude)
            
                // Start with the outer curve path
                outerPath.moveTo(points[0].x, points[0].y);
                for (let i = 0; i < points.length; i++) {
                    const current = points[i];
                    const next = points[(i + 1) % points.length];  // Wrap around to the first point
                    const nextNext = points[(i + 2) % points.length];  // For smoother control
            
                    const controlPoint1 = {
                        x: current.x + (next.x - points[(i - 1 + points.length) % points.length].x) / 6,
                        y: current.y + (next.y - points[(i - 1 + points.length) % points.length].y) / 6,
                    };
            
                    const controlPoint2 = {
                        x: next.x - (nextNext.x - current.x) / 6,
                        y: next.y - (nextNext.y - current.y) / 6,
                    };
            
                    outerPath.bezierCurveTo(
                        controlPoint1.x, controlPoint1.y,
                        controlPoint2.x, controlPoint2.y,
                        next.x, next.y
                    );
                }
            
                // Close the outer curve path
                outerPath.closePath();
            
                // Clear the canvas to start fresh
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            
                // Step 1: Draw the outer curve (either filled or just stroked)
                canvasCtx.globalCompositeOperation = 'source-over';  // Default operation to draw
            
                if (filled) {
                    // Fill the outer curve with the desired color (semi-transparent if rgba)
                    canvasCtx.fillStyle = color;  
                    canvasCtx.fill(outerPath);    // Fill the outer path
                }
            
                // Step 2: Exclude the center area by filling the inner circle with "cut-out" effect
                canvasCtx.globalCompositeOperation = 'destination-out'; // "Erase" the center circle
                canvasCtx.fillStyle = 'black';  // This will "cut out" the inner circle
                canvasCtx.fill(innerCirclePath);  // Fill the inner circle path to cut it out from the fill
            
                // Step 3: Draw the stroke of the outer curve
                canvasCtx.globalCompositeOperation = 'source-over';  // Reset to default for stroke
            
                // Set the stroke style (ensure it's not transparent)
                canvasCtx.lineWidth = curve_width;  // Stroke thickness
                canvasCtx.lineJoin = 'round';  // Ensure smooth corners
                canvasCtx.lineCap = 'round';  // Ensure rounded stroke ends
            
                // Apply the stroke color (fully opaque, without transparency)
                canvasCtx.strokeStyle = color.split(",")[0] + "," + color.split(",")[1] + "," + color.split(",")[2] + ")";
                canvasCtx.stroke(outerPath);  // Draw the outer curve stroke
            
                // Step 4: Clear any stroke inside the inner circle area to prevent stroke overlap
                canvasCtx.globalCompositeOperation = 'destination-out'; // Clear inside the inner circle
                canvasCtx.lineWidth = 15;  // Stroke width large enough to clear the center
                canvasCtx.stroke(innerCirclePath);  // Clear stroke inside the inner circle
            }                                             

            renderFrame();
        });
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
