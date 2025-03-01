import { calculateSalePrice, formatPrice } from "../utils/AppUtils";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slice/CartSlice';
import showToast from "../utils/AppUtils"; // Import showToast để hiển thị thông báo

export const ProductPreview = ({ item }) => {
    const dispatch = useDispatch();

    // Hàm xử lý khi bấm "Chọn mua"
    const handleAddToCart = () => {
        const truncatedName = item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name;
        dispatch(addToCart(item)); // Thêm sản phẩm vào giỏ hàng
        showToast(`${truncatedName} đã được thêm vào giỏ hàng!`, 'success'); // Hiển thị thông báo thành công
    };

    return (
        <div key={item.id} className="h-[450px] px-4 bg-white overflow-hidden rounded-3xl hover:cursor-pointer">
            <img src={item.primaryImage} alt={item.name} className="w-full h-40 object-contain py-2" />
            <div>
                <h3 className="font-medium text-custom-size line-clamp-3 my-2">{item.name}</h3>
                <p className="text-blue-600 font-bold mt-2">{formatPrice(calculateSalePrice(item.price, item.discount))} / {item.init}</p>
                <p className="text-gray-500 mt-2 line-through">{formatPrice(item.price)}</p>
            </div>
            <button 
                onClick={handleAddToCart} 
                className="w-full bg-blue-600 text-white py-2 rounded-full mt-[60px] transform active:scale-95 active:opacity-80 transition-transform duration-150"
            >
                Chọn mua
            </button>
        </div>
    );
};
