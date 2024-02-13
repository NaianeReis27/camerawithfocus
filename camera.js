document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    let currentStream;

    // Função para acessar a câmera com base nas restrições
    async function accessCamera() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            for (const device of videoDevices) {
                const constraints = {
                    video: {
                        deviceId: device.deviceId
                    }
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (currentStream) {
                    currentStream.getTracks().forEach(track => track.stop());
                }


                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities();
                console.log(capabilities.focusMode)
                console.log(capabilities.facingMode)
                
                if (capabilities.focusMode && capabilities.focusMode.includes('continuous') && capabilities.facingMode.includes('environment')) {
                    console.log("Continuous focus mode is supported by device:", device.label);
                    console.log("Track capabilities:", capabilities);
                    videoElement.srcObject = stream;
                    currentStream = stream;
                    return; // Retorna após encontrar a primeira câmera com foco contínuo
                } else {
                    console.log("Câmera sem suporte para foco contínuo:", device.label);
                }
            }

            // Se não houver nenhuma câmera com foco contínuo
            console.log("Nenhuma câmera com foco contínuo encontrada.");
        } catch (error) {
            console.error("Erro ao acessar a câmera:", error);
        }
    }

    await accessCamera();
});