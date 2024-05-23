import VectorStorage from './VectorStorage';
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

/**
 * Represents an interface for interacting with a vector storage.
 * @class
 */
class VectorStorageInterface {
    constructor(vectorStorage) {
        this.vectorStorage = vectorStorage || new VectorStorage();
    }

    /**
     * Adds a vector to the vector storage.
     * 
     * @param {Vector} vector - The vector to be added.
     * @param {any} content - The content associated with the vector.
     */
    addVector(vector, content) {
        this.vectorStorage.addVector(vector, content);
    }

    /**
     * Retrieves the entry at the specified index from the vector storage.
     *
     * @param {number} id - The index of the entry to retrieve.
     * @returns {any} The entry at the specified index.
     */
    getEntryAtIndex(id) {
        return this.vectorStorage.getEntryAtIndex(id);
    }

    /**
     * Retrieves the nearest neighbors of a given vector.
     *
     * @param {Vector} vector - The vector for which to find the nearest neighbors.
     * @param {number} k - The number of nearest neighbors to retrieve.
     * @returns {Array<Vector>} An array of the k nearest neighbors.
     */
    getNearestNeighbors(vector, k) {
        return this.vectorStorage.getNearestNeighbors(vector, k);
    }

    /**
     * Retrieves the vector storage.
     * @returns {Array} The vector storage.
     */
    getVectorStorage() {
        return this.vectorStorage.vectorTable;
    }

    /**
     * Returns the number of vectors stored in the vector storage.
     *
     * @returns {number} The number of vectors.
     */
    getNumberOfVectors() {
        return this.vectorStorage.size();
    }

    async searchDatabase(query) {
        const queryEmbedding = await this.getEmbedding(query, {doChunking: false, doEmbedding: false, doChunkingPerEntry: false});
        const nearestNeighbors = this.getNearestNeighbors(queryEmbedding.vector, 5);
        console.log(nearestNeighbors);
        return nearestNeighbors;
    }

    async getEmbedding(content, embeddingSettings) {
        if (embeddingSettings.doChunkingPerEntry) {
            let newContent = [];
            for (const entry in content) {
                newContent.push(await this.__getEmbedding(content[entry], entry, embeddingSettings));
            }
            return newContent;
        } else {
            return await this.__getEmbedding(content, null, embeddingSettings);
        }
    }

    async __getEmbedding(content, key, embeddingSettings) {
        if (embeddingSettings.doChuking) {
            console.error('Chunking is not yet implemented.');
        } else {
            console.log("Creating embedding for: " + key)
            const response = await openai.embeddings.create({
                model: process.env.REACT_APP_EMBEDDING_MODEL,
                input: content,
                encoding_format: "float",
            })
            return {vector: response.data[0].embedding, key: key, content: content};
        }
    }

}

export default VectorStorageInterface;