document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    let cameraSelectId;
    let currentStream;

    // Função para acessar a câmera com base nas restrições
    async function accessCamera() {
        const constraints = {
            video: {
                facingMode: 'environment',
                focus: 'manual'
            }
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const tracks = stream.getTracks();

            // Parar as faixas da stream anterior, se houver
            if (currentStream) {
                const currentTracks = currentStream.getTracks();
                currentTracks.forEach(track => track.stop());
            }

            // Filtrar as faixas de vídeo que correspondem aos critérios desejados
            const foundTracks = tracks.filter(track => {
                const capabilities = track.getCapabilities();
                return capabilities.facingMode === 'environment' && capabilities.focusMode.includes('continuous');
            });

            // Se uma faixa com foco correto for encontrada, atualize cameraSelectId
            if (foundTracks.length > 0) {
                constraints.video.deviceId = cameraSelectId;
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
            }

            console.log(foundTracks);
            videoElement.srcObject = stream;
            currentStream = stream;
        } catch (error) {
            console.error('Error accessing media devices: ', error);
        }
    }


    await accessCamera();
});