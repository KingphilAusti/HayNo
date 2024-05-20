class VectorStorage {
    constructor(vectorStorage) {
        this.vectorTable = vectorStorage || [];
    }

    getEntryAtIndex(index) {
        return this.vectorTable[index];
    }

    getData(index) {
        return this.vectorTable[index].content;
    }

    size() {
        return this.vectorTable.length;
    }

    getNearestNeighbors(vector, k) {
        const distances = this.vectorTable.map((v) => {
            return {
                distance: this.__euclideanDistance(vector, v.vector),
                entry: v
            }
        });
        distances.sort((a, b) => a.distance - b.distance);
        return distances.slice(0, k);
    }

    __euclideanDistance(v1, v2) {
        if (v1.length !== v2.length) {
            throw new Error('Vector length mismatch');
        }
        return Math.sqrt(v1.reduce((acc, val, i) => acc + Math.pow(val - v2[i], 2), 0));
    }

    addVector(vector, content) {
        return this.vectorTable.push({ vector: vector, content: content });
    }
}

export default VectorStorage;