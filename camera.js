document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    let currentStream;

    // Função para acessar a câmera com base nas restrições
    async function accessCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: 'environment'
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const tracks = stream.getTracks();

            // Parar as faixas da stream anterior, se houver
            if (currentStream) {
                const currentTracks = currentStream.getTracks();
                currentTracks.forEach(track => track.stop());
            }

            videoElement.srcObject = stream;
            currentStream = stream;
        } catch (error) {
            console.error('Error accessing media devices: ', error);
        }
    }

    // Verificar se a câmera suporta focusMode contínuo
    async function checkContinuousFocusSupport() {
        const constraints = {
            video: {
                facingMode: 'environment',
                focusMode: 'continuous'
            }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            return false;
        }
    }

    // Verificar se a câmera suporta focusMode contínuo antes de aplicar as constraints
    const isContinuousFocusSupported = await checkContinuousFocusSupport();

    if (isContinuousFocusSupported) {
        await accessCamera();
    } else {
        console.error('Continuous focus mode is not supported by the camera.');
        // Você pode lidar com isso de acordo com sua lógica de fallback
    }
});