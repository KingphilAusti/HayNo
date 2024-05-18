import React, { useState } from 'react';
import {processMessage} from './scripts/answer';
import ChatLog from './scripts/chatLog';

function Chatbot() {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState((chatLog) => new ChatLog(chatLog));

    const askMessage = async () => {
        try {
            chatLog.add('You', message);
            const response = await processMessage(chatLog);
            chatLog.add('Riko', response);
            setMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div>
                <div id="chat">
                    {chatLog.get().toReversed().map((msg, index) => (
                        <div key={index} className="message">
                            <strong>{msg.role}:</strong> {msg.content}
                        </div>
                    ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); askMessage(); }}>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Send a message" />
                    <input type="submit" value="Send" />
                </form>
            </div>
            <div className="lg:w-1/2 2xl:w-1/3 p-8 rounded-md bg-gray-100">
                <h1 className="text-3xl font-bold mb-6">
                    Streaming OpenAI API Completions in JavaScript
                </h1>
                <div id="resultContainer" className="mt-4 h-48 overflow-y-auto">
                    <p className="text-gray-500 text-sm mb-2">Generated Text</p>
                    <p id="resultText" className="whitespace-pre-line"></p>
                </div>
                <input
                    type="text"
                    id="promptInput"
                    className="w-full px-4 py-2 rounded-md bg-gray-200 placeholder-gray-500 focus:outline-none mt-4"
                    placeholder="Enter prompt..."
                />
                <div className="flex justify-center mt-4">
                    <button
                        id="generateBtn"
                        onClick={processMessage}
                        className="w-1/2 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        Generate
                    </button>
                    <button
                        id="stopBtn"
                        disabled
                        className="w-1/2 px-4 py-2 rounded-md border border-gray-500 text-gray-500 hover:text-gray-700 hover:border-gray-700 focus:outline-none ml-2 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        Stop
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;