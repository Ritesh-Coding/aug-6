import { useState,useEffect } from "react";
import { useRef } from 'react';
export const useWebSocket = (adminId,userId) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState([]);
    const chatSocket = useRef(null);
    useEffect(() => {
        if (userId) {
            chatSocket.current= new WebSocket(`ws://127.0.0.1:8000/ws/chatting/${adminId}/${userId}/`);
            // setWs(socket);
     
            chatSocket.current.onmessage = (e) => {
                const data = JSON.parse(e.data);
                console.log(data,"dsfdfggfhgf");
                setMessages((prev) => [...prev, data]);
            };

            chatSocket.current.onclose = () => {
                console.error('WebSocket closed unexpectedly');
            };

            return () => chatSocket.current.close();
        }
    }, [userId]);

    const sendMessage = (message) => {
        
            chatSocket.current.send(JSON.stringify(message));
        
    };

    return { sendMessage, messages };
};