import React from 'react';
import { useParams } from 'react-router-dom';
import Chat from './Chat'; // Importez votre composant de chat

const ChatPage = () => {
    const { userId, recipientId } = useParams(); // Récupérez les paramètres de l'URL

    return (
        <div>
            <h1>Chat</h1>
            <Chat userId={userId} recipientId={recipientId} /> {/* Passez les paramètres au composant Chat */}
        </div>
    );
};

export default ChatPage;
