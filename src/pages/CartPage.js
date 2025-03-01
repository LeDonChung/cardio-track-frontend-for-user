import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { calculateSalePrice, formatPrice } from "../utils/AppUtils";
import { useNavigate } from 'react-router-dom';
import '../css/CartPage.css';

export const CartPage = () => {
    const navigate = useNavigate();
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState("");
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("delivery");
    const [isInvoiceRequested, setIsInvoiceRequested] = useState(false);
    const cart = useSelector(state => state.cart.cart);
    const selectedProducts = cart.filter(product => product.selected);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    useEffect(() => {
        // Fetch provinces when component mounts
        fetch("https://provinces.open-api.vn/api/p/")
            .then(response => response.json())
            .then(data => setProvinces(data));
    }, []);

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        setSelectedProvince(provinceCode);
        // Fetch districts when province is selected
        fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
            .then(response => response.json())
            .then(data => setDistricts(data.districts));
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setSelectedDistrict(districtCode);
        // Fetch wards when district is selected
        fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
            .then(response => response.json())
            .then(data => setWards(data.wards));
    };

    const handleWardChange = (e) => {
        setSelectedWard(e.target.value);
    }

    // Calculate the total price of the products in the cart
    const totalPrice = cart.reduce((total, product) => total + (product.selected ? product.quantity * product.price : 0), 0);

    const directDiscount = cart.reduce((total, product) => {
        if (product.selected) {
            const salePrice = calculateSalePrice(product.price, product.discount);
            const discountAmount = product.price - salePrice;
            return total + discountAmount * product.quantity; // Thêm vào tổng giảm giá
        }
        return total;
    }, 0);
        
    // Áp dụng giảm giá trực tiếp nếu có
     const totalPriceAfterDiscount = totalPrice - directDiscount;

    const user = {
        name: "Lê Vũ Phong",
        avatar: "https://placehold.co/40x40",
        phone: "0999999999",
        address: "300 Phan Văn Trị, Phường 5, Quận Gò Vấp, Hồ Chí Minh"
    };

    const handleDiscountClick = () => {
        setIsDiscountOpen(!isDiscountOpen);
    };

    const handleDiscountCodeChange = (e) => {
        setDiscountCode(e.target.value);
    };

    const handleDeliveryMethodChange = (method) => {
        setSelectedDeliveryMethod(method);
    };

    const handleInvoiceToggle = () => {
        setIsInvoiceRequested(!isInvoiceRequested);
    };

    return (
        <div className="bg-gray-100 text-gray-900">
            <Header />
            {/* Main Content */}
            <main className="pl-20 pt-4 pr-20">
                <div className="flex items-center mb-4">
                    <a className="text-blue-600 hover:underline flex items-center" href=""
                        onClick={() => navigate('/order')}>
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
                            {selectedProducts.map((product, index) => (
                                <div key={index} className="flex justify-between items-center border-b pb-4 mb-4">
                                    <div className="flex items-center w-full md:w-2/3">
                                        <img
                                            src={product.primaryImage}
                                            alt={product.name}
                                            className="w-20 h-20 mr-4 object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {product.discount > 0 ?(
                                            <>
                                                <span className="text-xl text-blue-600">{formatPrice(calculateSalePrice(product.price, product.discount))}</span>
                                                <span className="text-xs text-gray-600 line-through ml-2">{formatPrice(product.price)}</span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-blue-600">{formatPrice(product.price)}</span>
                                        )}
                                    </div>
                                    <div className="w-1/6 text-right">
                                        <p className="text-gray-500">x {product.quantity} Chai</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        
                        {/* Chọn hình thức nhận hàng */}
                        <div className="flex items-center mb-4 justify-between">
                            <h2 className="text-lg font-bold">Chọn hình thức nhận hàng</h2>
                            <div className="flex">
                                <div className="bg-white rounded-2xl shadow-md">
                                    <button
                                        onClick={() => handleDeliveryMethodChange("delivery")}
                                        className={`px-4 py-2 ${selectedDeliveryMethod === "delivery" ? "bg-blue-200 text-blue-600" : "bg-white text-gray-600"} font-bold rounded-lg hover:bg-blue-300`}
                                    >
                                        Giao hàng tận nơi
                                    </button>
                                    <button
                                        onClick={() => handleDeliveryMethodChange("pickup")}
                                        className={`px-4 py-2 ${selectedDeliveryMethod === "pickup" ? "bg-blue-200 text-blue-600" : "bg-white text-gray-600"} font-bold rounded-lg hover:bg-gray-100`}
                                    >
                                        Nhận tại nhà thuốc
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-md mb-4">
                        <h3 className="font-bold mb-4">Thông tin người đặt</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input type="text" placeholder="Họ và tên người đặt" className="border p-2 rounded-md w-full" />
                                <input type="text" placeholder="Số điện thoại" className="border p-2 rounded-md w-full" />
                            </div>
                            <input type="email" placeholder="Email (không bắt buộc)" className="border p-2 rounded-md w-full mb-4" />
                            
                            <h3 className="font-bold mb-4">Địa chỉ nhận hàng</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input type="text" placeholder="Họ và tên người nhận" className="border p-2 rounded-md w-full" />
                                <input type="text" placeholder="Số điện thoại" className="border p-2 rounded-md w-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <select 
                                    className="border p-2 rounded-md w-full"
                                    value={selectedProvince}
                                    onChange={handleProvinceChange}
                                >
                                    {!selectedProvince && <option>Chọn tỉnh/thành phố</option>}
                                    {provinces.map(province => (
                                        <option key={province.code} value={province.code}>{province.name}</option>
                                    ))}
                                </select>
                                <select 
                                    className={`border p-2 rounded-md w-full ${!selectedProvince ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedProvince}
                                >
                                    {!selectedDistrict && <option>Chọn quận/huyện</option>}
                                    {districts.map(district => (
                                        <option key={district.code} value={district.code}>{district.name}</option>
                                    ))}
                                </select>
                            </div>
                            <select 
                                className={`border p-2 rounded-md w-full mb-4 ${!selectedDistrict ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                                value={selectedWard}
                                onChange={handleWardChange}
                                disabled={!selectedDistrict}
                            >
                                {!selectedWard && <option>Chọn phường/xã</option>}
                                {wards.map(ward => (
                                    <option key={ward.code} value={ward.code}>{ward.name}</option>
                                ))}
                            </select>
                            <input type="text" placeholder="Nhập địa chỉ cụ thể" className="border p-2 rounded-md w-full mb-4" />
                            <textarea className="w-full p-2 border rounded-md" placeholder="Ghi chú (không bắt buộc)"></textarea>
                            
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-body2 text-text-primary md:text-body1">Yêu cầu xuất hóa đơn điện tử</p>
                                <input 
                                    type="checkbox" 
                                    id="invoice" 
                                    checked={isInvoiceRequested}
                                    onChange={handleInvoiceToggle}
                                    className="toggle-checkbox hidden"
                                />
                                <label htmlFor="invoice" className="toggle-label block w-12 h-6 rounded-full bg-gray-300 cursor-pointer relative">
                                    <span className="toggle-circle absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transition-transform transform translate-x-0"></span>
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
                                <div className="flex justify-between py-2">
                                    <span>Tổng tiền</span>
                                    <span className="text-black-600 font-bold">{totalPrice.toLocaleString()}đ</span>
                                </div>

                                <div className="flex justify-between py-2">
                                    <span>Giảm giá trực tiếp</span>
                                    <span className="text-orange-600 font-bold" style={{color: '#f79009'}}>{directDiscount !== 0 &&(<span>-</span>)}{directDiscount.toLocaleString()}đ</span>
                                </div>

                                <div className="flex justify-between py-2">
                                    <span>Giảm giá voucher</span>
                                    <span className="text-orange-600 font-bold" style={{color: '#f79009'}}>0đ</span>
                                </div>

                                <div className="flex justify-between py-2">
                                    <span>Tiết kiệm được</span>
                                    <span className="text-orange-600 font-bold" style={{color: '#f79009'}}>{directDiscount.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-xl font-bold">Thành tiền</span>
                                    <div>
                                        {totalPrice !== 0 &&(
                                            <span className="text-2xs text-gray-600 line-through mr-3">{totalPrice.toLocaleString()}đ</span>
                                        )}
                                        <span className="text-xl text-blue-600 font-bold">{totalPriceAfterDiscount.toLocaleString()}đ</span>
                                    </div>
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
