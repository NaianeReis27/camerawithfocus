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
                
                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities();
                
                console.log("Stream Video Tracks:", stream.getVideoTracks());
                console.log("Focus Mode:", capabilities.focusMode);
                console.log("Facing Mode:", capabilities.facingMode);

                if (capabilities.focusMode && capabilities.facingMode &&
                    capabilities.focusMode.includes('continuous') && 
                    capabilities.facingMode.includes('environment')) {
                    console.log("Continuous focus mode is supported by device:", device.label);
                    console.log("Track capabilities:", capabilities);
                    videoElement.srcObject = stream;
                    currentStream = stream;
                    break; // interrompe o loop após encontrar a primeira câmera compatível
                } else {
                    console.log("Câmera sem suporte para foco contínuo:", device.label);
                    stream.getTracks().forEach(track => track.stop());
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