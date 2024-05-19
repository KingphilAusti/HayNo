import VectorStorage from './VectorStorage';

class VectorStorageInterface {
    constructor(vectorStorage) {
        this.vectorStorage = vectorStorage || new VectorStorage();
    }

    saveVector(vector, data) {
        this.vectorStorage.set(vector, data);
    }

    getVector(id) {
        this.vectorStorage.get(id);
    }

    getNearestNeighbors(vector, k) {
        this.vectorStorage.getNearestNeighbors(vector, k);
    }

    getVectorStorage() {
        return this.vectorStorage;
    }

    saveToFile() {
        this.vectorStorage.saveToFile();
    }

    readFromFile() {
        this.vectorStorage.readFromFile();
    }
}

export default VectorStorageInterface;