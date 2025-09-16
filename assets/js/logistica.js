document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('logisticaForm');
    const chainSelect = document.getElementById('chainSelect');
    if (!form) return;

    if (blockchains.length === 0) {
        chainSelect.innerHTML = '<option disabled selected>No hay cadenas creadas aún.</option>';
    } else {
        chainSelect.innerHTML = '<option value="" disabled selected>Selecciona un lote...</option>';
        blockchains.forEach((chain, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Lote #${index}: ${chain.productName} de ${chain.origin}`;
            chainSelect.appendChild(option);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedChainIndex = chainSelect.value;
        if (selectedChainIndex === "") {
            alert("Por favor, selecciona un lote.");
            return;
        }

        const blockchainInstance = rehydrateBlockchain(blockchains[selectedChainIndex]);

        const newBlock = new Block(
            0, // El índice se corregirá en el método addBlock
            new Date(document.getElementById('eventDate').value).toISOString(), {
                evento: document.getElementById('eventType').value,
                ubicacion: document.getElementById('location').value,
                responsable: document.getElementById('responsible').value
            }
        );

        blockchainInstance.addBlock(newBlock);
        
        blockchains[selectedChainIndex] = blockchainInstance;
        saveBlockchains();

        alert(`¡Bloque agregado con éxito al Lote #${selectedChainIndex}!`);
        location.reload();
    });
});