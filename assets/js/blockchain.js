// CLASE PARA UN BLOQUE INDIVIDUAL
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

// CLASE PARA LA CADENA DE BLOQUES COMPLETA
class Blockchain {
    constructor(productName, origin) {
        this.productName = productName;
        this.origin = origin;
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), { evento: "Creación de Lote (Génesis)" }, "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // ✅ MÉTODO ADD BLOCK CORREGIDO
    addBlock(newBlock) {
        newBlock.index = this.chain.length; // Asegura que el índice sea correcto
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}

// ✅ FUNCIÓN DE "REHIDRATACIÓN" MEJORADA
// Esta función toma los datos planos de localStorage y los convierte de nuevo en objetos de clase con métodos
function rehydrateBlockchain(chainData) {
    const blockchainInstance = new Blockchain(chainData.productName, chainData.origin);
    blockchainInstance.chain = chainData.chain.map(blockData => {
        const block = new Block(blockData.index, blockData.timestamp, blockData.data, blockData.previousHash);
        block.hash = blockData.hash; // Asignamos el hash guardado, no lo recalculamos aquí
        return block;
    });
    return blockchainInstance;
}

let blockchains = [];
const savedChains = localStorage.getItem('blockchains');
if (savedChains) {
    blockchains = JSON.parse(savedChains);
}

function saveBlockchains() {
    localStorage.setItem('blockchains', JSON.stringify(blockchains));
}
