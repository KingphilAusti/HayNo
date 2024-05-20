class VectorStorage {
    constructor(vectorStorage) {
        this.vectorTable = vectorStorage || [];
    }

    getEntryAtIndex(index) {
        return this.vectorTable[index];
    }

    getData(index) {
        return this.vectorTable[index].data;
    }

    size() {
        return this.vectorTable.length;
    }

    getNearestNeighbors(vector, k) {
        const distances = this.vectorTable.map((v) => {
            return {
                index: v.index,
                distance: this.__euclideanDistance(vector, v.vector)
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

    addVector(vector, data) {
        return this.vectorTable.push({ vector: vector, data: data });
    }
}

export default VectorStorage;