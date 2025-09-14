document.addEventListener('DOMContentLoaded', () => {
    const validationForm = document.getElementById('validationForm');
    const chainSelect = document.getElementById('chainSelect');
    const timelineContainer = document.getElementById('timelineContainer');
    const validationResult = document.getElementById('validationResult');
    if (!validationForm) return;

    // 1. Rellenar el menú desplegable
    if (blockchains.length === 0) {
        chainSelect.innerHTML = '<option disabled selected>No hay cadenas para validar.</option>';
    } else {
        chainSelect.innerHTML = '<option disabled selected>Selecciona un lote para trazar...</option>';
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
        if (!selectedChainIndex) {
            alert("Por favor, selecciona un lote.");
            return;
        }
        
        // 2. "Rehidratamos" la cadena y sus bloques
        const selectedChainData = blockchains[selectedChainIndex];
        const blockchainInstance = Object.assign(new Blockchain(), selectedChainData);
        blockchainInstance.chain = selectedChainData.chain.map(blockData => Object.assign(new Block(), blockData));
        
        // 3. Mostramos la cadena en la línea de tiempo
        renderChain(blockchainInstance.chain);

        // 4. Validamos la cadena y mostramos el resultado
        if (blockchainInstance.isChainValid()) {
            validationResult.innerHTML = `<i class="bi bi-shield-check-fill me-2"></i><strong>Cadena Válida e Íntegra.</strong> La trazabilidad del producto es correcta.`;
            validationResult.className = 'alert alert-success text-center';
        } else {
             validationResult.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i><strong>¡ALERTA! Cadena Rota.</strong> La integridad de los datos está comprometida.`;
            validationResult.className = 'alert alert-danger text-center';
        }
        validationResult.style.display = 'block';
    });

    // Función para dibujar la línea de tiempo
    function renderChain(chain) {
        timelineContainer.innerHTML = '';
        [...chain].reverse().forEach(block => { // Clonar y revertir para mostrar el más nuevo arriba
            const dataHtml = Object.entries(block.data).map(([key, value]) => `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}`).join('<br>');
            const isGenesis = block.index === 0;
            const blockHtml = `
                <div class="timeline-item ${isGenesis ? 'genesis' : ''}">
                    <div class="timeline-icon"><i class="bi ${isGenesis ? 'bi-award-fill' : 'bi-box-seam'}"></i></div>
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