import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../redux/slice/CategorySlice";
import { useEffect } from "react";

export const HomePage = () => {
    return (
        <div className="bg-white text-gray-900">
            <Header />
            {/* Main Content */}
            
            <Footer />
        </div>

    )
}