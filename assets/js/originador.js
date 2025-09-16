document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('originadorForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const productName = document.getElementById('productName').value;
        const origin = document.getElementById('origin').value;
        const producer = document.getElementById('producer').value;
        const quantity = document.getElementById('quantity').value;
        const harvestDate = document.getElementById('harvestDate').value;
        
        let newChain = new Blockchain(productName, origin);

        const genesisData = { evento: "Cosecha", productor: producer, origen: origin, lote: quantity };
        
        newChain.chain[0].data = genesisData;
        newChain.chain[0].timestamp = new Date(harvestDate).toISOString();
        newChain.chain[0].hash = newChain.chain[0].calculateHash();

        blockchains.push(newChain);
        saveBlockchains();

        alert(`¡Éxito! Cadena de trazabilidad creada para "${productName}".`);
        form.reset();
    });
});