import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../redux/slice/CategorySlice';

export const Header = () => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [hoveredChildCategory, setHoveredChildCategory] = useState(null);
    const categories = useSelector((state) => state.category.categories);


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handlerActionLogout = () => {
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
        }

        navigate('/login')
    }


    const initital = async () => {
        await dispatch(getCategories())
    }
    useEffect(() => {
        initital()
    }, []);

    const [key, setKey] = useState('');

    return (
        <header className="bg-blue-600">
            <div className="bg-blue-600 container mx-auto flex justify-between items-center  p-4">
                <div className="flex items-center cursor-pointer" onClick={() => {
                    navigate('/')
                }}>
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
                                    navigate(`/filter-product?key=${key}`)
                                }
                            }}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            type="text"
                            placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
                            className="p-2 rounded-full w-[48rem] pl-10" // Thêm padding bên trái để tránh chồng lên biểu tượng
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </span>
                    </div>
                </div>
                <div className="flex items-center">
                    {
                        localStorage.getItem('token') ?
                            (
                                <button className="text-white flex justify-between items-center" onClick={e => handlerActionLogout()}>
                                    <img
                                        src="/icon/ic_user.png"
                                        alt="Thera Care Logo"
                                        className="h-10 w-10 mx-1"
                                    />
                                    Đăng xuất
                                </button>
                            )
                            :
                            (
                                <button className="text-white flex justify-between items-center" onClick={e => navigate('/login')}>
                                    <img
                                        src="/icon/ic_user.png"
                                        alt="Thera Care Logo"
                                        className="h-10 w-10 mx-1"
                                    />
                                    Đăng nhập
                                </button>
                            )
                    }

                    <button className="bg-[#002AFF] text-blue-600 ml-4 px-4 py-2 rounded-full">
                        <FontAwesomeIcon icon={faCartShopping} className='mr-1' color='#fff' />
                        <span className='text-white'>Giỏ hàng</span>
                    </button>
                </div>
            </div>
            <div className="bg-white">
                <nav className=" container mx-auto flex justify-between items-center w-full">
                    <ul className="relative flex space-x-4 justify-between w-full">
                        {
                            categories.map((category, index) => {
                                return (
                                    <li
                                        onMouseEnter={() => setHoveredCategory(category)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                        key={category.id} className=' flex items-center hover:text-[#2261E2] cursor-pointer  hover:border-b-[#2261E2] hover:border-b-2 p-4'>
                                        <a href="#" className="text-custom-size font-medium mr-3"> {category.title} </a>
                                        {
                                            hoveredCategory != null && hoveredCategory.id === category.id ? (<FontAwesomeIcon icon={faAngleUp} />) : (<FontAwesomeIcon icon={faAngleDown} />)
                                        }
                                        {
                                            hoveredCategory != null && hoveredCategory.id === category.id && (
                                                <main className="absolute hover:block z-[9999] container mt-4 top-[2.70rem] left-0">
                                                    <div className="bg-white rounded-lg shadow-lg p-4">
                                                        <div className="flex">
                                                            <div className="w-1/4">
                                                                <ul className="space-y-2">
                                                                    {
                                                                        hoveredCategory.children && hoveredCategory.children.map((child) => {
                                                                            return (
                                                                                <li className="flex items-center p-2 hover:bg-[#edf0f3] rounded-tl-lg rounded-bl-lg"
                                                                                    onMouseEnter={() => setHoveredChildCategory(child)}>
                                                                                    <img src={child.icon} alt={child.title} className="h-7 mr-1" />
                                                                                    <span>{child.title}</span>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>
                                                            <div className="w-3/4 pl-4 bg-[#edf0f3] pt-2" >
                                                                <div className="grid grid-cols-3 gap-4 mb-4">
                                                                    {
                                                                        hoveredChildCategory && hoveredChildCategory.children.map((child) => {
                                                                            return (
                                                                                <a className="bg-white p-4 rounded-lg flex items-center" href={`/filter-product?category=${child.id}`}>
                                                                                    <img src={child.icon} alt="Sinh lý nam" className="h-12" />
                                                                                    <span className="ml-2">{child.title}</span>
                                                                                </a>
                                                                            )
                                                                        })
                                                                    }


                                                                </div>
                                                                <div>
                                                                    <h2 class="text-lg font-semibold mb-2">Bán chạy nhất <a href="#" class="text-blue-500 underline">Xem tất cả</a></h2>
                                                                    <div class="grid grid-cols-5 gap-4">
                                                                        <div class="bg-white p-4 rounded-lg shadow-lg">
                                                                            <img src="https://placehold.co/100x100" alt="Viên uống Alisha Biotic For Women Happy Life bổ sung" class="h-24 mx-auto" />
                                                                            <div class="text-center mt-2">
                                                                                <span class="text-red-500">-20%</span>
                                                                                <p class="text-sm">Viên uống Alisha Biotic For Women Happy Life bổ sung</p>
                                                                                <p class="text-blue-500 font-semibold">183.000đ / Hộp</p>
                                                                                <p class="text-gray-500 line-through">229.000đ</p>
                                                                            </div>
                                                                        </div>
                                                                        <div class="bg-white p-4 rounded-lg shadow-lg">
                                                                            <img src="https://placehold.co/100x100" alt="Viên uống JP Lady Jpanwell cung cấp vitamin hỗ trợ phụ nữ" class="h-24 mx-auto" />
                                                                            <div class="text-center mt-2">
                                                                                <p class="text-sm">Viên uống JP Lady Jpanwell cung cấp vitamin hỗ trợ phụ nữ</p>
                                                                                <p class="text-blue-500 font-semibold">1.300.000đ / Hộp</p>
                                                                            </div>
                                                                        </div>
                                                                        <div class="bg-white p-4 rounded-lg shadow-lg">
                                                                            <img src="https://placehold.co/100x100" alt="Viên uống LeAna Ocavill hỗ trợ cân bằng nội tiết tố (6" class="h-24 mx-auto" />
                                                                            <div class="text-center mt-2">
                                                                                <p class="text-sm">Viên uống LeAna Ocavill hỗ trợ cân bằng nội tiết tố (6</p>
                                                                                <p class="text-blue-500 font-semibold">680.000đ / Hộp</p>
                                                                            </div>
                                                                        </div>
                                                                        <div class="bg-white p-4 rounded-lg shadow-lg">
                                                                            <img src="https://placehold.co/100x100" alt="Viên uống Tố Nữ Vương Royal Care hỗ trợ cải thiện nội tiết" class="h-24 mx-auto" />
                                                                            <div class="text-center mt-2">
                                                                                <span class="text-red-500">-20%</span>
                                                                                <p class="text-sm">Viên uống Tố Nữ Vương Royal Care hỗ trợ cải thiện nội tiết</p>
                                                                                <p class="text-blue-500 font-semibold">116.000đ / Hộp</p>
                                                                                <p class="text-gray-500 line-through">145.000đ</p>
                                                                            </div>
                                                                        </div>
                                                                        <div class="bg-white p-4 rounded-lg shadow-lg">
                                                                            <img src="https://placehold.co/100x100" alt="Viên nang cứng Vương Nữ Khang Royal Care hỗ trợ" class="h-24 mx-auto" />
                                                                            <div class="text-center mt-2">
                                                                                <p class="text-sm">Viên nang cứng Vương Nữ Khang Royal Care hỗ trợ</p>
                                                                                <p class="text-blue-500 font-semibold">195.000đ / Hộp</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </main>
                                            )
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>

                </nav>


            </div>
        </header >
    );
};