document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    const cam = document.getElementById('cam');
    let currentStream;
    let stream;

    // Função para acessar a câmera com base nas restrições
    async function accessCamera(deviceId) {
        try {
            const constraints = {
                video: {
                    facingMode: 'environment'
                }
            };

            if (deviceId) {
                constraints.video.deviceId = deviceId
            }
            devices = await navigator.mediaDevices.enumerateDevices();
            console.log(devices)

            stream = await navigator.mediaDevices.getUserMedia(constraints);
            const tracks = stream.getTracks();
            console.log("stream2:"+ tracks)

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
        console.log(stream)
        console.log(stream.getTracks())
        const h2 = document.createElement('h2');
        
        stream.getTracks().forEach(async (ele, index) => {
            if (ele.getCapabilities().focusMode.includes('continuous')) {
                h2.innerText = stream.getTracks()[index].label;
                await accessCamera(ele.getCapabilities().deviceId)
            }
        });

        cam.append(h2)

    }

    // Verificar se a câmera suporta focusMode contínuo antes de aplicar as constraints
    await accessCamera();
    await checkContinuousFocusSupport();
});