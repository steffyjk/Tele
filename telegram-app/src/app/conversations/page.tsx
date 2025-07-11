'use client';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { Color } from 'antd/es/color-picker';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    const session_id = localStorage.getItem('session_id');
    const token = localStorage.getItem('Authorization');

    if (!session_id) {
      message.error('Missing session.');
      return;
    }

    const url = `http://localhost:8000/tele/get-conversations?session_id=${session_id}&is_logged_in=true`;

    fetch(url, {
      headers: {
        Authorization: token || 'null',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log('Conversations:', data);
        setConversations(data.conversations);
      })
      .catch(err => {
        console.error('Error fetching conversations:', err);
        message.error('Failed to load conversations.');
      });
  }, []);

  return (
    <div className="h-screen w-full flex bg-[#f5f6f8]">
      {/* Left Sidebar */}
      <div className="w-[360px] bg-white border-r border-gray-200 overflow-y-auto">
        <div style={{ color: 'black' }} className="text-xl font-bold px-4 py-5 border-b">Telegram</div>

        {conversations.length === 0 ? (
          <p className="p-4 text-gray-400 text-sm">No conversations found.</p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.dialog_id}
              className="flex items-center p-4 hover:bg-[#f2f2f2] cursor-pointer border-b border-gray-100 transition"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mr-3">
                {conv.name?.charAt(0) || 'C'}
              </div>

              {/* Conversation Info */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="text-[15px] font-medium text-gray-900 truncate">{conv.name}</h2>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
                    {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[13px] text-gray-500 truncate">{conv.last_message || 'No messages yet'}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main Content Placeholder */}
      <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">
        👈 Select a conversation to start chatting!
      </div>
    </div>
  );
}
