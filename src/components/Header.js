import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faAngleDown, faAngleUp, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../redux/slice/CategorySlice';
import { Trash2 } from "lucide-react";
import { removeFromCart } from '../redux/slice/CartSlice';
import { calculateSalePrice, formatPrice } from "../utils/AppUtils";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { setIsOpenModalSearchByImage } from '../redux/slice/FilterSlice';
import SearchByImage from './SearchByImage';
import { fetchUserInfo } from '../redux/slice/UserSlice';

export const Header = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle for mobile menu
    const categories = useSelector((state) => state.category.categories);
    const cart = useSelector(state => state.cart.cart);
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch();
    const [hoveredChildCategory, setHoveredChildCategory] = useState(null);
    const user = JSON.parse(localStorage.getItem('userInfo') === 'undefined' ? null : localStorage.getItem('userInfo'));

    const navigate = useNavigate();

    const initital = async () => {
        await dispatch(getCategories());
        const token = localStorage.getItem('token');
        if (token) {
            await dispatch(fetchUserInfo());
        }
    };

    useEffect(() => {
        initital();
    }, []);

    const [key, setKey] = useState('');

    const getCartTotal = () => {
        return cart.length;
    };

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleGoToCart = () => {
        navigate('/order');
    };

    return (
        <header className="bg-blue-600">
            {/* Mobile Header */}
            <div className="container mx-auto p-2 sm:hidden">
                <div className="flex justify-between items-center">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img
                            src="/logo/logo_90_90 1.png"
                            alt="Thera Care Logo"
                            className="h-8 w-8"
                        />
                        <span className="text-white text-sm font-bold ml-1">
                            NHÀ THUỐC
                            <br />
                            CARDIO TRACK
                        </span>
                    </div>
                    <button
                        className="text-white text-2xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
                {/* Mobile Search and Cart */}
                <div className="mt-2 flex items-center space-x-2">
                    <div className="relative flex-1">
                        <input
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    window.location.href = `/filter-product?key=${key}`;
                                }
                            }}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            type="text"
                            placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..."
                            className="p-2 rounded-full w-full pl-8 text-sm"
                        />
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                        </span>
                        <SearchByImage />
                    </div>
                    <div className="relative">
                        <button className="bg-[#002AFF] text-blue-600 px-3 py-2 rounded-full flex items-center" onClick={handleGoToCart}>
                            <FontAwesomeIcon icon={faCartShopping} color="#fff" />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {getCartTotal()}
                            </span>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu (with User Info) */}
                {isMenuOpen && (
                    <div className="mt-2">
                        {/* User Section */}
                        <div className="mb-4 p-2 bg-blue-700 rounded text-white">
                            {(localStorage.getItem('token') && user) ? (
                                <a className="flex items-center" href="/user">
                                    <img
                                        src="/icon/ic_user.png"
                                        alt="User Icon"
                                        className="h-6 w-6 mr-2"
                                    />
                                    <span>{user.fullName}</span>
                                </a>
                            ) : (
                                <button
                                    className="flex items-center"
                                    onClick={() => navigate('/login')}
                                >
                                    <img
                                        src="/icon/ic_user.png"
                                        alt="Login Icon"
                                        className="h-6 w-6 mr-2"
                                    />
                                    <span>Đăng nhập</span>
                                </button>
                            )}
                        </div>
                        {/* Category List */}
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.id} className="relative">
                                    <button
                                        onClick={() => setHoveredCategory(hoveredCategory?.id === category.id ? null : category)}
                                        className="flex items-center justify-between w-full text-white p-2 bg-blue-700 rounded"
                                    >
                                        <span>{category.title}</span>
                                        {hoveredCategory?.id === category.id ? (
                                            <FontAwesomeIcon icon={faAngleUp} />
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        )}
                                    </button>
                                    {hoveredCategory?.id === category.id && (
                                        <ul className="mt-2 space-y-1 bg-white p-2 rounded shadow-lg">
                                            {category.children?.map((child) => (
                                                <li key={child.id}>
                                                    <a
                                                        href={`/filter-product?category=${child.id}`}
                                                        className="block text-sm text-gray-800 hover:bg-gray-100 p-1 rounded"
                                                    >
                                                        {child.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Web Header */}
            <div className="container mx-auto flex justify-between items-center p-4 hidden sm:flex">
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <img
                        src="/logo/logo_90_90 1.png"
                        alt="Thera Care Logo"
                        className="h-10 w-10"
                    />
                    <span className="text-white text-lg font-bold ml-2">
                        NHÀ THUỐC
                        <br />
                        THERA CARE
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    window.location.href = `/filter-product?key=${key}`;
                                }
                            }}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            type="text"
                            placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
                            className="p-2 rounded-full w-[48rem] pl-10"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </span>
                        <SearchByImage />
                    </div>
                </div>
                <div className="flex items-center">
                    {(localStorage.getItem('token') && user) ? (
                        <a className="text-white flex justify-between items-center" href="/user">
                            <img
                                src="/icon/ic_user.png"
                                alt="Thera Care Logo"
                                className="h-10 w-10 mx-1"
                            />
                            {user.fullName}
                        </a>
                    ) : (
                        <button className="text-white flex justify-between items-center" onClick={() => navigate('/login')}>
                            <img
                                src="/icon/ic_user.png"
                                alt="Thera Care Logo"
                                className="h-10 w-10 mx-1"
                            />
                            Đăng nhập
                        </button>
                    )}

                    {/* Cart */}
                    <div
                        className="relative z-20"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <button className="bg-[#002AFF] text-blue-600 ml-4 px-4 py-2 rounded-full mt-2 mb-2">
                            <FontAwesomeIcon icon={faCartShopping} className="mr-1" color="#fff" onClick={handleGoToCart} />
                            <span className="absolute top-0 left-10 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {getCartTotal()}
                            </span>
                            <span className="text-white">Giỏ hàng</span>
                        </button>
                        {isHovered && cart.length > 0 && (
                            <div>
                                <div className="absolute bottom--20 right-8 transform -translate-y-1/2 w-4 h-4 bg-white rotate-45"></div>
                                <div className="absolute bg-white shadow-lg p-4 right-0 rounded-lg w-96">
                                    <h3 className="text-lg font-semibold mb-2">Giỏ hàng</h3>
                                    <div className="max-h-96 overflow-y-auto">
                                        <ul>
                                            {cart.map(item => (
                                                <li key={item.id} className="flex justify-between items-center mt-2 space-x-7 pb-1">
                                                    <div className="w-1/7 border border-gray-200 rounded-lg">
                                                        <img src={item.primaryImage} alt={item.name} className="h-16 w-full object-cover p-2" />
                                                    </div>
                                                    <div className="flex flex-col w-3/5">
                                                        <span className="text-sm font-medium line-clamp-2 overflow-hidden" title={item.name}>
                                                            {item.name}
                                                        </span>
                                                        <div className="justify-between items-center flex">
                                                            <div>
                                                                {item.discount > 0 ? (
                                                                    <>
                                                                        <span className="text-xs text-blue-600">{formatPrice(calculateSalePrice(item.price, item.discount))}</span>
                                                                        <span className="text-xs text-gray-600 line-through ml-2">{formatPrice(item.price)}</span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-xs text-blue-600">{formatPrice(item.price)}</span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs">x{item.quantity} {item.init}</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/7 text-center cursor-pointer">
                                                        <Trash2 onClick={() => handleRemoveItem(item.id)} />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs">{getCartTotal()} sản phẩm</span>
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition transform active:scale-95"
                                            onClick={handleGoToCart}
                                        >
                                            Xem giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Web Navigation */}
            <div className="hidden sm:block bg-white">
                <nav className="container mx-auto flex justify-between items-center w-full">
                    <ul className="relative flex space-x-4 justify-between w-full">
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                onMouseEnter={() => setHoveredCategory(category)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                className="flex items-center hover:text-[#2261E2] cursor-pointer hover:border-b-[#2261E2] hover:border-b-2 p-4"
                            >
                                <a href="#" className="text-custom-size font-medium mr-3">{category.title}</a>
                                {hoveredCategory?.id === category.id ? (
                                    <FontAwesomeIcon icon={faAngleUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faAngleDown} />
                                )}
                                {hoveredCategory?.id === category.id && (
                                    <main className="absolute z-[9999] container mt-4 top-[2.70rem] left-0">
                                        <div className="bg-white rounded-lg shadow-lg p-4">
                                            <div className="flex">
                                                <div className="w-1/4">
                                                    <ul className="space-y-2">
                                                        {hoveredCategory.children?.map((child) => (
                                                            <li
                                                                key={child.id}
                                                                className="flex items-center p-2 hover:bg-[#edf0f3] rounded-tl-lg rounded-bl-lg"
                                                                onMouseEnter={() => setHoveredChildCategory(child)}
                                                            >
                                                                <img src={child.icon} alt={child.title} className="h-7 mr-1" />
                                                                <span>{child.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="w-3/4 pl-4 bg-[#edf0f3] pt-2">
                                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                                        {hoveredChildCategory?.children?.map((child) => (
                                                            <a
                                                                key={child.id}
                                                                className="bg-white p-4 rounded-lg flex items-center"
                                                                href={`/filter-product?category=${child.id}`}
                                                            >
                                                                <img src={child.icon} alt={child.title} className="h-12" />
                                                                <span className="ml-2">{child.title}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </main>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};
