document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('originadorForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Capturamos los datos del formulario
        const productName = document.getElementById('productName').value;
        const origin = document.getElementById('origin').value;
        const producer = document.getElementById('producer').value;
        const quantity = document.getElementById('quantity').value;
        const harvestDate = document.getElementById('harvestDate').value;
        
        // 2. Creamos una nueva instancia de nuestra Blockchain para este lote
        let newChain = new Blockchain(productName, origin);

        // 3. Preparamos los datos que irán dentro del primer bloque (Génesis)
        const genesisData = {
            evento: "Cosecha",
            productor: producer,
            origen: origin,
            lote: quantity
        };

        // 4. Actualizamos el bloque Génesis con la información real
        newChain.chain[0].data = genesisData;
        newChain.chain[0].timestamp = new Date(harvestDate).toISOString();
        newChain.chain[0].hash = newChain.chain[0].calculateHash(); // Recalculamos su hash

        // 5. Añadimos la nueva cadena a nuestro array global y la guardamos
        blockchains.push(newChain);
        saveBlockchains();

        alert(`¡Éxito! Cadena de trazabilidad creada para "${productName}".`);
        form.reset();
    });
});