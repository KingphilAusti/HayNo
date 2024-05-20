import React, { useState } from 'react';

function VectorStorageApp({vectorStorage, setVectorStorage}) {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleFileLoad = () => {
        if (!file) {
            console.log('No file selected!');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(event) {
            console.log('File content:', event.target.result);
        };

        reader.onerror = function(event) {
            console.error('File could not be read! Code ' + event.target.error.code);
        };

        reader.readAsText(file);

        const loadedData = JSON.parse(reader.result);
        vectorStorage.addVector([1,2], loadedData);
        return loadedData;
    }

    return (
        <div>
        <div>
            <p>Load document file:</p>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileLoad}>Load document</button>
        </div>
        <div>
            <p>Load database:</p>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileLoad}>Load database</button>
        </div>
        <div>
            <p>Save database:</p>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileLoad}>Save database</button>
        </div>
        </div>
    );
    
}

export default VectorStorageApp;