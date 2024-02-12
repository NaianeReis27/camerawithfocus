document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    let currentStream;
    let stream;

    // Função para acessar a câmera com base nas restrições
    async function accessCamera(deviceId) {
        console.log(deviceId)
        try {
            const constraints = {
                video: {
                    facingMode: 'environment'
                }
            };

            if (deviceId) {
                constraints.video.deviceId = deviceId
            }

            stream = await navigator.mediaDevices.getUserMedia(constraints);
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
        console.log(streamgit )
        console.log(stream.getTracks())
        stream.getTracks().forEach(async ele => {
            console.log(ele.getCapabilities())
            if (ele.getCapabilities().focusMode.includes('continuous')) {
                console.log(ele.getCapabilities().deviceId)
                await accessCamera(ele.getCapabilities().deviceId)
                return
            }
        });

    }

    // Verificar se a câmera suporta focusMode contínuo antes de aplicar as constraints
    await accessCamera();
    await checkContinuousFocusSupport();
});