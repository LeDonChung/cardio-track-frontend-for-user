import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, updateCart } from '../redux/slice/CartSlice'; 
import { calculateSalePrice, formatPrice } from "../utils/AppUtils";

export const OrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cart);

    const [selectAll, setSelectAll] = useState(false);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState("");

    const handleQuantityChange = (index, type) => {
        const updatedCart = [...cart];
        const product = updatedCart[index];
        const newQuantity = type === 'increase' ? product.quantity + 1 : product.quantity - 1;
        // Dispatch action để cập nhật số lượng
        dispatch(updateQuantity({ id: product.id, quantity: newQuantity >= 1 ? newQuantity : 1 }));
    };

    const handleDeleteProduct = (index) => {
        const product = cart[index];
        // Dispatch action để xóa sản phẩm khỏi giỏ hàng
        dispatch(removeFromCart(product.id));
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        
        // Cập nhật trạng thái chọn tất cả sản phẩm
        const updatedCart = cart.map(product => ({
            ...product,
            selected: newSelectAll
        }));
    
        // Dispatch action để cập nhật giỏ hàng với trạng thái mới
        dispatch(updateCart(updatedCart));
    };

    const handleSelectProduct = (index) => {
        const updatedCart = [...cart];
        updatedCart[index] = {
            ...updatedCart[index],
            selected: !updatedCart[index].selected
        };
        
        // Kiểm tra xem có sản phẩm nào chưa được chọn không
        const allSelected = updatedCart.every(product => product.selected);
    
        // Cập nhật trạng thái "Chọn tất cả"
        setSelectAll(allSelected);
    
        // Dispatch action để cập nhật trạng thái chọn sản phẩm
        dispatch(updateCart(updatedCart));
    };
    

    const handleDiscountClick = () => {
        setIsDiscountOpen(!isDiscountOpen);
    };

    const handleDiscountCodeChange = (e) => {
        setDiscountCode(e.target.value);
    };

    const handleGoToHome = () => {
        navigate('/'); 
    };

    const totalItemsInCart = cart.length;
    
    // Tính tổng tiền trước giảm giá
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

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className="pl-20 pt-4 pr-20">
                <div className="flex items-center mb-4">
                    <a className="text-blue-600 hover:underline flex items-center" href="#" onClick={handleGoToHome}>
                        <ChevronLeft className="ml-2"/>
                        <span className="ml-2">Tiếp tục mua sắm</span>
                    </a>
                </div>

                <div className="flex">
                    <div className="flex-1 p-4 rounded-md mr-4">
                        <div className="bg-white p-4 rounded-md shadow-md border">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="w-full bg-gray-100 border-b">
                                        <th className="py-3 px-4 text-left">
                                            <input 
                                                type="checkbox" 
                                                className="form-checkbox h-5 w-5 text-blue-600" 
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                            <span className="ml-2">Chọn tất cả ({totalItemsInCart})</span>
                                        </th>
                                        <th className="py-3 px-4 text-left w-1/6">Giá thành</th>
                                        <th className="py-3 px-4 text-left w-1/6">Số lượng</th>
                                        <th className="py-3 px-4 text-left w-1/7">Đơn vị</th>
                                        <th className="py-3 px-4 text-left w-1/7"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((product, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-4 px-4 flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-checkbox text-blue-600" 
                                                    checked={product.selected || false}
                                                    onChange={() => handleSelectProduct(index)}
                                                />
                                                <img src={product.primaryImage} alt={`Image of ${product.name}`} className="ml-4 w-12 h-12 object-cover"/>
                                                <span className="ml-4">{product.name}</span>
                                            </td>
                                            <td className="py-4 px-4">
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
                                            </td>
                                            <td className="py-4 px-4 flex items-center">
                                                <button 
                                                    className="bg-gray-200 text-gray-600 px-2 py-1 rounded-l"
                                                    onClick={() => handleQuantityChange(index, 'decrease')}
                                                >
                                                    -
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={product.quantity} 
                                                    className="pt-1 w-12 text-center border-t border-b border-gray-200"
                                                    readOnly
                                                />
                                                <button 
                                                    className="bg-gray-200 text-gray-600 px-2 py-1 rounded-r"
                                                    onClick={() => handleQuantityChange(index, 'increase')}
                                                >
                                                    +
                                                </button>
                                            </td>
                                            <td className="py-4 px-4 items-center">
                                                <div className="flex items-center">
                                                    <select className="border border-gray-300 rounded px-2 py-1">
                                                        <option>{product.init}</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="mr-4 ml-4 mt-2 text-gray-600 hover:text-gray-800">
                                                    <Trash2 size={20} onClick={() => handleDeleteProduct(index)}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-4 rounded-md w-1/3">
                        <div className="bg-white p-4 rounded-md border shadow-md">
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
                                <span className="font-bold">Thành tiền</span>
                                <div>
                                    {totalPrice !== 0 &&(
                                        <span className="text-2xs text-gray-600 line-through mr-3">{totalPrice.toLocaleString()}đ</span>
                                    )}
                                    <span className="text-xl text-blue-600 font-bold">{totalPriceAfterDiscount.toLocaleString()}đ</span>
                                </div>
                            </div>

                            <div className="flex justify-center py-4">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
                                    Mua hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
