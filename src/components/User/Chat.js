import React, { useState, useEffect } from 'react';
import Ably from 'ably';

const Chat = ({ channelName }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const ably = new Ably.Realtime('CqPUFw.CKpaWQ:LKObZJJuzsZb8RYpV7jKqQvOeD3YakgM1dhw21VfgKc'); // Remplacez par votre clé API Ably
    const channel = ably.channels.get(channelName);

    useEffect(() => {
        // Récupérer l'historique des messages
        channel.history((err, resultPage) => {
            if (err) {
                console.error('Error fetching message history:', err);
                return;
            }

            const historyMessages = resultPage.items.map(item => item.data);
            setMessages(historyMessages);
        });

        channel.subscribe('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg.data]);
        });

        return () => {
            channel.unsubscribe();
        };
    }, [channel]);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            channel.publish('message', message, (err) => {
                if (err) {
                    console.error('Unable to publish message; err = ' + err.message);
                } else {
                    setMessage('');
                }
            });
        }
    };

    return (
        <div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={handleMessageChange}
                placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chat;
