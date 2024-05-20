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
            // console.log('File content:', event.target.result);

            var data = reader.result;

            try {
                if (typeof data === 'object') {
                    data =  JSON.stringify(data);
                } else if (typeof data === 'string') {
                    data =  data;
                } else {
                    data = data.toString();
                }
            } catch (error) {
                console.error('Data type not recognized. Converting to string:', error);
            }

            const loadedData = {source: file.name, content: data};

            vectorStorage.addVector([1,2], loadedData);
            return loadedData;
        };

        reader.onerror = function(event) {
            console.error('File could not be read! Code ' + event.target.error.code);
        };

        reader.readAsText(file);
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