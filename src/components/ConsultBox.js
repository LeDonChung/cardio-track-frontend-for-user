import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane, faCheck } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../api/APIClient";

export default function ConsultBox() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('userInfo') === 'undefined' ? null : localStorage.getItem('userInfo'));

    const sendMessage = async () => {
        if (message) {
            // Thêm tin nhắn của người dùng vào danh sách
            const userMessage = { role: "user", content: message, isReplied: false };
            setMessageList([...messageList, userMessage]);
            setMessage("");
            setIsLoading(true);

            // Thêm tin nhắn tạm thời "..." để biểu thị đang chờ
            setMessageList((prev) => [
                ...prev,
                { role: "assistant", content: "...", isReplied: false, isLoading: true },
            ]);

            try {
                const res = await axiosInstance.post(`/api/v1/consult/${user.id}`, { message });
                // Xóa tin nhắn "..." và thêm phản hồi của AI
                setMessageList((prev) => {
                    const updatedList = prev.filter((msg) => !msg.isLoading);
                    return [...updatedList, { ...res.data, role: "assistant", isReplied: true }];
                });
            } catch (error) {
                console.log(error);
                // Xóa tin nhắn "..." nếu có lỗi
                setMessageList((prev) => prev.filter((msg) => !msg.isLoading));
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (user) {
            axiosInstance.get(`/api/v1/consult/${user.id}`).then((res) => {
                // Giả sử res.data là danh sách tin nhắn, thêm trạng thái isReplied
                const messagesWithStatus = res.data.map((msg) => ({
                    ...msg,
                    isReplied: msg.role === "assistant" ? true : false,
                }));
                setMessageList(messagesWithStatus);
            });
        }
    }, []);

    return (
        <>
            {user && (
                <div className="fixed bottom-4 right-20 z-50">
                    {/* Nút mở chat */}
                    {!isChatOpen && (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
                        >
                            <img src="./logo/logo_90_90 1.png" className="w-6" />
                        </button>
                    )}

                    {isChatOpen && (
                        <div className="w-[600px] h-[700px] bg-white shadow-lg rounded-lg p-4 border fixed bottom-16 right-4 z-50 flex flex-col">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h2 className="text-lg font-semibold">TC AI</h2>
                                <button onClick={() => setIsChatOpen(false)} className="text-red-500">X</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2">
                                {messageList &&
                                    messageList.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                msg.role === "user" ? "justify-end" : "justify-start"
                                            } my-2`}
                                        >
                                            <div
                                                className={`${
                                                    msg.role === "user"
                                                        ? "bg-gray-300"
                                                        : msg.isLoading
                                                        ? "bg-blue-200 text-gray-600 animate-pulse"
                                                        : "bg-blue-600 text-white"
                                                } px-4 py-2 rounded-lg max-w-[450px] flex items-center`}
                                            >
                                                <p>{msg.content}</p>
                                                
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className="flex items-center border-t pt-2">
                                <input
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 p-2 border rounded-lg"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    className="px-4 py-2 rounded-lg shadow-lg ml-2"
                                    disabled={isLoading}
                                >
                                    <FontAwesomeIcon
                                        icon={faPaperPlane}
                                        color="#2261E2"
                                        size="20"
                                        onClick={sendMessage}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}