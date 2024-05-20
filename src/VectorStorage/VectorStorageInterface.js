import VectorStorage from './VectorStorage';
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

class VectorStorageInterface {
    constructor(vectorStorage) {
        this.vectorStorage = vectorStorage || new VectorStorage();
    }

    addVectorSet(vector, content) {
        this.vectorStorage.set(vector, content);
    }

    addVector(vector, content) {
        this.vectorStorage.addVector(vector, content);
    }

    getEntryAtIndex(id) {
        return this.vectorStorage.getEntryAtIndex(id);
    }

    getNearestNeighbors(vector, k) {
        return this.vectorStorage.getNearestNeighbors(vector, k);
    }

    getVectorStorage() {
        return this.vectorStorage.vectorTable;
    }

    getDatabase() {
        return this.vectorStorage.getDatabase();
    }

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
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: content,
                encoding_format: "float",
            })
            return {vector: response.data[0].embedding, key: key, content: content};
        }
    }

}

export default VectorStorageInterface;