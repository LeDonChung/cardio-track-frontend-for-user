import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, updateCart } from '../redux/slice/CartSlice';
import { calculateSalePrice, formatPrice } from "../utils/AppUtils";
import showToast from "../utils/AppUtils";
import { ProductRecommend } from "../components/ProductRecommend";
import { recommendOrder } from "../redux/slice/ProductSlice";

export const OrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cart);
    const recommendOrders = useSelector(state => state.product.recommendOrders);


    useEffect(() => {
        if (cart.length === 0) {
            showToast("Vui lòng chọn thêm thuốc vào giỏ hàng", "error");
            navigate("/");
            return;
        }
        // Lấy danh sách sản phẩm được đề xuất mua kèm
        const productIds = cart.map(product => product.id);
        dispatch(recommendOrder(productIds));
    }, [cart, dispatch, navigate]);

    const [selectAll, setSelectAll] = useState(true);
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState("");

    const handleQuantityChange = (index, type) => {
        const updatedCart = [...cart];
        const product = updatedCart[index];
        const newQuantity = type === 'increase' ? product.quantity + 1 : product.quantity - 1;
        dispatch(updateQuantity({ id: product.id, quantity: newQuantity >= 1 ? newQuantity : 1 }));
    };

    const handleDeleteProduct = (index) => {
        const product = cart[index];
        dispatch(removeFromCart(product.id));
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        const updatedCart = cart.map(product => ({
            ...product,
            selected: newSelectAll
        }));

        dispatch(updateCart(updatedCart));
    };

    const handleSelectProduct = (index) => {
        const updatedCart = [...cart];
        updatedCart[index] = {
            ...updatedCart[index],
            selected: !updatedCart[index].selected
        };

        const allSelected = updatedCart.every(product => product.selected);

        setSelectAll(allSelected);

        dispatch(updateCart(updatedCart));
    };
    useEffect(() => {
        handleSelectAll()
    }, [])
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
            return total + discountAmount * product.quantity;
        }
        return total;
    }, 0);

    const totalPriceAfterDiscount = totalPrice - directDiscount;

    const handleBuy = () => {
        const selectedProducts = cart.filter(product => product.selected);
        if (selectedProducts.length === 0) {
            showToast("Vui lòng chọn ít nhất một sản phẩm để mua!", 'error');
        } else {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) {
                showToast("Vui lòng đăng nhập để mua hàng!", 'error');
                navigate('/login');
                return;
            }
            navigate('/cart');
        }
    };

    return (
        <div className="bg-white text-gray-900">
            <Header />
            <main className="pl-4 md:pl-20 pt-4 pr-4 md:pr-20">
                <div className="flex items-center mb-4">
                    <a className="text-blue-600 hover:underline flex items-center" href="#" onClick={handleGoToHome}>
                        <ChevronLeft className="ml-2" />
                        <span className="ml-2">Tiếp tục mua sắm</span>
                    </a>
                </div>

                <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-4 rounded-md mr-4 mb-4 md:mb-0  w-full">
                        <div className="bg-white p-4 rounded-md shadow-md border overflow-x-auto">
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
                                                <img src={product.primaryImage} alt={`Image of ${product.name}`} className="ml-4 w-12 h-12 object-cover" />
                                                <span className="ml-4 text-ellipsis overflow-hidden whitespace-nowrap max-w-xs">{product.name}</span>
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
                                                    <Trash2 size={20} onClick={() => handleDeleteProduct(index)} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {recommendOrders.length > 0 && (
                            <div className="bg-white p-4 rounded-md shadow-md border mt-5">
                                <h2 className="text-[20px] font-semibold mt-7">Bạn có thể mua kèm</h2>
                                <div className="w-full my-5">
                                    {recommendOrders && <ProductRecommend data={recommendOrders} />}
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="p-4 rounded-md w-full md:w-1/3">
                        <div className="bg-white p-4 rounded-md border shadow-md">
                            <div
                                className="bg-blue-100 text-blue-600 p-2 rounded-md flex justify-between items-center font-medium cursor-pointer px-4 mb-3"
                                onClick={handleDiscountClick}
                            >
                                <span>Áp dụng ưu đãi để được giảm giá</span>
                                <ChevronRight size={18} />
                            </div>

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
                                            <button className="w-2/6 p-2 bg-blue-600 text-white rounded-md">Áp dụng</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="my-3">
                                <div className="flex justify-between py-2 border-b">
                                    <span>Tổng cộng:</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b">
                                    <span>Giảm giá trực tiếp:</span>
                                    <span>-{formatPrice(directDiscount)}</span>
                                </div>

                                <div className="flex justify-between py-2 font-semibold">
                                    <span>Tổng tiền thanh toán:</span>
                                    <span>{formatPrice(totalPriceAfterDiscount)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button className="text-blue-600" onClick={handleGoToHome}>
                                    Tiếp tục mua sắm
                                </button>
                                <button className="px-6 py-2 bg-blue-600 text-white rounded-md" onClick={handleBuy}>
                                    Mua ngay
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
