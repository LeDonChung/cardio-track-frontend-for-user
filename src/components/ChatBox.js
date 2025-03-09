import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from "../redux/slice/UserSlice";
import { axiosInstance } from "../api/APIClient";

const initialMessages = {
    "sender": {
        "id": 0,
        "username": ""
    },
    "receiver": {
        "id": 0,
        "username": ""
    },
    "content": "",
}

export default function ChatBox() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const [messageSend, setMessageSend] = useState(false);

    console.log(messageList)
    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:9095/api/messages/${user.id}`);
                setMessageList(response.data.messages);
            } catch (error) {
                console.error("Lỗi lấy tin nhắn:", error);
            }
        };
        getMessages();
    }, [messageSend]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:9095/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,

            onConnect: () => {
                console.log("✅ WebSocket connected!");
                client.subscribe("/topic/messages", (message) => {
                    
                    setMessageList(prev => [...prev, JSON.parse(message.body)]);
                });
                setStompClient(client);  // Cập nhật trạng thái client sau khi kết nối
            },

            onStompError: (frame) => {
                console.error("❌ STOMP Error:", frame.headers['message']);
            },

            onWebSocketError: (error) => {
                console.error("🚨 WebSocket Error:", error);
            },

            onDisconnect: () => {
                console.log("🔴 WebSocket disconnected!");
            }
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);


    const sendMessage = () => {
        if (!message.trim() || !stompClient || !stompClient.connected) {
            console.error("🚨 Không thể gửi tin nhắn! WebSocket chưa kết nối.");
            return;
        }

        const newMessage = {
            sender: {
                id: user.id,
                username: user.fullName
            },
            receiver: {
                id: 0,
            },
            content: message
        };

        console.log("📤 Gửi tin nhắn:", newMessage);

        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(newMessage)
        });


        setMessageSend(!messageSend);
        setMessage("");
    };


    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Nút mở chat */}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
                >
                    <FontAwesomeIcon icon={faComments} color="white" size="30" />
                </button>
            )}

            {/* Cửa sổ chat */}
            {isChatOpen && (
                <div className="w-[400px] h-[600px] bg-white shadow-lg rounded-lg p-4 border fixed bottom-16 right-4 z-50 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold">Chat với Dược Sĩ</h2>
                        <button onClick={() => setIsChatOpen(false)} className="text-red-500">X</button>
                    </div>

                    {/* Nội dung chat */}
                    <div className="flex-1 overflow-y-auto p-2">
                        {messageList.map((msg, index) => (
                            <div key={index} className={`flex ${(msg.receiverId === user.id) ? "justify-start" : "justify-end"} my-2`}>
                                <div className={`${(msg.receiverId === user.id) ? "bg-gray-300" : "bg-blue-600 text-white"} px-4 py-2 rounded-lg max-w-xs`}>
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ô nhập tin nhắn + Button gửi */}
                    <div className="flex items-center border-t pt-2">
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 p-2 border rounded-lg"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="px-4 py-2 rounded-lg shadow-lg ml-2" onClick={sendMessage}>
                            <FontAwesomeIcon icon={faPaperPlane} color="#2261E2" size="20" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
