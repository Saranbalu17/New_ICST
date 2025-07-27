import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const messages = {
   1: [
    { sender: 'teacher', text: 'Hello, how can I help you today?' },
    { sender: 'student', text: 'I have a question about the assignment.' },
  ],
  2: [
    { sender: 'teacher', text: 'Good morning! What do you need assistance with?' },
    { sender: 'student', text: 'Can you explain the recent lecture?' },
  ],
  3: [
    { sender: 'teacher', text: 'Hi there! What can I do for you?' },
    { sender: 'student', text: 'I need clarification on the project guidelines.' },
  ],
};

const Chat = () => {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const location = useLocation();
    const {teacherId} =  useParams()
    let { teacherName } = location.state;
    const handleTeacherClick = (id) => {
        setSelectedTeacher(id);
    };
    return (
        <div className="flex h-screen font-nunito">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-semibold mb-4">Teachers</h2>
                <ul>
                    <button
                        onClick={() => handleTeacherClick(teacherId)}
                        className="w-full text-left p-2 hover:bg-gray-700 rounded"
                    >
                        {teacherName}
                    </button>

                </ul>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-gray-100 p-4">
                {selectedTeacher === null ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <p>Select a teacher to start chatting.</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                            {messages[selectedTeacher].map((msg, index) => (
                                <div
                                    key={index}
                                    className={`max-w-xs px-4 py-2 rounded-lg shadow ${msg.sender === 'student'
                                        ? 'bg-blue-500 text-white self-start'
                                        : 'bg-green-500 text-white self-end ml-auto'
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="text"
                                className="flex-1 p-3 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
