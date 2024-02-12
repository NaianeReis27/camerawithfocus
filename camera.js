document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    const cameraSelect = document.getElementById('cameraSelect');
    const infoCam = document.getElementById('infoCam');
    const infoCam2 = document.getElementById('infoCam2');

    let currentStream; // Variável para armazenar a stream atual

    try {
        const devices = await navigator.mediaDevices.enumerateDevices(ele => console.log(ele));
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
                infoCam2.innerHTML = '';
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                const track = stream.getTracks();
                const ul = document.createElement('ul');
                const ul2 = document.createElement('ul');

                track.forEach(ele => {
                    Object.entries(ele.getSettings()).forEach(([key, value]) => {
                        const li = document.createElement('li');
                        const valueString = typeof value === 'object' ? JSON.stringify(value) : value;
                        li.textContent = `${key}: ${valueString}`;
                        ul.appendChild(li);
                    });
                });

                track.forEach(ele => {
                    Object.entries(ele.getCapabilities()).forEach(([key, value]) => {
                        const li = document.createElement('li');
                        li.textContent = `${key}: ${value}`;
                        ul2.appendChild(li);
                    });
                });

                infoCam.append(ul);
                infoCam2.append(ul2);

                videoElement.srcObject = stream;
                currentStream = stream; // Atualizar a stream atual
            } catch (error) {
                console.error('Error accessing media devices: ', error);
            }
        });

        if (videoDevices.length > 0) {
            const defaultGroupId = videoDevices[0].groupId;
            const defaultConstraints = {
                video: {
                    groupId: { exact: defaultGroupId }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
            videoElement.srcObject = stream;
            currentStream = stream; // Definir a stream atual
        } else {
            console.error('No video devices found.');
        }
    } catch (error) {
        console.error('Error accessing media devices: ', error);
    }
});