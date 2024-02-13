document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    let currentStream;

    // Função para acessar a câmera com base nas restrições
    async function accessCamera(deviceId) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        for (const device of videoDevices) {

            const constraints = {
                video: {
                    videoId: {exact: device.deviceId}
                }
            }
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log(stream.getTracks()[0].getCapabilities())
            
        }
        
    }

    await accessCamera();
    
});