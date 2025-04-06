import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from "../redux/slice/UserSlice";
import { axiosInstance } from "../api/APIClient";
import { setIsChatOpen } from "../redux/slice/ChatSlice";
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from "lightgallery/plugins/video";
import axios from "axios";

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
    const isChatOpen = useSelector(state => state.chat.isChatOpen);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const [messageSend, setMessageSend] = useState(false);
    const imageInputRef = useRef(null);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    useEffect(() => {

        const getMessages = async () => {
            try {
                const response = await axiosInstance.get(`http://localhost:9097/api/v1/messages/${user.id}`);
                setMessageList(response.data.messages);
            } catch (error) {
                console.error("Lỗi lấy tin nhắn:", error);
                setMessageList([]);
            }
        };
        getMessages();
    }, [messageSend, user?.id]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:9097/api/v1/chat/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,

            onConnect: () => {
                console.log("✅ WebSocket connected!");
                client.subscribe("/topic/messages", (message) => {
                    const newMessage = JSON.parse(message.body);
                    if (newMessage.receiverId === user.id) {
                        setMessageList(prev => [...(Array.isArray(prev) ? prev : []), newMessage]);
                    }

                });


                const message = {
                    "sender": {
                        "id": user.id,
                        "username": user.fullName
                    },
                };

                // thông báo đến server rằng người dùng đã kết nối
                client.publish({
                    destination: "/app/user-connected", // Địa chỉ gửi khi người dùng kết nối
                    body: JSON.stringify(message) // Gửi senderId thay vì sender
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'video/mp4'];
        if (!allowedTypes.includes(file.type)) {
            alert('Chỉ chấp nhận file ảnh (PNG, JPEG, GIF, MP4)');
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:9097/api/v1/s3/upload-image", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const image = response.data;
            const newMessage = {
                sender: {
                    id: user.id,
                    username: user.fullName
                },
                receiver: {
                    id: 0,
                },
                imageUrl: image,
                timestamp: new Date().toISOString()
            };

            if (!stompClient || !stompClient.connected) {
                console.error("🚨 Không thể gửi tin nhắn! WebSocket chưa kết nối.");
                return;
            }

            stompClient.publish({
                destination: "/app/chat",
                body: JSON.stringify(newMessage)
            });


            // ✅ Thêm luôn tin nhắn vào messageList để hiển thị ngay (instant update)
            setMessageList(prev => [...(Array.isArray(prev) ? prev : []), newMessage]);
            setMessageSend(!messageSend);

        } catch (error) {
            console.error("❌ Upload failed:", error);
            alert("Lỗi upload");
        }
    }

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

        console.log("🚀 Gửi tin nhắn:", newMessage);


        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(newMessage)
        });


        // ✅ Thêm luôn tin nhắn vào messageList để hiển thị ngay (instant update)
        setMessageList(prev => [...(Array.isArray(prev) ? prev : []), newMessage]);
        setMessageSend(!messageSend);
        setMessage("");
    };

    const dispatch = useDispatch();

    return <>
        {user &&
            (
                <div className="fixed bottom-4 right-4 z-50">
                    {/* Nút mở chat */}
                    {!isChatOpen && (
                        <button
                            onClick={() => dispatch(setIsChatOpen(true))}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
                        >
                            <FontAwesomeIcon icon={faComments} color="white" size="30" />
                        </button>
                    )}

                    {/* Cửa sổ chat */}
                    {isChatOpen && (
                        <div className="w-[550px] h-[700px] bg-white shadow-lg rounded-lg p-4 border fixed bottom-16 right-4 z-50 flex flex-col">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b pb-2">
                                <h2 className="text-lg font-semibold">Chat với Dược Sĩ</h2>
                                <button onClick={() => dispatch(setIsChatOpen(false))} className="text-red-500">X</button>
                            </div>

                            {/* Nội dung chat */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {messageList.map((msg, index) => {
                                    const currentMessageTime = new Date(msg.timestamp);
                                    const nextMessage = index < messageList.length - 1 ? messageList[index + 1] : null;
                                    const nextMessageTime = nextMessage ? new Date(nextMessage.timestamp) : null;
                                    const nextMessageSenderId = nextMessage ? nextMessage.senderId : null;

                                    // Check if the next message is from the same sender and within the same minute
                                    const isLastMessageInMinute = !(nextMessageSenderId === msg.senderId &&
                                        nextMessageTime &&
                                        currentMessageTime.getMinutes() === nextMessageTime.getMinutes() &&
                                        currentMessageTime.getHours() === nextMessageTime.getHours());

                                    return (
                                        <div key={index} className={`flex ${(msg.receiverId === user.id) ? "justify-start" : "justify-end"}`}>
                                            <div className={`${(msg.imageUrl ? "bg-none" : (msg.receiverId === user.id) ? "bg-gray-300" : "bg-blue-600 text-white")} px-4 py-2 rounded-lg max-w-xs mb-2`}>
                                                {msg.content && <p>{msg.content}</p>}
                                                {msg.imageUrl && (
                                                    <LightGallery plugins={[lgZoom, lgThumbnail, lgVideo]} mode="lg-fade">
                                                        {(() => {
                                                            const isVideo = msg.imageUrl.includes('.mp4') || msg.imageUrl.includes('.mov') || msg.imageUrl.includes('.avi');
                                                            const mediaClass = 'max-w-full max-h-96 cursor-pointer object-cover rounded-lg';

                                                            return (
                                                                !isVideo ? (
                                                                    <a href={msg.imageUrl}>
                                                                        <img src={msg.imageUrl} alt="Hình ảnh" className={mediaClass} />
                                                                    </a>
                                                                ) : (
                                                                    <a href={msg.imageUrl} data-lg-size="1280-720">
                                                                        <video src={msg.imageUrl} controls className={mediaClass} />
                                                                    </a>
                                                                )
                                                            );
                                                        })()}
                                                    </LightGallery>
                                                )}

                                                {isLastMessageInMinute && (
                                                    <span className={`text-xs ${msg.imageUrl ? "text-gray-500" : (msg.receiverId === user.id) ? "text-gray-500" : "text-white"}`}>
                                                        {currentMessageTime.toLocaleString("en-US", {
                                                            year: "numeric",
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>

                            {/* Ô nhập tin nhắn + Button gửi */}
                            <div className="flex items-center border-t pt-2 ">
                                <button
                                    onClick={() => imageInputRef.current.click()}
                                    title="Chọn ảnh"
                                    type="button" className="p-2 rounded-full  hover:bg-gray-300">
                                    <svg className='mx-auto' width="30" height="30" viewBox="-5 -2 30 25" xmlns="http://www.w3.org/2000/svg" fill="none">
                                        <path d="M3.15789 0H16.8421C17.6796 0 18.4829 0.332706 19.0751 0.924926C19.6673 1.51715 20 2.32037 20 3.15789V16.8421C20 17.6796 19.6673 18.4829 19.0751 19.0751C18.4829 19.6673 17.6796 20 16.8421 20H3.15789C2.32037 20 1.51715 19.6673 0.924926 19.0751C0.332706 18.4829 0 17.6796 0 16.8421V3.15789C0 2.32037 0.332706 1.51715 0.924926 0.924926C1.51715 0.332706 2.32037 0 3.15789 0ZM3.15789 1.05263C2.59954 1.05263 2.06406 1.27444 1.66925 1.66925C1.27444 2.06406 1.05263 2.59954 1.05263 3.15789V15.3579L5.56842 10.8316L8.2 13.4632L13.4632 8.2L18.9474 13.6842V3.15789C18.9474 2.59954 18.7256 2.06406 18.3308 1.66925C17.9359 1.27444 17.4005 1.05263 16.8421 1.05263H3.15789ZM8.2 14.9579L5.56842 12.3263L1.05263 16.8421C1.05263 17.4005 1.27444 17.9359 1.66925 18.3308C2.06406 18.7256 2.59954 18.9474 3.15789 18.9474H16.8421C17.4005 18.9474 17.9359 18.7256 18.3308 18.3308C18.7256 17.9359 18.9474 17.4005 18.9474 16.8421V15.1684L13.4632 9.69474L8.2 14.9579ZM5.78947 3.15789C6.48741 3.15789 7.15676 3.43515 7.65028 3.92867C8.1438 4.42218 8.42105 5.09154 8.42105 5.78947C8.42105 6.48741 8.1438 7.15676 7.65028 7.65028C7.15676 8.1438 6.48741 8.42105 5.78947 8.42105C5.09154 8.42105 4.42218 8.1438 3.92867 7.65028C3.43515 7.15676 3.15789 6.48741 3.15789 5.78947C3.15789 5.09154 3.43515 4.42218 3.92867 3.92867C4.42218 3.43515 5.09154 3.15789 5.78947 3.15789ZM5.78947 4.21053C5.37071 4.21053 4.9691 4.37688 4.67299 4.67299C4.37688 4.9691 4.21053 5.37071 4.21053 5.78947C4.21053 6.20824 4.37688 6.60985 4.67299 6.90596C4.9691 7.20207 5.37071 7.36842 5.78947 7.36842C6.20824 7.36842 6.60985 7.20207 6.90596 6.90596C7.20207 6.60985 7.36842 6.20824 7.36842 5.78947C7.36842 5.37071 7.20207 4.9691 6.90596 4.67299C6.60985 4.37688 6.20824 4.21053 5.78947 4.21053Z" fill="black" />
                                    </svg>
                                    <input
                                        type="file"
                                        ref={imageInputRef}
                                        accept="image/png, image/jpeg, image/gif, video/mp4"
                                        onChange={handleImageUpload}
                                        hidden
                                    />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-0"
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
            )
        }
    </>
}