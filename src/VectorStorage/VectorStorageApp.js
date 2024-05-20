import React, { useState } from 'react';
import VectorStorageInterface from './VectorStorageInterface';
import { enumBooleanBody } from '@babel/types';

function VectorStorageApp({vectorStorage, setVectorStorage}) {
    const [documentFile, setDocumentFile] = useState(null);
    const [databaseFile, setDatabaseFile] = useState(null);
    const [embeddingSettings, setEmbeddingSettings] = useState({});

    const handleDocumentFileChange = (event) => {
        const newFile = event.target.files[0];
        setDocumentFile(newFile);
    }

    const handleDocumentFileLoad = () => {
        if (!documentFile) {
            console.log('No file selected!');
            return;
        }

        const reader = new FileReader();

        reader.onload = async function(event) {
            const data = reader.result;
            const content = documentFile.type === 'application/json' ? JSON.parse(data) : data;
            if (embeddingSettings.doEmbedding) {
                const embeddedContent = await vectorStorage.getEmbedding(content, embeddingSettings);
                for (let entry of embeddedContent) {
                    vectorStorage.addVector(entry.vector, {source: {document: documentFile.name, key: entry.key}, content: entry.content});
                }
            } else {
                vectorStorage.addVector(null, {source: documentFile.name, content: content});
            }
        };

        reader.onerror = function(event) {
            console.error('File could not be read! Code ' + event.target.error.code);
        };

        reader.readAsText(documentFile);
    }

    const handleDatabaseFileChange = (event) => {
        const newFile = event.target.files[0];
        setDatabaseFile(newFile);
    }

    const handleDatabaseFileLoad = () => {
        if (!databaseFile) {
            console.log('No file selected!');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(event) {
            const data = reader.result;
            const newVectorStorageData = JSON.parse(data);
            for (let entry of newVectorStorageData) {
                vectorStorage.addVector(entry.vector, entry.content);
            }
        };

        reader.onerror = function(event) {
            console.error('File could not be read! Code ' + event.target.error.code);
        };

        reader.readAsText(databaseFile);
    }

    const handleDatabaseSave = () => {
        // Create a blob of the data

        let data = JSON.stringify(vectorStorage.getVectorStorage());
        let blob = new Blob([data], {type: 'application/json'});

        // Create a link element
        let url = window.URL.createObjectURL(blob);

        window.open(url, '_blank');
    }


    return (
        <div>
            <h1>Vector Storage</h1>
            <div>
                <p>Load document file:</p>
                <input type="file" onChange={handleDocumentFileChange} />
                <button onClick={handleDocumentFileLoad}>Load document</button>
                <div>
                    <h3>Embedding Settings</h3>
                    <label>
                        Do Embedding:
                        <input type="checkbox" onChange={(e) => setEmbeddingSettings({...embeddingSettings, doEmbedding: e.target.checked})} />
                    </label>
                    <br />
                    <label>
                        Do Chunking:
                        <input type="checkbox" onChange={(e) => setEmbeddingSettings({...embeddingSettings, doChunking: e.target.checked})} />
                    </label>
                    <br />
                    <label>
                        Do Chunking Per Entry:
                        <input type="checkbox" onChange={(e) => setEmbeddingSettings({...embeddingSettings, doChunkingPerEntry: e.target.checked})} />
                    </label>
                    <br />
                    <label>
                        Chunking Size:
                        <input type="number" onChange={(e) => setEmbeddingSettings({...embeddingSettings, chunkingSize: parseInt(e.target.value)})} />
                    </label>
                </div>
            </div>
            <div>
                <p>Load database:</p>
                <input type="file" onChange={handleDatabaseFileChange} />
                <button onClick={handleDatabaseFileLoad}>Load database</button>
            </div>
            <div>
                <p>Check/save database:</p>
                <button onClick={handleDatabaseSave}>Check/save database</button>
            </div>
            <div>
                <h3>Vector Storage Figure</h3>
                <p>Number of vectors: {vectorStorage.getNumberOfVectors()}</p>
            </div> 
        </div>
    );
    
}

export default VectorStorageApp;