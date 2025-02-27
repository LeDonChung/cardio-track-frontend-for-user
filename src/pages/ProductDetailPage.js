import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/AppUtils";

export const ProductDetailPage = () => {
    return (
        <div className="bg-white text-gray-900">
            <Header />
            <div>
                
            </div>
            <Footer />
        </div>
    )
};