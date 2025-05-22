import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../redux/slice/UserSlice";
import { axiosInstance } from "../api/APIClient";
import { setIsChatOpen } from "../redux/slice/ChatSlice";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgVideo from "lightgallery/plugins/video";
import axios from "axios";

const initialMessages = {
  sender: { id: 0, username: "" },
  receiver: { id: 0, username: "" },
  content: "",
};

export default function ChatBox() {
  const isChatOpen = useSelector(state => state.chat.isChatOpen);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const user = JSON.parse(localStorage.getItem('userInfo') === 'undefined' ? null : localStorage.getItem('userInfo'));
  const [messageSend, setMessageSend] = useState(false);
  const imageInputRef = useRef(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  useEffect(() => {

    const getMessages = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/chat/api/v1/messages/${user.id}`);
        if (response.data === undefined || response.data === null || response.data === '') {
          setMessageList([]);
          return;
        }
        setMessageList(response.data.messages);
      } catch (error) {
        console.error("Lỗi lấy tin nhắn:", error);
        setMessageList([]);
      }
    };
    getMessages();
  }, [messageSend, user?.id]);


  useEffect(() => {
    const socket = new SockJS(`${process.env.REACT_APP_API_URL}/chat/api/v1/chat/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ WebSocket connected!");
        client.subscribe("/topic/messages", (message) => {
          const newMessage = JSON.parse(message.body);
          if (newMessage.receiverId === user.id || newMessage.senderId === user.id) {
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/chat/api/v1/s3/upload-image`, formData, {
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

  return (
    <>
      {user && (
        <div className="my-4 mr-10 z-50">
          {/* Chat Button */}
          {!isChatOpen && (
            <button
              onClick={() => dispatch(setIsChatOpen(true))}
              className="bg-blue-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Open chat"
            >
              <FontAwesomeIcon icon={faComments} size="lg" />
            </button>
          )}

          {/* Chat Box */}
          {isChatOpen && (
            <div
              className="w-[90vw] sm:w-[450px] lg:w-[770px] h-[80vh] sm:h-[500px] lg:h-[700px] bg-white shadow-xl rounded-lg fixed bottom-16 right-4 sm:right-6 lg:right-20 z-50 flex flex-col animate-slideIn"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Chat với Dược Sĩ</h2>
                <button
                  onClick={() => dispatch(setIsChatOpen(false))}
                  className="text-red-500 hover:text-red-600 text-lg sm:text-xl font-bold focus:outline-none"
                  aria-label="Close chat"
                >
                  ×
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2">
                {messageList.map((msg, index) => {
                  const currentMessageTime = new Date(msg.timestamp);
                  const nextMessage = index < messageList.length - 1 ? messageList[index + 1] : null;
                  const nextMessageTime = nextMessage ? new Date(nextMessage.timestamp) : null;
                  const nextMessageSenderId = nextMessage ? nextMessage.senderId : null;

                  const isLastMessageInMinute = !(
                    nextMessageSenderId === msg.senderId &&
                    nextMessageTime &&
                    currentMessageTime.getMinutes() === nextMessageTime.getMinutes() &&
                    currentMessageTime.getHours() === nextMessageTime.getHours()
                  );

                  return (
                    <div
                      key={index}
                      className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"
                        } mb-2 animate-fadeInMessage`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] lg:max-w-[500px] px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${msg.imageUrl
                            ? "bg-transparent"
                            : msg.senderId === user.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                      >
                        {msg.content && <p>{msg.content}</p>}
                        {msg.imageUrl && (
                          <LightGallery plugins={[lgZoom, lgThumbnail, lgVideo]} mode="lg-fade">
                            {(() => {
                              const isVideo = /\.(mp4|mov|avi)$/i.test(msg.imageUrl);
                              const mediaClass = "max-w-full max-h-64 sm:max-h-80 lg:max-h-96 object-cover rounded-lg";

                              return isVideo ? (
                                <a href={msg.imageUrl} data-lg-size="1280-720">
                                  <video src={msg.imageUrl} controls className={mediaClass} />
                                </a>
                              ) : (
                                <a href={msg.imageUrl}>
                                  <img src={msg.imageUrl} alt="Chat media" className={mediaClass} />
                                </a>
                              );
                            })()}
                          </LightGallery>
                        )}
                        {isLastMessageInMinute && (
                          <span
                            className={`block text-xs mt-1 ${msg.imageUrl
                                ? "text-gray-500"
                                : msg.senderId === user.id
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                          >
                            {currentMessageTime.toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div className="flex items-center p-2 sm:p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => imageInputRef.current.click()}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  title="Upload image or video"
                  aria-label="Upload image or video"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="text-gray-600"
                  >
                    <path
                      d="M3.15789 0H16.8421C17.6796 0 18.4829 0.332706 19.0751 0.924926C19.6673 1.51715 20 2.32037 20 3.15789V16.8421C20 17.6796 19.6673 18.4829 19.0751 19.0751C18.4829 19.6673 17.6796 20 16.8421 20H3.15789C2.32037 20 1.51715 19.6673 0.924926 19.0751C0.332706 18.4829 0 17.6796 0 16.8421V3.15789C0 2.32037 0.332706 1.51715 0.924926 0.924926C1.51715 0.332706 2.32037 0 3.15789 0ZM3.15789 1.05263C2.59954 1.05263 2.06406 1.27444 1.66925 1.66925C1.27444 2.06406 1.05263 2.59954 1.05263 3.15789V15.3579L5.56842 10.8316L8.2 13.4632L13.4632 8.2L18.9474 13.6842V3.15789C18.9474 2.59954 18.7256 2.06406 18.3308 1.66925C17.9359 1.27444 17.4005 1.05263 16.8421 1.05263H3.15789ZM8.2 14.9579L5.56842 12.3263L1.05263 16.8421C1.05263 17.4005 1.27444 17.9359 1.66925 18.3308C2.06406 18.7256 2.59954 18.9474 3.15789 18.9474H16.8421C17.4005 18.9474 17.9359 18.7256 18.3308 18.3308C18.7256 17.9359 18.9474 17.4005 18.9474 16.8421V15.1684L13.4632 9.69474L8.2 14.9579ZM5.78947 3.15789C6.48741 3.15789 7.15676 3.43515 7.65028 3.92867C8.1438 4.42218 8.42105 5.09154 8.42105 5.78947C8.42105 6.48741 8.1438 7.15676 7.65028 7.65028C7.15676 8.1438 6.48741 8.42105 5.78947 8.42105C5.09154 8.42105 4.42218 8.1438 3.92867 7.65028C3.43515 7.15676 3.15789 6.48741 3.15789 5.78947C3.15789 5.09154 3.43515 4.42218 3.92867 3.92867C4.42218 3.43515 5.09154 3.15789 5.78947 3.15789ZM5.78947 4.21053C5.37071 4.21053 4.9691 4.37688 4.67299 4.67299C4.37688 4.9691 4.21053 5.37071 4.21053 5.78947C4.21053 6.20824 4.37688 6.60985 4.67299 6.90596C4.9691 7.20207 5.37071 7.36842 5.78947 7.36842C6.20824 7.36842 6.60985 7.20207 6.90596 6.90596C7.20207 6.60985 7.36842 6.20824 7.36842 5.78947C7.36842 5.37071 7.20207 4.9691 6.90596 4.67299C6.60985 4.37688 6.20824 4.21053 5.78947 4.21053Z"
                      fill="currentColor"
                    />
                  </svg>
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/png,image/jpeg,image/gif,video/mp4"
                    onChange={handleImageUpload}
                    hidden
                  />
                </button>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 p-2 sm:p-3 mx-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="p-2 sm:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Send message"
                >
                  <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tailwind Animation Keyframes */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes fadeInMessage {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInMessage {
          animation: fadeInMessage 0.2s ease-out;
        }
      `}</style>
    </>
  );
}