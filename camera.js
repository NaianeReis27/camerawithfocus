document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    let cameraSelectId;

    let currentStream; 
    const constraints = {
        video: true
    }
    if (cameraSelectId) {
        constraints.video.deviceId = cameraSelectId;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const tracks = stream.getTracks();

        if (currentStream) {
            const tracks = currentStream.getTracks();
            tracks.forEach(track => track.stop());
        }
        const foundTracks = tracks.filter(track => {
            const capabilities = track.getCapabilities();
            return capabilities.facingMode === 'environment' && capabilities.focusMode.includes('continuous');
        });
        if (foundTracks.length > 0) {
            cameraSelectId = foundTracks[0].id
        }
        console.log(foundTracks)

        videoElement.srcObject = stream;
        currentStream = stream; 
    } catch (error) {
        console.error('Error accessing media devices: ', error);
    }
});
