import React, { useEffect, useState } from 'react';

const Chat = ({ userId, recipientId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchMessages();
    }, [userId, recipientId]);

    const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://arosaje-back.onrender.com/api/chat/messages?userId1=${userId}&userId2=${recipientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setMessages(data);
        } else {
            console.error('Failed to fetch messages');
        }
    };

    const handleSendMessage = async () => {
        const token = localStorage.getItem('token');
        const message = {
            senderId: userId,
            recipientId: recipientId,
            content: newMessage,
            timestamp: new Date()
        };

        const response = await fetch('https://arosaje-back.onrender.com/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(message)
        });

        if (response.ok) {
            const savedMessage = await response.json();
            setMessages([...messages, savedMessage]);
            setNewMessage('');
        } else {
            console.error('Failed to send message');
        }
    };

    return (
        <div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderId == userId ? 'Moi' : 'Lui'}: </strong>{msg.content}
                    </div>
                ))}
            </div>
            <div className="input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
