import VectorStorage from './VectorStorage';

class VectorStorageInterface {
    constructor(vectorStorage) {
        this.vectorStorage = vectorStorage || new VectorStorage();
    }

    addVectorSet(vector, data) {
        this.vectorStorage.set(vector, data);
    }

    addVector(id, vector) {
        this.vectorStorage.addVector(id, vector);
    }

    getVector(id) {
        return this.vectorStorage.get(id);
    }

    getNearestNeighbors(vector, k) {
        return this.vectorStorage.getNearestNeighbors(vector, k);
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

    getNumberOfVectors() {
        return this.vectorStorage.size();
    }
}

export default VectorStorageInterface;