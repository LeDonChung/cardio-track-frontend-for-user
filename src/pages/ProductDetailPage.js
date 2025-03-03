import React, { useState, useReducer, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/AppUtils";
import Slider from "react-slick";
import { faPlus, faMinus, faCircleQuestion, faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProductById } from "../redux/slice/ProductSlice";

const productModel = {
    "id": 41,
    "des": "<h3>Mẹ an lành với thai kỳ khỏe mạnh</h3><p>Prenatal One là sản phẩm giúp bổ sung DHA, vitamin và khoáng chất thiết yếu, hỗ trợ tăng cường sức khỏe cho phụ nữ mang thai và sau khi sinh. Prenatal One sản xuất bởi thương hiệu <a href=\"https://nhathuoclongchau.com.vn/thuong-hieu/vitamins-for-life\">Vitamins For Life</a> đến từ Hoa Kỳ.</p><figure class=\"image\"><img src=\"https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/prenatal_one_60v_37593_5d02c0df4e.png\" alt=\"prenatal-one-60v-37593.png\"></figure><p>Góp phần cho một thai kỳ khỏe mạnh không thể thiếu một chế độ dinh dưỡng đầy đủ, đa dạng các chất. Đây là nền tảng cho thai nhi có thể hoàn thiện các bộ phận, chức năng cơ thể; đồng thời giúp người mẹ luôn khỏe mạnh và giảm các triệu chứng khó chịu trong hơn 9 tháng mang thai. Mẹ ăn uống đa dạng cùng việc bổ sung dinh dưỡng từ Prenatal One mỗi ngày giúp mẹ khỏe và trải qua một thai kỳ nhẹ nhàng.</p><p>Prenatal One là sản phẩm bổ sung dinh dưỡng cho tất cả các giai đoạn của thai kỳ. Với thành phần DHA cùng các <a href=\"https://nhathuoclongchau.com.vn/thuc-pham-chuc-nang/vitamin-khoang-chat\">vitamin và khoáng chất</a> thiết yếu khai thác chủ yếu từ tự nhiên, Prenatal One hỗ trợ tăng cường sức khỏe và sự phát triển toàn diện của cả mẹ và bé. Sản phẩm không chứa men, thuốc trừ sâu, hóa chất tổng hợp cũng như các chất gây dị ứng và độc tố khác.</p><p>Viên uống cũng được nghiên cứu phù hợp với nhu cầu dinh dưỡng của người mẹ khi mang thai và sau khi sinh, giúp tăng cường miễn dịch bảo vệ mẹ trước các tác động tiêu cực, tạo thêm năng lượng và cân bằng dinh dưỡng để cơ thể có đủ dưỡng chất nuôi dưỡng cả mẹ và bé yêu trong bụng, đồng thời có thể tiết sữa tốt sau sinh.</p><p>Đối với phụ nữ sinh thường bị mất nhiều sức lực, cơ thể mệt mỏi, Prenatal One còn là trợ thủ giúp mẹ bổ sung đủ chất để hỗ trợ cho quá trình phục hồi sau quá trình sinh nở và cho việc cho con bú.</p><p>Prenatal One được sản xuất bởi thương hiệu Vitamins For Life đến từ Mỹ. Đây là công ty chuyên sản xuất các dòng sản phẩm chăm sóc sức khỏe nổi tiếng với cam kết đem đến sản phẩm trong lành, tinh khiết nhất từ nguồn nguyên liệu sạch, an toàn và không để lại bất kỳ tác dụng phụ không mong muốn nào cho người tiêu dùng.</p><ul><li>Sản phẩm sản xuất tại Hoa Kỳ theo tiêu chuẩn chất lượng của ngành công nghiệp dược phẩm.</li><li>Sản phẩm luôn đảm bảo tất cả các chế độ kiểm tra mức an toàn, thực phẩm sạch, vượt qua sự kiểm định khắt khe của Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA hoặc USFDA) trước khi ra thị trường.</li><li>Sản phẩm được cấp giấy chứng nhận Lưu hành tại Mỹ bởi Bộ Y tế Hoa Kỳ.</li><li>Nhà sản xuất luôn tuân thủ các bước theo Tiêu chuẩn Thực hành tốt sản xuất (GMP).</li></ul>",
    "desShort": "<p>Prenatal One cung cấp DHA, vitamin và khoáng chất thiết yếu, giúp cân bằng dinh dưỡng cho phụ nữ đang mang thai và sau khi sinh.</p>",
    "discount": 53,
    "init": "Hộp",
    "name": "Thực phẩm bảo vệ sức khỏe Prenatal One Vitamins For Life cung cấp DHA, vitamin và khoáng chất ",
    "price": 660000.0,
    "primaryImage": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00115_72e83dcffe.jpg",
    "sku": "00503294",
    "status": 1,
    "brand": {
        "id": 29,
        "image": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/Stella_Pharm_252x252_66deef2f18.png",
        "title": "Stella Pharm"
    },
    "categories": [
        {
            "id": 3,
            "fullPathSlug": "/thuc-pham-chuc-nang/canxi-vitamin-D",
            "icon": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/bo_sung_canxi_vitamin_d_level_3_1cac767906.png",
            "level": 3,
            "title": "Bổ sung Canxi & Vitamin D",
            "parentId": 2,
            "children": []
        }
    ],
    "specifications": [
        {
            "id": 6,
            "title": "Hộp 60 Viên"
        }
    ],
    "images": [
        {
            "id": 303,
            "url": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00107_8d2f87320f.jpg"
        },
        {
            "id": 302,
            "url": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00105_fbafb6e554.jpg"
        },
        {
            "id": 305,
            "url": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00109_be283dabc3.jpg"
        },
        {
            "id": 307,
            "url": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00119_e851702b44.jpg"
        },
        {
            "id": 306,
            "url": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00110_5e0c49bc10.jpg"
        },
        {
            "id": 304,
            "url": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00108_6ffe2e70da.jpg"
        },
        {
            "id": 308,
            "url": "https://cdn.nhathuoclongchau.com.vn/unsafe/https://cms-prod.s3-sgn09.fptcloud.com/DSC_00123_8078660030.jpg"
        }
    ],
    "tags": [
        {
            "id": 3,
            "title": "Phụ nữ có thai",
            "des": "Phụ nữ có thai"
        }
    ]
};

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



    // setting for slick slider
    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    const initital = async () => {
        await dispatch(getProductById(id));
    }
    useEffect(() => {
        initital()
    }, []);
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
                                <button className="w-[220px] h-[60px] items-center flex justify-center rounded-[30px] text-white bg-blue-600">
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
                <Footer />
            </div>
        )

    )
};