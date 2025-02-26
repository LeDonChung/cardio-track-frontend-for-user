import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CartPage = () => {
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState("");

    const products = [
        { 
            name: "Sữa Rửa Mặt Tạo Bọt CeraVe Foaming Cleanser dành cho da thường và da dầu (473ml)", 
            quantity: 1, 
            price: "455.000đ", 
            image: "https://placehold.co/80x80" 
        },
        { 
            name: "Sữa Rửa Mặt Tạo Bọt CeraVe cho da khô (473ml)", 
            quantity: 1, 
            price: "475.000đ", 
            image: "https://placehold.co/80x80" 
        },
        { 
            name: "Sữa Rửa Mặt Tạo Bọt CeraVe cho da nhạy cảm (473ml)", 
            quantity: 1, 
            price: "495.000đ", 
            image: "https://placehold.co/80x80" 
        }
    ];

    const user = {
        name: "Lê Vũ Phong",
        phone: "0999999999",
        address: "300 Phan Văn Trị, Phường 5, Quận Gò Vấp, Hồ Chí Minh"
    };

    const handleDiscountClick = () => {
        setIsDiscountOpen(!isDiscountOpen);
    };

    const handleDiscountCodeChange = (e) => {
        setDiscountCode(e.target.value);
    };

    return (
        <div className="bg-gray-100 text-gray-900">
            <Header />
            {/* Main Content */}
            <main className="pl-20 pt-4 pr-20">
                <div className="flex items-center mb-4">
                    <a className="text-blue-600 hover:underline flex items-center" href="#">
                        <i className="fas fa-arrow-left"></i>
                        <ChevronLeft className="ml-2" />
                        Quay lại giỏ hàng
                    </a>
                </div>
                <div className="flex">
                    {/* Phần bên trái: Danh sách sản phẩm, Chọn hình thức nhận hàng, Chọn phương thức thanh toán */}
                    <div className="flex-1 p-4 rounded-md mr-4">
                        {/* Danh sách sản phẩm */}
                        <h2 className="text-lg font-bold mb-4">Danh sách sản phẩm</h2>
                        <div className="bg-white p-4 rounded-md shadow-md mb-4">
                            {products.map((product, index) => (
                                <div key={index} className="flex justify-between items-center border-b pb-4 mb-4">
                                    <div className="flex items-center">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-20 h-20 mr-4"
                                        />
                                        <div>
                                            <p>{product.name}</p>
                                            <p className="text-gray-500">x{product.quantity} Chai</p>
                                        </div>
                                    </div>
                                    <p className="font-bold">{product.price}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Chọn hình thức nhận hàng */}
                        <h2 className="text-lg font-bold mb-4">Chọn hình thức nhận hàng</h2>
                        <div className="bg-white p-4 rounded-md shadow-md mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-bold">Địa chỉ nhận hàng</p>
                                    <p className="pt-4">{user.address}</p>
                                </div>
                                <a className=" pt-10 text-blue-600 hover:underline" href="#">Thay đổi</a>
                            </div>
                            <div className="mb-4">
                                <p className="font-bold mb-5">{user.name} - {user.phone}</p>
                                <textarea
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Ghi chú (không bắt buộc)"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span>Yêu cầu xuất hóa đơn điện tử</span>
                                </label>
                            </div>    
                        </div>

                        {/* Chọn phương thức thanh toán */}
                        <h2 className="text-lg font-bold mb-4">Chọn phương thức thanh toán</h2>
                        <div className="bg-white p-4 rounded-md shadow-md mb-4">
                            <div className="mb-4">
                                <label className="flex items-center mb-2 pb-2 border-b">
                                    <input type="radio" name="payment" className="mr-4 transform scale-150" />
                                    <img
                                        src="/icon/ic_cod.png"
                                        alt="Thanh toán tiền mặt khi nhận hàng"
                                        className="w-10 h-10 mr-2"
                                    />
                                    <span>Thanh toán tiền mặt khi nhận hàng</span>
                                </label>
                                <label className="flex items-center mb-2 pb-2 border-b">
                                    <input type="radio" name="payment" className="mr-4 transform scale-150" />
                                    <img
                                        src="/icon/ic_qr.png"
                                        alt="Thanh toán bằng chuyển khoản (QR Code)"
                                        className="w-10 h-10 mr-2"
                                    />
                                    <span>Thanh toán bằng chuyển khoản (QR Code)</span>
                                </label>
                                <label className="flex items-center mb-2 pb-2 border-b">
                                    <input type="radio" name="payment" className="mr-4 transform scale-150" />
                                    <img
                                        src="/icon/ic_card.png"
                                        alt="Thanh toán bằng thẻ ATM nội địa và tài khoản ngân hàng"
                                        className="w-10 h-10 mr-2"
                                    />
                                    <span>Thanh toán bằng thẻ ATM nội địa và tài khoản ngân hàng</span>
                                </label>
                                <label className="flex items-center mb-2 pb-2 border-b">
                                    <input type="radio" name="payment" className="mr-4 transform scale-150" />
                                    <img
                                        src="/icon/ic_vnpay_atm.png"
                                        alt="Thanh toán bằng thẻ quốc tế Visa, Master, JCB, AMEX (GooglePay, ApplePay)"
                                        className="w-10 h-10 mr-2"
                                    />
                                    <span>Thanh toán bằng thẻ quốc tế Visa, Master, JCB, AMEX (GooglePay, ApplePay)</span>
                                </label>
                                <label className="flex items-center mb-2 pb-2 border-b">
                                    <input type="radio" name="payment" className="mr-4 transform scale-150" />
                                    <img
                                        src="/icon/ic_zalopay.png"
                                        alt="Thanh toán bằng ví ZaloPay"
                                        className="w-10 h-10 mr-2"
                                    />
                                    <span>Thanh toán bằng ví ZaloPay</span>
                                </label>
                                <label className="flex items-center mb-2 pb-2 border-b">
                                    <input type="radio" name="payment" className="mr-4 transform scale-150" />
                                    <img
                                        src="/icon/ic_momo.png"
                                        alt="Thanh toán bằng ví MoMo"
                                        className="w-10 h-10 mr-2"
                                    />
                                    <span>Thanh toán bằng ví MoMo</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="payment" className="mr-4 transform scale-150" />
                                    <img
                                        src="/icon/ic_vnpay.png"
                                        alt="Thanh toán bằng ví VNPay"
                                        className="w-10 h-10 mr-2"
                                    />
                                    <span>Thanh toán bằng ví VNPay</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Phần bên phải: Thông tin đơn hàng, Ưu đãi, Thanh toán */}
                    <div className="mt-11 p-4 rounded-md w-1/3">
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <div
                                className="bg-blue-100 text-blue-600 p-2 rounded-md flex justify-between items-center font-medium cursor-pointer px-4 mb-3"
                                onClick={handleDiscountClick}
                            >
                                <span>Áp dụng ưu đãi để được giảm giá</span>
                                <ChevronRight size={18} />
                            </div>

                            {/* Modal for discount code */}
                            {isDiscountOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                    <div className="bg-white p-6 rounded-md w-96 shadow-lg">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-bold flex-grow text-center">Nhập mã giảm giá</h3>
                                            <button 
                                                onClick={() => setIsDiscountOpen(false)} 
                                                className="text-3xl text-gray-600"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <div className="flex mt-4">
                                            <input
                                                type="text"
                                                value={discountCode}
                                                onChange={handleDiscountCodeChange}
                                                className="w-4/6 p-2 border rounded-md mr-4"
                                                placeholder="Nhập mã giảm giá"
                                            />
                                            <button className="bg-blue-600 text-white p-2 rounded-md w-2/6">
                                                Xác nhận
                                            </button>
                                        </div>
                                        <div>
                                            <button className="bg-blue-600 text-white p-2 rounded-md w-full mt-4">
                                                Áp dụng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span>Tổng tiền</span>
                                    <span>1.425.000đ</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Giảm giá trực tiếp</span>
                                    <span>0đ</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span>Giảm giá voucher</span>
                                    <span>0đ</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Thành tiền</span>
                                    <span>1.425.000đ</span>
                                </div>
                                <button className="bg-blue-600 text-white w-full p-2 rounded-md mt-4">Mua hàng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
