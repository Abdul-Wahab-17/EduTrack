// src/pages/ChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';
import axios from 'axios';

export default function ChatRoom({ username, recipient }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef();

  // 1️⃣ Socket lifecycle & registration
  useEffect(() => {
    console.log('[ChatRoom] mounting for user', username, 'with recipient', recipient);

    socket.on('connect', () => {
      console.log('[socket] connected with id', socket.id);
      socket.emit('register_user', username);
      console.log('[socket] emitted register_user:', username);
    });

    socket.on('new_message', data => {
      console.log('[socket] new_message received:', data);
      // only append messages from the current recipient
      if (data.sender === recipient) {
        setMessages(prev => [...prev, { sender: data.sender, message: data.message, timestamp: Date.now() }]);
      }
    });

    return () => {
      console.log('[ChatRoom] unmounting, removing listeners');
      socket.off('connect');
      socket.off('new_message');
    };
  }, [username, recipient]);

  // 2️⃣ Load history over HTTP
  const loadMessages = async () => {
    console.log('[ChatRoom] loading history for', username, recipient);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/messages/${username}/${recipient}`,
        { withCredentials: true }
      );
      console.log('[HTTP] fetched history:', res.data);
      setMessages(res.data);
    } catch (err) {
      console.error('[HTTP] failed to load history:', err);
    }
  };

  useEffect(() => {
    if (username && recipient) loadMessages();
  }, [username, recipient]);

  // scroll down when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3️⃣ Sending messages
  const sendMessage = () => {
    if (!text.trim()) return;
    const payload = { sender: username, receiver: recipient, message: text };
    console.log('[socket] emitting send_message with', payload);
    socket.emit('send_message', payload);
    setMessages(prev => [...prev, { sender: username, message: text, timestamp: Date.now() }]);
    setText('');
  };

  return (
    <div className="border rounded p-4 flex flex-col h-96">
      <h3 className="font-semibold mb-2">Chat with {recipient}</h3>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.sender === username ? 'text-right' : 'text-left'}`}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-gray-200">
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
