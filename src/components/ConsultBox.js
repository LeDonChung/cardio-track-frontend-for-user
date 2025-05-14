import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane, faCheck } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../api/APIClient";

export default function ConsultBox() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Safely parse userInfo from localStorage
  const user = (() => {
    try {
      const storedUser = localStorage.getItem("userInfo");
      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })();

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message, isReplied: false };
    setMessageList([...messageList, userMessage]);
    setMessage("");
    setIsLoading(true);

    setMessageList((prev) => [
      ...prev,
      { role: "assistant", content: "...", isReplied: false, isLoading: true },
    ]);

    try {
      const res = await axiosInstance.post(`/api/v1/consult/${user.id}`, { message });
      setMessageList((prev) => {
        const updatedList = prev.filter((msg) => !msg.isLoading);
        return [...updatedList, { ...res.data, role: "assistant", isReplied: true }];
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessageList((prev) => prev.filter((msg) => !msg.isLoading));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      axiosInstance.get(`/api/v1/consult/${user.id}`).then((res) => {
        const messagesWithStatus = res.data.map((msg) => ({
          ...msg,
          isReplied: msg.role === "assistant",
        }));
        setMessageList(messagesWithStatus);
      });
    }
  }, [user]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      {user && (
        <div className="z-50">
          {/* Chat Button */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Open chat"
            >
              <img src="../logo/logo_90_90 1.png" alt="" className="w-6" />
            </button>
          )}

          {/* Chat Box */}
          {isChatOpen && (
            <div
              className="w-[90vw] sm:w-[400px] lg:w-[600px] h-[80vh] sm:h-[500px] lg:h-[700px] bg-white shadow-xl rounded-lg fixed bottom-16 right-4 sm:right-6 lg:right-20 z-50 flex flex-col animate-slideIn"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">TC AI</h2>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-red-500 hover:text-red-600 text-lg sm:text-xl font-bold focus:outline-none"
                  aria-label="Close chat"
                >
                  &times;
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3">
                {messageList.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] lg:max-w-[450px] px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                        msg.role === "user"
                          ? "bg-gray-200 text-gray-800"
                          : msg.isLoading
                          ? "bg-blue-100 text-gray-600 animate-pulse"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex items-center p-2 sm:p-4 border-t border-gray-200 bg-gray-50">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 p-2 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm sm:text-base disabled:bg-gray-100"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  className="ml-2 p-2 sm:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  disabled={isLoading}
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
      `}</style>
    </>
  );
}