import React, { useState, useEffect } from 'react';
import {processMessage} from './Answer';
import ChatLog from './ChatLog';
import './Chatbot.css';
import userImage from '../images/token_user.png'; //Source: https://dakimakuri.com/shop/item/sakurauchi-riko
import assistantImage from '../images/token_assistant.png';

function Chatbot({vectorStorage, setVectorStorage}) {
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
        return 'message ' + role;
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
    const states = { message, setMessage, 
                    chatLog, setChatLog, 
                    updateCall, setUpdateCall, 
                    vectorStorage, setVectorStorage};
        if (chatLog.first() && chatLog.first().role === 'user') try {
            processMessage(chatLog, states);
        }  catch (error) {
            console.error(error);
        }
    }, [message, chatLog, updateCall, vectorStorage]);

    return (
        <div className='window'>
            <div className='chat-container'>
                <div id="chat">
                    <ul className='chat'>
                        {chatLog.log.map((msg, index) => (
                            <li key={index} className={alignMessage(msg.role)}>
                                <img className="logo" src={getAvatar(msg.role)} alt=""></img>
                                <p>
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