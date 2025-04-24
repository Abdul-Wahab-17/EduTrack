// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatRoom from './ChatRoom';

const ChatPage = ({ username }) => {
  const [newChatUser, setNewChatUser] = useState('');
  const [ongoingChats, setOngoingChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const loadChats = async () => {
    if (!username) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/api/chats/${username}`,
        { withCredentials: true }
      );
      setOngoingChats(res.data);
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  useEffect(() => {
    loadChats();
  }, [username]);

  const startChat = async () => {
    const target = newChatUser.trim();
    if (!target || target === username) return;
    try {
      await axios.post(
        'http://localhost:8080/api/messages',
        { sender: username, receiver: target, message: 'Hello!' },
        { withCredentials: true }
      );
      setNewChatUser('');
      await loadChats();
      setActiveChat(target);
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Start a New Chat</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded p-2"
            placeholder="Enter username"
            value={newChatUser}
            onChange={e => setNewChatUser(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={startChat}
          >
            Start
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Ongoing Chats</h2>
        {ongoingChats.length === 0 ? (
          <p className="text-gray-500">No ongoing chats.</p>
        ) : (
          <ul className="space-y-2">
            {ongoingChats.map((chat, i) => (
              <li
                key={i}
                className="border rounded p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setActiveChat(chat.username)}
              >
                {chat.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      {activeChat && (
        <div className="mt-6">
          <ChatRoom username={username} recipient={activeChat} />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
