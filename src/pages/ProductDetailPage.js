import React, { useState, useReducer, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/AppUtils";
import Slider from "react-slick";
import { faPlus, faMinus, faCircleQuestion, faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProductById, recommendProduct } from "../redux/slice/ProductSlice";
import { ProductRecommend } from "../components/ProductRecommend";
import { addToCart } from '../redux/slice/CartSlice';



const initialQuantity = { quantity: 1 };

function reducer(state, action) {
    switch (action.type) {
        case "INCREMENT":
            return { quantity: state.quantity < 10 ? state.quantity + 1 : 10 };
        case "DECREMENT":
            return { quantity: state.quantity > 1 ? state.quantity - 1 : 1 };
        default:
            return state;
    }
}

export const ProductDetailPage = () => {
    // const [product, setProduct] = useState(productModel);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [stateQuantity, dispatchQuantity] = useReducer(reducer, initialQuantity);
    // mo rong mo ta san pham
    const [expanded, setExpanded] = useState(false);
    const product = useSelector((state) => state.product.product);

    const recommendProducts = useSelector((state) => state.product.recommendProducts);


    // setting for slick slider
    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    const initital = async () => {
        await dispatch(getProductById(id));
        await dispatch(recommendProduct(id));
    }
    useEffect(() => {
        initital()
    }, []);

    const handleAddToCart = () => {
        const truncatedName = product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name;
        console.log(product);
        console.log(stateQuantity.quantity);
        dispatch(addToCart({ ...product, quantity: stateQuantity.quantity })); // Thêm sản phẩm vào giỏ hàng
        showToast(`${truncatedName} đã được thêm vào giỏ hàng!`, 'success'); // Hiển thị thông báo thành công
    };

    return (

        product != null && (
            <div className="bg-gray-100 text-gray-900">
                <Header />
                <div className="container mx-auto">
                    <div className="w-[1500px] h-[750px] bg-white mt-[40px] rounded-[10px] flex items-center">
                        {/* Hình ảnh sản phẩm (danh danh sách các hình) */}
                        <div className="w-[50%] h-full p-[20px]">
                            <Slider {...settings} className="rounded-lg overflow-hidden">
                                {
                                    product && product.images.map(item => {
                                        return (
                                            <img key={item.id} src={item.url} className="w-full object-contain h-[720px]" />
                                        )
                                    })
                                }
                            </Slider>
                        </div>
                        <div className="w-[50%] h-full p-[20px] mt-5">
                            {/* Tên thương hiệu */}
                            <div className="font-normal text-[20px] flex items-center justify-between w-[50%]">
                                <span>Thương hiệu:</span>
                                <span className="text-blue-600">{product.brand.title}</span>
                            </div>
                            {/* Tên sản phẩm */}
                            <div className="font-bold text-[25px] mt-5">
                                <span>{product.name}</span>
                            </div>
                            <div className="font-normal text-[20px] mt-5 flex items-center h-[15px] mb-[20px]">
                                <span>{product.sku}</span>
                                <button>
                                    <FontAwesomeIcon icon={faCircleQuestion} className="text-gray-400 ml-2" />
                                </button>
                            </div>
                            {/* Giá sản phẩm */}
                            <span className="font-bold text-[30px] text-blue-600">
                                {product.price.toLocaleString()} đ/ <span className="text-[20px]">{product.init}</span>
                            </span>
                            <div className="w-1/3 h-[50px] mt-[15px] items-center flex justify-center border-[3px] border-blue-600 rounded-[30px]">
                                <span className="font-normal text-[20px] text-blue-600">{product.specifications[0].title}</span>
                            </div>
                            {/* Chọn số lượng sản phẩm >=1 và <=10 */}
                            <div className=" w-[50%] mt-[20px] h-[60px] flex items-center justify-between">
                                <span className="text-[25px] font-medium text-gray-400">Chọn số lượng: </span>
                                <div className="mt-[15px] flex items-center">
                                    <button className={`w-[50px] h-[50px] border-[1px] border-gray-300 rounded-s-[30px] border-r-0 ${stateQuantity.quantity === 1 ? "cursor-not-allowed" : ""}`}
                                        disabled={stateQuantity.quantity === 1}
                                        onClick={() => dispatchQuantity({ type: "DECREMENT" })}>
                                        <FontAwesomeIcon icon={faMinus} className="text-[20px]" />
                                    </button>
                                    <span className="w-[50px] h-[50px] text-[20px] flex items-center justify-center border-[1px] border-gray-300">
                                        {stateQuantity.quantity}
                                    </span>
                                    <button className={`w-[50px] h-[50px] border-[1px] border-gray-300 rounded-e-[30px] border-l-0 ${stateQuantity.quantity === 10 ? "cursor-not-allowed" : ""}`}
                                        disabled={stateQuantity.quantity === 10}
                                        onClick={() => dispatchQuantity({ type: "INCREMENT" })}>
                                        <FontAwesomeIcon icon={faPlus} className="text-[20px]" />
                                    </button>
                                </div>
                            </div>
                            <div className="w-[90%] h-[100px] flex items-center justify-around mt-[20px] border-[1px] border-gray-100 rounded-[20px] rounded-b-none px-3">
                                <button>
                                    <img src="../icon/ic-lien-he.png" />
                                </button>
                                <button className="w-[220px] h-[60px] items-center flex justify-center rounded-[30px] text-blue-600 bg-blue-100">
                                    <span className="font-semibold text-[18px]">Tìm nhà thuốc</span>
                                </button>
                                <button className="w-[220px] h-[60px] items-center flex justify-center rounded-[30px] text-white bg-blue-600" onClick={handleAddToCart}>
                                    <span className="font-semibold text-[18px]">Chọn mua</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[40px] bg-white rounded-[10px] w-[1500px] p-[20px]">
                        <div className="font-bold text-[25px] border-b-[1px] border-gray-100">
                            <span className="underline">Mô tả sản phẩm</span>
                        </div>
                        <div className="">
                            <div dangerouslySetInnerHTML={{ __html: product.desShort }}></div>
                        </div>
                        <div className="mt-[20px] w-[100%]">
                            <p className={`text-gray-700 ${expanded ? "" : "line-clamp-3"}`} dangerouslySetInnerHTML={{ __html: product.des }}></p>
                            <button className="text-blue-600 mt-[20px] w-[100%] flex justify-center" onClick={() => setExpanded(!expanded)}>
                                <span>
                                    {expanded ? "Thu gọn" : "Xem thêm"}
                                    <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} className="ml-2" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto">

                    <h2 className="text-[20px] font-semibold mt-7">Sản phẩm liên quan</h2>

                    <div className="w-full my-5">
                        {
                            recommendProducts 
                            && <ProductRecommend data={recommendProducts} />
                        }
                    </div>
                </div>
                <Footer />
            </div>
        )

    )
};