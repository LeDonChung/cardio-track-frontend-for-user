import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, MapPin, User } from "lucide-react";
import { calculateSalePrice, formatPrice } from "../utils/AppUtils";
import { useDispatch } from 'react-redux';
import { clearSelectedProducts, fetchAddressesThunk, submitOrderThunk } from '../redux/slice/CartSlice';
import { useNavigate } from 'react-router-dom';
import '../css/CartPage.css';
import Select from 'react-select';
import showToast from "../utils/AppUtils";
import SavedAddressModal from '../components/SavedAddressModal';
import AddressFormModal from '../components/AddressFormModal';

export const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [user, setUser] = useState(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        return user;
    });

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
    const [feeShip, setFeeShip] = useState(0);
    const [fullName, setFullName] = useState(user.fullName || '');
    const [phoneNumber, setPhoneNumber] = useState(user.username || '');
    const [street, setStreet] = useState('');
    const [note, setNote] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isAddressFormModalOpen, setIsAddressFormModalOpen] = useState(false)

    // Hàm mở modal AddressFormModal
    const openAddressFormModal = () => {
        setIsModalOpen(false);  // Đóng modal SavedAddressModal
        setIsAddressFormModalOpen(true);  // Mở modal AddressFormModal
    };

    // Hàm đóng AddressFormModal
    const closeAddressFormModal = () => {
        setIsAddressFormModalOpen(false);
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            showToast("Vui lòng đăng nhập để tiếp tục", "error");
            navigate("/login");
            return;
        }

        if(cart.length === 0) {
            showToast("Vui lòng chọn thêm thuốc vào giỏ hàng", "error");
            navigate("/");
        }
    }, []);
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Chọn địa chỉ đã lưu
    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        setFullName(address.fullName);
        setPhoneNumber(address.phoneNumber);
        setStreet(address.street);
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        closeModal();
    };

    // Map options for react-select
    const provinceOptions = provinces.map(province => ({
        value: province.code,
        label: province.name,
    }));

    const districtOptions = districts.map(district => ({
        value: district.code,
        label: district.name,
    }));

    const wardOptions = wards.map(ward => ({
        value: ward.code,
        label: ward.name,
    }));

    useEffect(() => {
        // Fetch provinces when component mounts
        fetch("https://provinces.open-api.vn/api/p/")
            .then(response => response.json())
            .then(data => setProvinces(data));
    }, []);

    const handleProvinceChange = (e) => {
        setSelectedProvince(e);
        setSelectedDistrict("");
        setSelectedWard("");
        setSelectedAddress("");

        // Fetch districts when province is selected
        fetch(`https://provinces.open-api.vn/api/p/${e.value}?depth=2`)
            .then(response => response.json())
            .then(data => setDistricts(data.districts));
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e);
        setSelectedWard("");

        // Fetch wards when district is selected
        fetch(`https://provinces.open-api.vn/api/d/${e.value}?depth=2`)
            .then(response => response.json())
            .then(data => setWards(data.wards));
    };

    const handleWardChange = (e) => {
        setSelectedWard(e);
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

    const handleFullNameChange = (e) => {
        setFullName(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleStreetChange = (e) => {
        setStreet(e.target.value);
    };

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const token = localStorage.getItem('token');
    const handleSubmitOrder = async() => {
        if (!fullName) {
            alert("Vui lòng nhập họ tên người nhận hàng");
            return;
        }

        if (!phoneNumber) {
            alert("Vui lòng nhập số điện thoại người nhận hàng");
            return;
        }

        if (!selectedProvince && !selectedAddress.province) {
            alert("Vui lòng chọn tỉnh/thành phố");
            return;
        }

        if (!selectedDistrict && !selectedAddress.district) {
            alert("Vui lòng chọn quận/huyện");
            return;
        }

        if (!selectedWard && !selectedAddress.ward) {
            alert("Vui lòng chọn phường/xã");
            return;
        }

        if (!street) {
            alert("Vui lòng nhập địa chỉ cụ thể");
            return;
        }

        if(paymentMethod === '') {
            alert("Vui lòng chọn phương thức thanh toán. Hiện tại chỉ hổ trợ tiền mặt và QR");
            return;
        }

        // Lấy thông tin người dùng và đơn hàng
        const orderDetails = selectedProducts.map(product => ({
            discount: product.discount,
            price: product.price,
            quantity: product.quantity,
            medicine: product.id, 
        }));

        const orderDetailsPayment = selectedProducts.map(product => ({
            price: product.price - product.discount*product.price/100,
            quantity: product.quantity,
            name: product.name,
        })); 

        const orderData = {
            note: note,
            exportInvoice: isInvoiceRequested,
            feeShip: feeShip,
            customer: user.id,
            paymentMethod: paymentMethod,
            addressDetail: {
                district: selectedAddress ? selectedAddress.district : districts.find(district => district.code === Number(selectedDistrict.value)).name,
                province: selectedAddress ? selectedAddress.province : provinces.find(province => province.code === Number(selectedProvince.value)).name,
                ward: selectedAddress ? selectedAddress.ward : wards.find(ward => ward.code === Number(selectedWard.value)).name,
                street: street,
                addressType: selectedAddress ? selectedAddress.addressType : null,
                fullName: fullName,
                phoneNumber: phoneNumber,
            },
            orderDetails: orderDetails,
        };

        sessionStorage.setItem("orderData", JSON.stringify(orderData));

        try {
            // Lưu lại đơn hàng vào cơ sở dữ liệu với trạng thái SPENDING
            const result = await dispatch(submitOrderThunk({ orderData, token }));
            let orderId = '';            
            if (result.payload && result.payload.data) {
                orderId = result.payload.data.id;  
            } else {
                console.log('Không có dữ liệu đơn hàng');
            }
    
            showToast("Đặt hàng thành công", "success");
            dispatch(clearSelectedProducts());

            if (paymentMethod === 'CASH') {
                navigate('/');
            } else if (paymentMethod === 'QR_CODE') {
                try {
                    // Gọi API của PayOS để tạo payment link
                    const response = await fetch('http://localhost:8888/api/v1/pay/create-payment-link', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            products: orderDetailsPayment,
                            description: 'Thanh toán',
                            returnUrl: 'http://localhost:3000/payment-result',
                            cancelUrl: 'http://localhost:3000/payment-result',
                            amount: 10000,
                            orderCode: orderId,
                        }),
                    });
    
                    const data = await response.json();
    
                    if (response.ok) {
                        const paymentLink = data.checkoutUrl;
                        window.location.href = `${paymentLink}`;
                    } else {
                        showToast("Có lỗi xảy ra khi tạo liên kết thanh toán", "error");
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showToast("Có lỗi xảy ra trong quá trình thanh toán", "error");
                }
            }
        } catch (error) {
            showToast("Đặt hàng thất bại", "error");
        }
        
    };

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            width: '100%',
            height: '42px',
            padding: '0 10px',
            borderRadius: '5px',
            fontSize: '16px',
        }),
        option: (base) => ({
            ...base,
            fontSize: '16px',
        }),
        menu: (base) => ({
            ...base,
            fontSize: '16px',
        }),
    };


    return (
        <div className="bg-gray-100 text-gray-900">
            <Header />
            {/* Main Content */}
            <main className="pl-20 pt-4 pr-20">
                <div className="flex items-center mb-4">
                    <a className="text-blue-600 hover:underline flex items-center" href="#"
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
                                        {product.discount > 0 ? (
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
                            <div className="flex items-center mb-4 space-x-4">
                                <User
                                    size={30}
                                    className="text-blue-600"
                                />
                                <h3 className="font-bold">Thông tin người đặt</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input type="text" placeholder="Họ và tên người đặt" className="border p-2 rounded-md w-full" disabled value={user.fullName} />
                                <input type="text" placeholder="Số điện thoại" className="border p-2 rounded-md w-full" disabled value={user.username} />
                            </div>

                            <div className="flex items-center mb-4 justify-between">
                                <div className="flex items-center space-x-4">
                                    <MapPin
                                        size={28}
                                        className="text-blue-600"
                                    />
                                    <h3 className="font-bold">Thông tin nhận hàng</h3>
                                </div>
                                <button
                                    onClick={openModal}
                                    className="text-2xs font-bold text-blue-500"
                                >
                                    Chọn địa chỉ đã lưu
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input type="text" placeholder="Họ và tên người nhận" className="border p-2 rounded-md w-full"
                                    value={fullName}
                                    onChange={handleFullNameChange}
                                />
                                <input type="text" placeholder="Số điện thoại" className="border p-2 rounded-md w-full"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <Select
                                    options={provinceOptions}
                                    onChange={handleProvinceChange}
                                    value={selectedProvince ? selectedProvince : selectedAddress ? { value: "", label: selectedAddress.province } : ""}
                                    placeholder="Chọn tỉnh/thành phố"
                                    className="custom-select"
                                    styles={customSelectStyles}
                                />
                                <Select
                                    options={districtOptions}
                                    onChange={handleDistrictChange}
                                    value={selectedDistrict ? selectedDistrict : selectedAddress ? { value: "", label: selectedAddress.district } : ""}
                                    placeholder="Chọn quận/huyện"
                                    className="custom-select"
                                    isDisabled={!selectedProvince}
                                    styles={customSelectStyles}
                                />
                            </div>
                            <Select
                                options={wardOptions}
                                onChange={handleWardChange}
                                value={selectedProvince ? selectedWard : selectedAddress ? { value: "", label: selectedAddress.ward } : ""}
                                placeholder="Chọn phường/xã"
                                className="custom-select mb-4"
                                isDisabled={!selectedDistrict}
                                styles={customSelectStyles}
                            />

                            <input type="text" placeholder="Nhập địa chỉ cụ thể" className="border p-2 rounded-md w-full mb-4"
                                value={street}
                                onChange={handleStreetChange}
                            />
                            <textarea className="w-full p-2 border rounded-md" placeholder="Ghi chú (không bắt buộc)"
                                value={note}
                                onChange={handleNoteChange}
                            ></textarea>

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
                                    <input type="radio" name="payment" className="mr-4 transform scale-150" 
                                    onChange={()=>setPaymentMethod('CASH')}/>
                                    <img
                                        src="/icon/ic_cod.png"
                                        alt="Thanh toán tiền mặt khi nhận hàng"
                                        className="w-10 h-10 mr-2"
                                    />
                                    <span>Thanh toán tiền mặt khi nhận hàng</span>
                                </label>
                                <label className="flex items-center mb-2 pb-2 border-b">
                                    <input type="radio" name="payment" className="mr-4 transform scale-150" 
                                    onChange={()=>setPaymentMethod('QR_CODE')}/>
                                    <img
                                        src="/icon/ic_qr.png"
                                        alt="Thanh toán bằng chuyển khoản (QR Code)"
                                        className="w-10 h-10 mr-2"
                                    />
                                    <span>Thanh toán bằng chuyển khoản (QR Code)</span>
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
                                    <span className="text-orange-600 font-bold" style={{ color: '#f79009' }}>{directDiscount !== 0 && (<span>-</span>)}{directDiscount.toLocaleString()}đ</span>
                                </div>

                                <div className="flex justify-between py-2">
                                    <span>Giảm giá voucher</span>
                                    <span className="text-orange-600 font-bold" style={{ color: '#f79009' }}>0đ</span>
                                </div>

                                <div className="flex justify-between py-2">
                                    <span>Tiết kiệm được</span>
                                    <span className="text-orange-600 font-bold" style={{ color: '#f79009' }}>{directDiscount.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span>Phí vận chuyển</span>
                                    {feeShip === 0 ? (
                                        <span className="text-blue-600 font-bold">Miễn phí</span>
                                    ) : (
                                        <span className="text-orange-600 font-bold" style={{ color: '#f79009' }}>{feeShip.toLocaleString()}đ</span>
                                    )}
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-xl font-bold">Thành tiền</span>
                                    <div>
                                        {totalPrice !== 0 && (
                                            <span className="text-2xs text-gray-600 line-through mr-3">{totalPrice.toLocaleString()}đ</span>
                                        )}
                                        <span className="text-xl text-blue-600 font-bold">{totalPriceAfterDiscount.toLocaleString()}đ</span>
                                    </div>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition transform active:scale-95 w-full mt-4"
                                    onClick={handleSubmitOrder}
                                >
                                    Mua hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal chọn địa chỉ đã lưu */}
            <SavedAddressModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSelect={handleSelectAddress}
                openAddressFormModal={openAddressFormModal}
            />

            <AddressFormModal
                isOpen={isAddressFormModalOpen}
                onClose={closeAddressFormModal}
                provinces={provinceOptions}
                districts={districtOptions}
                wards={wardOptions}
            />

            <Footer />
        </div>
    );
};
