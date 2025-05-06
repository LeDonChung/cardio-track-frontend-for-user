import { useEffect, useRef, useState } from "react";
import { faImage, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from "lightgallery/plugins/video";
import { useDispatch, useSelector } from "react-redux";
import { getProductByImage } from "../redux/slice/ProductSlice";
import { ProductPreview } from "./ProductPreview";

export default function SearchByImage() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.products);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const imageInputRef = useRef(null);
    const [imageFile, setImageFile] = useState("");
    const [productList, setProductList] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert('Chỉ chấp nhận file ảnh (PNG, JPEG, JPG)');
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
            setImageFile(image);
            setLoading(false);
            setShowResult(false);
        } catch (error) {
            console.error("❌ Upload failed:", error);
            alert("Lỗi upload");
            setLoading(false);
        }
    }

    const handleSearchByImage = async () => {
        setLoading(true);
        if (imageFile !== "") {
            await dispatch(getProductByImage(imageFile)).then((response) => {
                console.log("Products search by image: ", response.payload.data);
                const resp = response.payload.data;
                setProductList(resp);
                setShowResult(true);
                setLoading(false);
            });
        } else {
            alert("Vui lòng tải lên hình ảnh trước.");
        }
    }

    console.log(productList)
    return (
        <>
            {/* Icon camera để mở modal */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                title="Tìm bằng hình ảnh"
            >
                <FontAwesomeIcon icon={faImage} size="lg" />
            </button>



            {/* Modal */}
            {isModalOpen && (
                <div className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50`}>
                    {
                        loading && (
                            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )
                    }
                    <div className={`bg-white p-6 rounded-xl w-full max-w-md text-center shadow-xl transition-transform transform ${isModalOpen ? 'scale-100' : 'scale-0'}`}>
                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-lg font-semibold">Tìm kiếm với hình ảnh</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-red-500">X</button>
                        </div>
                        {
                            !showResult ? (
                                <>
                                    {
                                        imageFile === "" ? (
                                            <>
                                                <p className="mb-6 mt-6 text-gray-600">Vui lòng tải lên hình ảnh để tìm kiếm thông tin liên quan.</p>
                                                <button
                                                    onClick={() => imageInputRef.current.click()}
                                                    title="Chọn ảnh"
                                                    type="button" className="p-2 rounded-[12px] mb-4 mx-auto transition duration-200 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faFileImage} size="2x" className="text-blue-600 mr-2" />
                                                    <span className="block mt-2 text-sm text-blue-600 font-medium">Tải ảnh lên</span>
                                                    <input
                                                        type="file"
                                                        ref={imageInputRef}
                                                        accept="image/png, image/jpeg, image/gif, video/mp4"
                                                        onChange={handleImageUpload}
                                                        hidden
                                                    />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <LightGallery plugins={[lgZoom, lgThumbnail, lgVideo]} mode="lg-fade">
                                                    {(() => {
                                                        const mediaClass = 'max-w-full max-h-96 cursor-pointer object-cover rounded-lg';
                                                        return (
                                                            <a href={imageFile}>
                                                                <img src={imageFile} alt="Hình ảnh" className={mediaClass} />
                                                            </a>
                                                        );
                                                    })()}
                                                </LightGallery>

                                                <button
                                                    onClick={() => imageInputRef.current.click()}
                                                    title="Chọn ảnh"
                                                    type="button" className="p-2 rounded-[12px] mb-4 mx-auto transition duration-200 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faFileImage} size="2x" className="text-blue-600 mr-2" />
                                                    <span className="block mt-2 text-sm text-blue-600 font-medium">Chọn ảnh khác</span>
                                                    <input
                                                        type="file"
                                                        ref={imageInputRef}
                                                        accept="image/png, image/jpeg, image/gif, video/mp4"
                                                        onChange={handleImageUpload}
                                                        hidden
                                                    />
                                                </button>
                                            </>
                                        )
                                    }

                                    <div className="flex justify-center space-x-4">
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition border-t pt-2 w-[95%]"
                                            onClick={() => {
                                                handleSearchByImage();
                                            }}
                                        >
                                            Tìm kiếm
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <>
                                        <LightGallery plugins={[lgZoom, lgThumbnail, lgVideo]} mode="lg-fade">
                                            {(() => {
                                                const mediaClass = 'max-w-full h-[200px] cursor-pointer object-cover rounded-l mx-auto';
                                                return (
                                                    <a href={imageFile}>
                                                        <img src={imageFile} alt="Hình ảnh" className={mediaClass} />
                                                    </a>
                                                );
                                            })()}
                                        </LightGallery>
                                    </>
                                    {
                                        productList.length > 0 ? (
                                            <div className="mt-4 h-[400px]">
                                                <h3 className="text-lg font-semibold">Kết quả tìm kiếm:</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4 h-[350px] overflow-y-auto">
                                                    {productList.map((product) => (
                                                        <ProductPreview key={product.id} item={product} />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="mt-4 text-red-500">Không tìm thấy sản phẩm nào.</p>
                                        )
                                    }
                                    <button
                                        onClick={() => {
                                            setShowResult(false);
                                            setImageFile("");
                                        }}
                                        className="mt-4 text-blue-600 hover:text-blue-800"
                                    >
                                        Tìm kiếm với hình ảnh khác
                                    </button>
                                </>
                            )
                        }
                    </div>
                </div>
            )}
        </>
    );
}
