import { calculateSalePrice, formatPrice } from "../utils/AppUtils"
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/slice/CartSlice'

export const ProductPreview = ({ item }) => {
    const dispatch = useDispatch() // Dùng useDispatch để gửi action đến Redux

    // Hàm xử lý khi bấm "Chọn mua"
    const handleAddToCart = () => {
        dispatch(addToCart(item))
    }
    return (
        <div key={item.id} className="h-[450px] px-4 bg-white overflow-hidden rounded-3xl hover:cursor-pointer">
            <img src={item.primaryImage} alt={item.name} className="w-full h-40 object-contain py-2" />
            <div>
                <h3 className="font-medium text-custom-size line-clamp-3 my-2">{item.name}</h3>
                <p className="text-blue-600 font-bold mt-2">{formatPrice(calculateSalePrice(item.price, item.discount))} / {item.init}</p>
                <p className="text-gray-500 mt-2 line-through">{formatPrice(item.price)}</p>
            </div>
            <button onClick={handleAddToCart} className="w-full bg-blue-600 text-white py-2 rounded-full mt-[60px]">
              Chọn mua
            </button>
        </div>
    )
}