const canvas = document.getElementById('audio-visualizer');
const audio = document.getElementById('background-audio');
let canvasCtx;
let dataArray;
let analyserNode;

if (canvas) {
    canvasCtx = canvas.getContext('2d');
}

function startVisualizer(analyser) {
    if (!canvas || !analyser) return;

    analyserNode = analyser;
    analyserNode.fftSize = 64; // A good balance for a small visualizer
    const bufferLength = analyserNode.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    draw();
}

function draw() {
    if (!analyserNode || audio.paused) {
        if (canvasCtx) {
             canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
    }

    requestAnimationFrame(draw);

    analyserNode.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / dataArray.length);
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        // Divide by 2 to make the bars less tall and more aesthetic
        const barHeight = dataArray[i] / 2;
        
        canvasCtx.fillStyle = `rgba(255, 255, 255, 0.8)`;
        // Draw bars from the center outwards
        canvasCtx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);

        x += barWidth + 2; // Add spacing
    }
}

if (audio) {
    audio.addEventListener('play', draw);
}