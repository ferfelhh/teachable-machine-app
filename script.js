let model, webcam;
const predictionText = document.getElementById("prediction");

async function loadModel() {
    // Φόρτωση μοντέλου
    model = await tmImage.load('./model.json');
    console.log("Το μοντέλο φορτώθηκε!");
}

async function setupWebcam() {
    webcam = document.getElementById("webcam");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcam.srcObject = stream;

    webcam.addEventListener("loadeddata", async () => {
        while (true) {
            const predictions = await model.predict(webcam);
            const bestPrediction = predictions.reduce((prev, current) => 
                (prev.probability > current.probability ? prev : current)
            );
            predictionText.textContent = `Πρόβλεψη: ${bestPrediction.className} (${(bestPrediction.probability * 100).toFixed(2)}%)`;
            await tf.nextFrame();
        }
    });
}

loadModel().then(setupWebcam);
