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
                    deviceId: { exact: device.deviceId }
                }
            };
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                console.log(stream.getTracks()[0].getCapabilities().focusMode)
                console.log("Câmera com foco contínuo encontrada:", device.label);
                // Faça algo com a câmera encontrada aqui, se necessário
                break; // Interrompe o loop após encontrar a primeira câmera
            } catch (error) {
                console.error("Erro ao acessar a câmera:", error);
            }
        }
    }

    await accessCamera();
});