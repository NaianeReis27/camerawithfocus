document.addEventListener("DOMContentLoaded", async () => {
    const videoElement = document.getElementById('video');
    let currentStream;

    async function accessCamera() {
        const constraints = {
            video: {
                facingMode: 'environment'
            }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Parar o stream de vídeo atual, se houver
            if (currentStream) {
                stopStream(currentStream);
            }

            // Filtrar as faixas de vídeo que correspondem aos critérios desejados
            const foundTracks = stream.getVideoTracks().filter(track => {
                const capabilities = track.getCapabilities();
                return capabilities.facingMode === 'environment' && capabilities.focusMode.includes('continuous');
            });

            if (foundTracks.length > 0) {
                // Se uma faixa com foco correto for encontrada, atualize a stream atual
                currentStream = stream;
                console.log('Câmera encontrada:', foundTracks[0]);
            } else {
                console.warn('Nenhuma câmera encontrada com os critérios especificados.');
            }

            // Exibir a stream no elemento de vídeo
            videoElement.srcObject = stream;
        } catch (error) {
            console.error('Erro ao acessar a câmera:', error);
        }
    }

    // Função para parar um stream de mídia
    function stopStream(stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    // Chamada inicial para acessar a câmera
    await accessCamera();
});