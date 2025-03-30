import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { fetchAllHealthTests,submitUserAnswers  } from "../redux/slice/HealthCheckSlice";
import { useNavigate } from "react-router-dom";


export const HealthCheckDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { healthTests, errorResponse } = useSelector((state) => state.healthcheck);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 là intro
  const [answers, setAnswers] = useState({});

  //kết quả chatgpt trả về
  // Thêm vào state
const [showResult, setShowResult] = useState(false);
const [resultContent, setResultContent] = useState("");


  const test = healthTests.find((t) => t.id === parseInt(id));

  useEffect(() => {
    if (!test) {
      dispatch(fetchAllHealthTests());
    }
  }, [dispatch, test]);

  if (!test) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#EDF0F3]">
        <p className="text-gray-500 text-lg">Đang tải bài kiểm tra...</p>
        {errorResponse && <p className="text-red-500 mt-2">{errorResponse}</p>}
      </div>
    );
  }

  const handleSelect = (questionId, choice) => {
    setAnswers({ ...answers, [questionId]: choice });
  };


  //phần load kết qảu chatgpt
  const handleNext = async () => {
    if (currentQuestionIndex + 1 < test.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const userId = JSON.parse(localStorage.getItem("userInfo"))?.id || 1;
      const answerPayload = Object.entries(answers).map(([questionId, answer]) => ({
        userId,
        questionId: parseInt(questionId),
        answer,
      }));
  
      try {
        // Bắt đầu hiển thị loading (nếu muốn)
        setResultContent("Đang phân tích kết quả...");
        setShowResult(true);
  
        // Gửi request
        const res = await dispatch(submitUserAnswers(answerPayload)).unwrap();
        const fullContent = res?.choices?.[0]?.message?.content || "";

        const resultMatch = fullContent.match(/\*\*Kết quả:\*\*\s*(.+)/);
        const adviceMatch = fullContent.match(/\*\*Lời khuyên:\*\*\s*(.+)/);

        setResultContent({
        result: resultMatch ? resultMatch[1] : "Không rõ kết quả",
        advice: adviceMatch ? adviceMatch[1] : "",
        });
        setShowResult(true);
      } catch (err) {
        setResultContent("Đã xảy ra lỗi khi gửi dữ liệu.");
        setShowResult(true);
      }
    }
  };
  

  const currentQuestion = test.questions?.[currentQuestionIndex];

  return (
    <div className="bg-[#EDF0F3] min-h-screen">
      <Header />
      <div className="container mx-auto py-10 px-4 text-center relative">
        {/* Breadcrumb */}
        <div className="text-sm text-blue-700 text-left mb-4">
          <a href="/" className="hover:underline font-medium">Trang chủ</a>
          <span className="mx-1">/</span>
          <span className="text-black font-medium">{test.testName}</span>
        </div>

        {/* INTRO */}
        {currentQuestionIndex === -1 && (
          <>
            <img
              src="https://nhathuoclongchau.com.vn/static/images/survey/docter.png"
              alt="icon"
              className="w-[150px] h-[150px] mx-auto mb-4"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4">
              {test.testName} của Quý khách
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">{test.description}</p>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Kiểm tra ngay
            </button>
          </>
        )}

        {/* CÂU HỎI */}
        {currentQuestionIndex >= 0 && currentQuestion && !showResult && (
        <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">
            <p className="text-gray-600 mb-2">Câu {currentQuestionIndex + 1}/{test.questions.length}</p>
            <h3 className="font-semibold text-lg mb-4">{currentQuestion.questionTitle}</h3>
            <div className="space-y-4 text-left">
            {currentQuestion.choices.map((choice, idx) => (
                <label
                key={idx}
                className={`block border px-4 py-2 rounded-lg cursor-pointer transition ${
                    answers[currentQuestion.id] === choice ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"
                }`}
                >
                <input
                    type="radio"
                    name={`q-${currentQuestion.id}`}
                    className="mr-2"
                    checked={answers[currentQuestion.id] === choice}
                    onChange={() => handleSelect(currentQuestion.id, choice)}
                />
                {choice}
                </label>
            ))}
            </div>

            {/* Nút tiếp */}
            <div className="mt-6 text-center">
            <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
                {currentQuestionIndex + 1 < test.questions.length ? "Tiếp tục" : "Gửi kết quả"}
            </button>
            </div>
        </div>
        )}

            {/* KẾT QUẢ */}
        {showResult && (
        <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded-lg shadow text-left">
            <h3 className="text-lg font-bold mb-3">
            Kết quả: <span className="text-green-600 uppercase">{resultContent.result}</span>
            </h3>
            <p className="text-gray-800 mb-4">{resultContent.advice}</p>
            <div className="flex justify-center">
            <img
                src="https://nhathuoclongchau.com.vn/static/images/survey/diabetes-low.png"
                alt="minh họa"
                className="w-[140px] h-[140px]"
            />
            </div>

             {/* Nút quay lại */}
            <div className="text-center mt-6">
            <button
                onClick={() => navigate("/health-check")}
                className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600 transition"
            >
                Quay lại
            </button>
            </div>


            {/* Miễn trừ trách nhiệm */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-blue-600 font-semibold mb-2">⚠️ Miễn trừ trách nhiệm</h4>
            <p className="text-sm text-gray-700">
                *Thông tin này chỉ có tính tham khảo, không dùng thay thế ý kiến tham vấn của chuyên viên Y tế. 
                Bệnh nhân phải được bác sĩ thăm khám, chẩn đoán và điều trị y tế chuyên môn.
            </p>
            <p className="text-sm text-gray-600 mt-2 font-medium">Nguồn thông tin:</p>
            <ul className="text-sm text-gray-700 list-disc pl-5">
                <li>International Diabetes Federation. IDF Diabetes Atlas 9th edition. 2019</li>
                <li>Tabak AG et al. Lancet. 2012;379(9833): 2279-90</li>
                <li>Hội Nội tiết và Đái tháo đường Việt Nam</li>
            </ul>
            </div>
        </div>
        )}


        {errorResponse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/2">
                <p className="text-red-500 text-lg">HỆ THỐNG HIỆN ĐANG QUÁ TẢI... QUÝ KHÁCH VUI LÒNG TRỞ LẠI SAU GIÂY LÁT!</p>
            </div>
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

  