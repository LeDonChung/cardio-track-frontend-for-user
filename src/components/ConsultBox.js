import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../api/APIClient";

export default function ConsultBox() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const sendMessage = async () => {
        if (message) {
            setMessageList([...messageList, { role: "user", content: message }]);
            setMessage("");

            try {
                await axiosInstance.post(`/api/v1/consult/${user.id}`, { message: message }).then((res) => {
                    setMessageList([...messageList, res.data]);
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if (user) {
            axiosInstance.get(`/api/v1/consult/${user.id}`).then((res) => {
                setMessageList(res.data);
            })
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
                        <div className="w-[400px] h-[600px] bg-white shadow-lg rounded-lg p-4 border fixed bottom-16 right-4 z-50 flex flex-col">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h2 className="text-lg font-semibold">TC AI</h2>
                                <button onClick={() => setIsChatOpen(false)} className="text-red-500">X</button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2">
                                {messageList && messageList.map((msg, index) => (
                                    <div key={index} className={`flex ${(msg.role === 'user') ? "justify-end" : "justify-start"} my-2`}>
                                        <div className={`${(msg.receiverId === user.id) ? "bg-gray-300" : "bg-blue-600 text-white"} px-4 py-2 rounded-lg max-w-xs`}>
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
                                />
                                <button className="px-4 py-2 rounded-lg shadow-lg ml-2">
                                    <FontAwesomeIcon icon={faPaperPlane} color="#2261E2" size="20" onClick={sendMessage} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
