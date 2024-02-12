document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    const cameraSelect = document.getElementById('cameraSelect');
    const infoCam = document.getElementById('infoCam')
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        videoDevices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;

            option.text = `Camera ${index + 1}`;
            cameraSelect.appendChild(option);
        });

        cameraSelect.addEventListener('change', async () => {
            const deviceId = cameraSelect.value;
            const constraints = {
                video: {
                    deviceId: { exact: deviceId }
                }
            };

            try {
                infoCam.innerHTML = ''
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                const track = stream.getTracks();
                const ul = document.createElement('ul');
                track.forEach(ele => {
                    Object.entries(ele.getSettings()).forEach(([key, value]) => {
                        const li = document.createElement('li');
                        li.textContent = `${key}: ${value}`;
                        ul.appendChild(li);
                    });
                })
                infoCam.append(ul)
                const container = document.createElement("h2")
                videoElement.srcObject = stream;
            } catch (error) {
                console.error('Error accessing media devices: ', error);
            }
        });

        if (videoDevices.length > 0) {
            const defaultDeviceId = videoDevices[0].deviceId;
            const defaultConstraints = {
                video: {
                    deviceId: { exact: defaultDeviceId }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints);

            videoElement.srcObject = stream;
        } else {
            console.error('No video devices found.');
        }
    } catch (error) {
        console.error('Error accessing media devices: ', error);
    }
});