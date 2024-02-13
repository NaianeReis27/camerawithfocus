document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    const camElement = document.getElementById('cam');

    let currentStream;

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
                
                camElement.innerText = device.label;
                if (capabilities.focusMode && capabilities.facingMode &&
                    capabilities.focusMode.includes('continuous') &&
                    capabilities.facingMode.includes('environment')) {
                    console.log("camera suporta focusMode == 'continuous':", device.label);
                    videoElement.srcObject = stream;
                    currentStream = stream;
                    return
                } else {
                    track.stop();
                }
            }

            const defaultStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment'
                }
            });
            videoElement.srcObject = defaultStream;
            currentStream = defaultStream;

        } catch (error) {
            console.error("Erro ao acessar a câmera:", error);
        }
    }
    await accessCamera();
});