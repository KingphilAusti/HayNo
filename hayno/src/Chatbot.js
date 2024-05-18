import React, { useState, useEffect } from 'react';
import {processMessage} from './scripts/answer';
import ChatLog from './scripts/chatLog';
import './App.css';

function Chatbot() {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState((chatLog) => new ChatLog(chatLog));
    const [updateCall, setUpdateCall] = useState('');


    const askMessage = () => {
        try {
            const newChatLog = new ChatLog(chatLog.log);
            newChatLog.add('user', message);
            setChatLog(newChatLog);
            setMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    const alignMessage = (role) => {
        switch (role) {
            case 'user':
                return 'chatBubble__user';
            case 'assistant':
                return 'chatBubble__assistant';
            default:
                return '';
        }
    }

    useEffect( () => {
        const processOpenAiStream = async (stream) => {
            // setAnswer('');
            const newChatLog = new ChatLog(chatLog.log);
            var currentAnswert = '';
            if (stream.iterator) {
                newChatLog.add('assistant', 'Processing...');
                for await (const part of stream) {
                    currentAnswert += part.choices[0]?.delta?.content || '';
                    setUpdateCall(currentAnswert);
                    newChatLog.updateLastEntry(currentAnswert);
                    console.log(part.choices[0]?.delta?.content || '');
                    setChatLog(newChatLog);
                }
            } else {
                console.error('Stream is not iterable');
            }
            return updateCall;
        };

        if (chatLog.first() && chatLog.first().role === 'user') try {
            processMessage(chatLog).then((response) => {processOpenAiStream(response);})
        }  catch (error) {
            console.error(error);
        }
    }, [chatLog, updateCall]);

    return (
        <div>
            <div>
                <div id="chat" className='chatContainer'>
                    {chatLog.log.map((msg, index) => (
                        <p key={index} className={alignMessage(msg.role)}>
                            <strong>{msg.role}:</strong> {msg.content}
                        </p>
                    ))}
                </div>
                <div>
                    <form className='embedSubmitField' onSubmit={(e) => { e.preventDefault(); askMessage(); }}>
                        <input className='inputTextField' type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Send a message" />
                        <button type="submit" value="Send">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;