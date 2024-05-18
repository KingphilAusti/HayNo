import React, { useState } from 'react';
import {processMessage} from './scripts/answer';
import ChatLog from './scripts/chatLog';

function Chatbot() {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState((chatLog) => new ChatLog(chatLog));

    const askMessage = async () => {
        try {
            chatLog.add('user', message);
            const response = await processMessage(chatLog);
            if (typeof(response) === 'string') {
                chatLog.add('assistant', response);
            } else {
                await processOpenAiStream(response);
            }
            setMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    const processOpenAiStream = async (stream) => {
        var answer = "";
        chatLog.add('assistant', 'Processing...');
        for await (const part of stream) {
            answer += part.choices[0]?.delta?.content || '';
            chatLog.updateLastEntry(answer);
            console.log(part.choices[0]?.delta?.content || '');
            setChatLog(chatLog);
        }
        return answer;
    }

    return (
        <div>
            <div>
                <div id="chat">
                    {chatLog.get().map((msg, index) => (
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
        </div>
    );
}

export default Chatbot;