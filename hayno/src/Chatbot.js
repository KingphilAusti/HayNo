import React, { useState, useEffect } from 'react';
import {processMessage} from './scripts/answer';
import ChatLog from './scripts/chatLog';

function Chatbot() {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState((chatLog) => new ChatLog(chatLog));

    
    const askMessage = async () => {
        try {
            const newChatLog = new ChatLog(chatLog.log);
            newChatLog.add('user', message);
            setChatLog(newChatLog);
            setMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect( () => {    
        const processOpenAiStream = (stream) => {
            var answer = "";
            const newChatLog = new ChatLog(chatLog.log);
            if (stream.iterator) {
                newChatLog.add('assistant', 'Processing...');
                for (const part of stream) {
                    answer += part.choices[0]?.delta?.content || '';
                    newChatLog.updateLastEntry(answer);
                    console.log(part.choices[0]?.delta?.content || '');
                    setChatLog(newChatLog);
                }
            } else {
                console.error('Stream is not iterable');
            }
            return answer;
        };

        if (chatLog.first() && chatLog.first().role === 'user') try {
            processMessage(chatLog).then((response) => {processOpenAiStream(response);})
        }  catch (error) {  
            console.error(error);
        }
    }, [chatLog]);

    return (
        <div>
            <div>
                <div id="chat">
                    {chatLog.log.map((msg, index) => (
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