// --- CLASE PARA UN BLOQUE INDIVIDUAL ---
// Representa cada paso en la cadena de suministro (cosecha, transporte, etc.)
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;                 // Posición del bloque en la cadena (0, 1, 2...)
        this.timestamp = timestamp;         // Fecha y hora de creación
        this.data = data;                   // La información del evento (quién, qué, dónde)
        this.previousHash = previousHash;   // La firma digital del bloque anterior (¡la clave de la cadena!)
        this.hash = this.calculateHash();   // La firma digital de este bloque
    }

    // Método para calcular la firma digital (hash) de este bloque
    calculateHash() {
        // Se combina toda la información del bloque y se le aplica el algoritmo SHA256
        return CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


// --- CLASE PARA LA CADENA DE BLOQUES COMPLETA ---
// Representa el historial completo de un lote de producto
class Blockchain {
    constructor(productName, origin) {
        this.productName = productName; // Identificador legible para la cadena
        this.origin = origin;           // Otro identificador
        this.chain = [this.createGenesisBlock()]; // La cadena siempre empieza con un bloque "Génesis"
    }

    // El primer bloque es especial, no tiene un "anterior"
    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), { evento: "Creación de Lote (Bloque Génesis)" }, "0");
    }

    // Método para obtener el último bloque añadido
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Método para añadir un nuevo bloque a la cadena
    addBlock(newBlock) {
        // Se conecta el nuevo bloque al último, copiando su hash
        newBlock.previousHash = this.getLatestBlock().hash;
        // Se calcula el hash del nuevo bloque
        newBlock.hash = newBlock.calculateHash();
        // Se añade a la cadena
        this.chain.push(newBlock);
    }

    // Método crucial para verificar si la cadena ha sido alterada
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. ¿Se ha modificado la información de un bloque?
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // 2. ¿Los bloques siguen correctamente enlazados?
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}


// --- SIMULACIÓN DE "BASE DE DATOS" EN EL NAVEGADOR (LocalStorage) ---

// Al cargar, intentamos recuperar las cadenas guardadas. Si no hay ninguna, creamos un array vacío.
let blockchains = [];
const savedChains = localStorage.getItem('blockchains');
if (savedChains) {
    blockchains = JSON.parse(savedChains);
}

// Función para guardar nuestro array de cadenas en la memoria del navegador.
function saveBlockchains() {
    localStorage.setItem('blockchains', JSON.stringify(blockchains));
}