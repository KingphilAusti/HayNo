import React, { useState, useEffect } from 'react';
import {processMessage} from './Answer';
import ChatLog from './ChatLog';
import './Chatbot.css';
import userImage from '../images/token_user.png'; //Source: https://dakimakuri.com/shop/item/sakurauchi-riko
import assistantImage from '../images/token_assistant.png';

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
                return 'message right';
            case 'assistant':
                return 'message left';
            default:
                return '';
        }
    }

    const getAvatar = (role) => {
        switch (role) {
            case 'user':
                return userImage;
            case 'assistant':
                return assistantImage;
            default:        
                return '';
        }
    }

    useEffect( () => {
        const processStringStream = async (stream) => {
            // setAnswer('');
            const newChatLog = new ChatLog(chatLog.log);
            var currentAnswer = '';
            if (stream.iterator) {
                newChatLog.add('assistant', 'Processing...');
                for await (const part of stream) {
                    currentAnswer += part.choices[0]?.delta?.content || '';
                    setUpdateCall(currentAnswer);
                    newChatLog.updateLastEntry(currentAnswer);
                    setChatLog(newChatLog);
                }
            } else {
                console.error('Stream is not iterable');
            };
        };

        if (chatLog.first() && chatLog.first().role === 'user') try {
            processMessage(chatLog).then((response) => {processStringStream(response);});
        }  catch (error) {
            console.error(error);
        }
    }, [chatLog, updateCall]);

    return (
        <div className='window'>
            <div className='chat-container'>
                <div id="chat">
                    <ul className='chat'>
                        {chatLog.log.map((msg, index) => (
                            <li className={alignMessage(msg.role)}>
                            <img className="logo" src={getAvatar(msg.role)} alt=""></img>
                            <p key={index}>
                                {msg.content}
                            </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div>
                    <form className='embedSubmitField' onSubmit={(e) => { e.preventDefault(); askMessage(); }}>
                        <input className='text_input' type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Send a message" />
                        {/* <button type="submit" value="Send">Send</button> */}
                    </form>
                </div>
        </div>
    );
}

export default Chatbot;