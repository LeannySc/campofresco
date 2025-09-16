document.addEventListener('DOMContentLoaded', () => {
    const validationForm = document.getElementById('validationForm');
    const chainSelect = document.getElementById('chainSelect');
    const timelineContainer = document.getElementById('timelineContainer');
    const validationResult = document.getElementById('validationResult');
    if (!validationForm) return;

    if (blockchains.length === 0) {
        chainSelect.innerHTML = '<option disabled selected>No hay cadenas para validar.</option>';
    } else {
        chainSelect.innerHTML = '<option value="" disabled selected>Selecciona un lote para trazar...</option>';
        blockchains.forEach((chain, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Lote #${index}: ${chain.productName} de ${chain.origin}`;
            chainSelect.appendChild(option);
        });
    }

    validationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedChainIndex = chainSelect.value;
        if (selectedChainIndex === "") {
            alert("Por favor, selecciona un lote.");
            return;
        }
        
        const blockchainInstance = rehydrateBlockchain(blockchains[selectedChainIndex]);
        
        renderChain(blockchainInstance.chain);

        if (blockchainInstance.isChainValid()) {
            validationResult.innerHTML = `<i class="bi bi-shield-check-fill me-2"></i><strong>Cadena Válida e Íntegra.</strong> La trazabilidad es correcta.`;
            validationResult.className = 'alert alert-success text-center';
        } else {
            validationResult.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i><strong>¡ALERTA! Cadena Rota.</strong> La integridad de los datos está comprometida.`;
            validationResult.className = 'alert alert-danger text-center';
        }
        validationResult.style.display = 'block';
    });

    function renderChain(chain) {
        timelineContainer.innerHTML = '';
        [...chain].reverse().forEach(block => {
            const dataHtml = Object.entries(block.data).map(([key, value]) => `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}`).join('<br>');
            const isGenesis = block.index === 0;
            const blockHtml = `
                <div class="timeline-item ${isGenesis ? 'genesis' : ''}">
                    <div class.timeline-icon"><i class="bi ${isGenesis ? 'bi-award-fill' : 'bi-box-seam'}"></i></div>
                    <div class="timeline-content">
                        <span class="timeline-date">${new Date(block.timestamp).toLocaleString('es-ES')}</span>
                        <h5>Bloque ${block.index} - ${block.data.evento}</h5>
                        <p>${dataHtml}</p>
                        <small class="text-muted blockchain-hash">
                            Hash: ${block.hash.substring(0, 12)}...<br>
                            Hash Anterior: ${block.previousHash.substring(0, 12)}...
                        </small>
                    </div>
                </div>`;
            timelineContainer.innerHTML += blockHtml;
        });
    }
});