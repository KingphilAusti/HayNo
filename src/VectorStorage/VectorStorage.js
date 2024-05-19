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

    set(vector, data) {
        if (!vector || !data) {
            throw new Error('Vector and data length mismatch');
        }
        this.vectorTable.push({
            index: this.vectorTable.length,
            vector: vector,
            data: data})
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