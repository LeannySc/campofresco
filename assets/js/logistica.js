document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('logisticaForm');
    const chainSelect = document.getElementById('chainSelect');
    if (!form) return;

    // 1. Rellenar el menú desplegable con las cadenas que ya existen
    if (blockchains.length === 0) {
        chainSelect.innerHTML = '<option disabled selected>No hay cadenas creadas aún.</option>';
    } else {
        chainSelect.innerHTML = '<option disabled selected>Selecciona un lote...</option>';
        blockchains.forEach((chain, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Lote #${index}: ${chain.productName} de ${chain.origin}`;
            chainSelect.appendChild(option);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 2. Obtenemos los datos del formulario
        const selectedChainIndex = chainSelect.value;
        if (!selectedChainIndex) {
            alert("Por favor, selecciona un lote.");
            return;
        }

        // 3. Creamos un objeto Block con la nueva información
        const newBlock = new Block(
            0, // El índice se corregirá al añadirlo
            new Date(document.getElementById('eventDate').value).toISOString(), {
                evento: document.getElementById('eventType').value,
                ubicacion: document.getElementById('location').value,
                responsable: document.getElementById('responsible').value
            }
        );
        
        // 4. "Rehidratamos" la cadena para poder usar sus métodos
        const selectedChainData = blockchains[selectedChainIndex];
        const blockchainInstance = Object.assign(new Blockchain(), selectedChainData);
        // También rehidratamos cada bloque
        blockchainInstance.chain = selectedChainData.chain.map(blockData => Object.assign(new Block(), blockData));

        // 5. Añadimos el nuevo bloque
        blockchainInstance.addBlock(newBlock);
        
        // 6. Actualizamos y guardamos
        blockchains[selectedChainIndex] = blockchainInstance;
        saveBlockchains();

        alert(`¡Bloque agregado con éxito al Lote #${selectedChainIndex}!`);
        location.reload(); // Recargar la página para ver cambios
    });
});