class VectorStorage {
    constructor(vectorStorage) {
        this.vectorTable = vectorStorage || [];
    }

    get(index) {
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

    saveToFile(filename = 'vectorTable.json') {
        // const fs = require('fs');
        // fs.writeFileSync(filename, JSON.stringify(this.vectorTable));
        console.log('saveToFile not implemented');
    }

    readFromFile(filename = 'vectorTable.json') {
        // const fs = require('fs');
        // this.vectorTable = JSON.parse(fs.readFileSync(filename));   
        console.log('readFromFile not implemented');
    }

}

export default VectorStorage;