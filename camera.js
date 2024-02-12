document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    const cameraSelect = document.getElementById('cameraSelect');
    const infoCam = document.getElementById('infoCam');

    let currentStream;

    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        videoDevices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.groupId;
            option.text = `Camera ${index + 1}`;
            cameraSelect.appendChild(option);
        });

        cameraSelect.addEventListener('change', async () => {
            const groupId = cameraSelect.value;
            const constraints = {
                video: {
                    groupId: { exact: groupId }
                } 
            };

            try {
                // Parar a stream anterior, se houver
                if (currentStream) {
                    const tracks = currentStream.getTracks();
                    tracks.forEach(track => track.stop());
                }

                infoCam.innerHTML = ''; // Limpar informações anteriores

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                const track = stream.getTracks();
                const ul = document.createElement('ul');

                track.forEach(ele => {
                    Object.entries(ele.getSettings()).forEach(([key, value]) => {
                        const li = document.createElement('li');
                        li.textContent = `${key}: ${value}`;
                        ul.appendChild(li);
                    });
                });

                infoCam.append(ul);

                videoElement.srcObject = stream;
                currentStream = stream; // Atualizar a stream atual
            } catch (error) {
                console.error('Error accessing media devices: ', error);
            }
        });

        if (videoDevices.length > 0) {
            const defaultgroupId = videoDevices[0].groupId;
            const defaultConstraints = {
                video: {
                    groupId: { exact: defaultgroupId }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
            videoElement.srcObject = stream;
            currentStream = stream;
        } else {
            console.error('No video devices found.');
        }
    } catch (error) {
        console.error('Error accessing media devices: ', error);
    }
});