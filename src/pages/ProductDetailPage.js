import React, { useState, useReducer, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import showToast, { calculateSalePrice, formatPrice } from "../utils/AppUtils";
import Slider from "react-slick";
import {
  faPlus,
  faMinus,
  faCircleQuestion,
  faAngleDown,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProductById, recommendProduct } from "../redux/slice/ProductSlice";
import { ProductRecommend } from "../components/ProductRecommend";
import { addToCart } from "../redux/slice/CartSlice";

const initialQuantity = { quantity: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { quantity: state.quantity < 10 ? state.quantity + 1 : 10 };
    case "DECREMENT":
      return { quantity: state.quantity > 1 ? state.quantity - 1 : 1 };
    default:
      return state;
  }
}

export const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [stateQuantity, dispatchQuantity] = useReducer(
    reducer,
    initialQuantity
  );
  const [expanded, setExpanded] = useState(false);

  const product = useSelector((state) => state.product.product);
  const recommendProducts = useSelector(
    (state) => state.product.recommendProducts
  );

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getProductById(id));
      await dispatch(recommendProduct(id));
    };
    fetchData();
  }, [dispatch, id]);

  const handleAddToCart = () => {
    const truncatedName =
      product.name.length > 30
        ? product.name.substring(0, 30) + "..."
        : product.name;
    dispatch(addToCart({ ...product, quantity: stateQuantity.quantity }));
    showToast(`${truncatedName} đã được thêm vào giỏ hàng!`, "success");
  };

  if (!product) return null;

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md flex flex-col lg:flex-row overflow-hidden">
          {/* Product Images */}
          <div className="lg:w-1/2 w-full">
            <Slider {...settings}>
              {product.images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  className="w-full object-contain max-h-[500px]"
                  alt=""
                />
              ))}
            </Slider>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 w-full p-6 flex flex-col justify-between">
            <div>
              <div className="text-lg font-normal flex justify-between">
                <span>Thương hiệu:</span>
                <span className="text-blue-600">{product.brand.title}</span>
              </div>

              <div className="text-2xl font-bold mt-4">{product.name}</div>

              <div className="flex items-center mt-4 text-gray-600">
                <span>{product.sku}</span>
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  className="ml-2 text-gray-400"
                />
              </div>

              <div className="text-3xl text-blue-600 mt-4 font-bold">
                <p className="text-gray-500 mt-2 line-through">{formatPrice(product.price)}</p>
                <p className="text-blue-600 font-bold mt-2">{formatPrice(calculateSalePrice(product.price, product.discount))} / {product.init}</p>
                <span className="text-lg ml-1">{product.init}</span>
              </div>

              <div className="inline-block mt-4 px-4 py-2 border-2 border-blue-600 rounded-full text-blue-600 text-center">
                {product.specifications[0].title}
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-lg font-medium text-gray-700">
                  Chọn số lượng:
                </span>
                <div className="flex items-center">
                  <button
                    className={`w-10 h-10 border border-gray-300 rounded-l-full ${stateQuantity.quantity === 1
                      ? "cursor-not-allowed opacity-50"
                      : ""
                      }`}
                    disabled={stateQuantity.quantity === 1}
                    onClick={() => dispatchQuantity({ type: "DECREMENT" })}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                    {stateQuantity.quantity}
                  </div>
                  <button
                    className={`w-10 h-10 border border-gray-300 rounded-r-full ${stateQuantity.quantity === 10
                      ? "cursor-not-allowed opacity-50"
                      : ""
                      }`}
                    disabled={stateQuantity.quantity === 10}
                    onClick={() => dispatchQuantity({ type: "INCREMENT" })}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <button>
                  <img src="../icon/ic-lien-he.png" alt="Liên hệ" />
                </button>
                <button className="w-full md:w-1/2 py-3 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  Tìm nhà thuốc
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full md:w-1/2 py-3 rounded-full bg-blue-600 text-white font-semibold"
                >
                  Chọn mua
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mô tả sản phẩm */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-10">
          <h2 className="text-2xl font-bold border-b pb-2 mb-4 underline">
            Mô tả sản phẩm
          </h2>
          <div dangerouslySetInnerHTML={{ __html: product.desShort }} />
          <div className="mt-4">
            <div
              className={`text-gray-700 ${expanded ? "" : "line-clamp-3"}`}
              dangerouslySetInnerHTML={{ __html: product.des }}
            />
            <button
              className="text-blue-600 mt-4 flex items-center"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Thu gọn" : "Xem thêm"}
              <FontAwesomeIcon
                icon={expanded ? faAngleUp : faAngleDown}
                className="ml-2"
              />
            </button>
          </div>
        </div>

        {/* Gợi ý sản phẩm */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Sản phẩm liên quan</h2>
          <div className="mt-4">
            {recommendProducts && <ProductRecommend data={recommendProducts} />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
