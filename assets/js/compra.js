document.addEventListener('DOMContentLoaded', () => {
    // Busca el formulario de compra y el contenedor del mensaje de éxito.
    const purchaseForm = document.getElementById('purchaseForm');
    const successMessageDiv = document.getElementById('purchaseSuccessMessage');
    if (!purchaseForm || !successMessageDiv) return;

    purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Simular la obtención de datos del producto de la página.
        const productName = document.getElementById('productName').value;
        const origin = document.getElementById('origin').value;
        const producer = document.getElementById('producer').value;
        const quantity = `${document.getElementById('quantity').value} Cajas`;
        const harvestDate = new Date().toISOString();

        // 2. CREACIÓN AUTOMÁTICA DEL BLOQUE GÉNESIS
        let newChain = new Blockchain(productName, origin);
        const genesisData = {
            evento: "Pedido Realizado",
            productor: producer,
            origen: origin,
            lote: quantity
        };
        newChain.chain[0].data = genesisData;
        newChain.chain[0].timestamp = harvestDate;
        newChain.chain[0].hash = newChain.chain[0].calculateHash();

        // 3. Añadimos la nueva cadena a nuestra "base de datos"
        blockchains.push(newChain);
        saveBlockchains();

        // 4. PREPARAMOS Y MOSTRAMOS EL MENSAJE DE ÉXITO
        const newChainIndex = blockchains.length - 1; // Obtenemos el ID del lote
        
        // Creamos un mensaje bonito y personalizado
        successMessageDiv.innerHTML = `
            <i class="bi bi-check-circle-fill fs-3 d-block mb-2"></i>
            <h5 class="alert-heading">¡Gracias por tu compra!</h5>
            <p class="mb-0">Tu pedido para el lote #${newChainIndex} ha sido confirmado. Puedes seguir su trazabilidad en el panel de validación.</p>
        `;

        // Ocultamos el formulario y mostramos el mensaje
        purchaseForm.style.display = 'none';
        successMessageDiv.style.display = 'block';

        // Opcional: Para tu simulación, puedes añadir un log a la consola
        console.log(`Cadena creada con éxito para el lote #${newChainIndex}. Puedes verificarla en el panel del Validador.`);
    });
});