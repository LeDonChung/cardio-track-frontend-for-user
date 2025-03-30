import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {fetchAllHealthTests, submitUserAnswers, createHealthCheck, fetchHealthTestById } from "../redux/slice/HealthCheckSlice";
import { HealthCheckDetail } from "./HealthCheckDetail"; 

export const HealthCheck = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { healthTests, errorResponse } = useSelector((state) => state.healthcheck);

  useEffect(() => {
    dispatch(fetchAllHealthTests());
  }, [dispatch]);

  return (
    <div className="bg-[#EDF0F3] min-h-screen">
      <Header />
      <div className="container mx-auto py-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 rounded-xl text-white mb-8">
          <h2 className="text-2xl font-bold mb-1">Kiểm tra sức khỏe</h2>
          <p>Kết quả đánh giá sẽ cho bạn lời khuyên xử trí phù hợp!</p>
        </div>

        {errorResponse && (
          <p className="text-red-500 text-center mb-4">{errorResponse}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {healthTests.map((test) => (
            <div
              key={test.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300"
            >
              <img
                src="https://cdn.nhathuoclongchau.com.vn/unsafe/96x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/ic_tien_dai_thao_duong_688b8d7cde.png"
                alt={test.testName}
                className="w-14 h-14 mb-3"
              />
              <h3 className="text-lg font-semibold">{test.testName}</h3>
              <p className="text-gray-600 text-sm mb-3">{test.description}</p>
              <button
                onClick={() => navigate(`/health-check/${test.id}`)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Bắt đầu
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
