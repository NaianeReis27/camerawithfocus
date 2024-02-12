document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    let currentStream;

    // Função para acessar a câmera com base nas restrições
    async function accessCamera(deviceId) {
        try {
            const constraints = {
                video: {
                    facingMode: 'environment'
                }
            };

            if (deviceId) {
                constraints.video.deviceId = deviceId;
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Parar as faixas da stream anterior, se houver
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }

            videoElement.srcObject = stream;
            currentStream = stream;
        } catch (error) {
            console.error('Error accessing media devices: ', error);
        }
    }

    // Verificar se a câmera suporta focusMode contínuo
    async function checkContinuousFocusSupport() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            console.log(videoDevices.length + ' câmeras disponíveis');

            for (const device of videoDevices) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } });
                const tracks = stream.getVideoTracks();

                for (const track of tracks) {
                    if (track && track.getCapabilities && track.getCapabilities().focusMode) {
                        if (track.getCapabilities().focusMode.includes('continuous') && track.getCapabilities().facingMode === "enviroment"
                        ) {
                            console.log(track.getCapabilities())
                            console.log('Continuous focus mode is supported by device:', device.label);
                            await accessCamera(device.deviceId);
                            break; // Parar de verificar após encontrar uma câmera compatível
                        }else{
                            await accessCamera();
                        }
                    }
                }

            }
        } catch (error) {
            console.error('Error checking continuous focus support: ', error);
        }
    }

    // Chamar a função para acessar a câmera e verificar o suporte ao foco contínuo
    await checkContinuousFocusSupport();
});