import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
// import { useWebSocket } from "../../../hooks/useWebSocket";
import useAxios from '../../../hooks/useAxios';
import { useRef } from 'react';
const EmployeeChat = () => {
    const [messages,setMessages]=useState([]);
    const [message,setMessage]= useState('')
    const chatSocket = useRef(null);
    const { userId} = useSelector(state => state.auth);
    let employeeId = userId
   
    useEffect(()=>{
        //connecting to the webSocket
        chatSocket.current = new WebSocket(
            `ws://127.0.0.1:8000/ws/chatting/2/${userId}/`
        );
        chatSocket.current.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if(data.senderId==userId || data.recipientId==userId){
                setMessages(prevMessages => [...prevMessages, data]);
            }
            
        };
        chatSocket.current.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
    },[employeeId])
    const handleSendMessage = () => {
        chatSocket.current.send(JSON.stringify({
            'message' : message, 
            'senderId':userId,
            'recipientId' : 2
        }));
        setMessage('');
    }
    return (
        <div>
    <h3>comments</h3>
    <textarea width="40px" readOnly value={messages.map(msg => `${userId}:: ${msg.message}`).join('\n')} cols="30" rows="5" />
    <br />
    <div style={{display:`flex`}}>

    <div>
    <input
        type="text"
        id="inputText"     
        placeholder='Enter your text here ...'
        size="15"
        value={message}
        onChange={e => setMessage(e.target.value)}       
        onKeyUp={e => { if (e.key === 'Enter') handleSendMessage(); }}
    />

    <button onClick={handleSendMessage} className="btn btn-success">Send</button>
        </div>
    </div>
    </div>
    );
};
export default EmployeeChat;
