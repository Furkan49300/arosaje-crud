import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConversationsList = () => {
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('id_utilisateur');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await fetch(`https://arosaje-back.onrender.com/api/chat/conversations/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            } else {
                console.error('Failed to fetch conversations');
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const handleConversationClick = (recipientId) => {
        navigate(`/chat/${userId}/${recipientId}`);
    };

    return (
        <div>
            <h1>Conversations</h1>
            <ul>
                {conversations.length > 0 ? conversations.map((conv) => (
                    <li key={conv.id} onClick={() => handleConversationClick(conv.userId1 == userId ? conv.userId2 : conv.userId1)}>
                        Conversation with {conv.userId1 == userId ? conv.userId2 : conv.userId1}
                    </li>
                )) : <li>No conversations found</li>}
            </ul>
        </div>
    );
};

export default ConversationsList;
