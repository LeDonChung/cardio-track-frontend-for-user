export const Footer = () => {
    return (
      <footer className="bg-white mt-12 py-6 sm:py-8 right-0 left-0">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 px-4">
          {/* About Us */}
          <div>
            <h3 className="font-bold text-sm sm:text-base mb-2">VỀ CHÚNG TÔI</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Giới thiệu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Quy chế hoạt động
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Chính sách đặt cọc
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Chính sách nội dung
                </a>
              </li>
            </ul>
          </div>
  
          {/* Categories */}
          <div>
            <h3 className="font-bold text-sm sm:text-base mb-2">DANH MỤC</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Thực phẩm chức năng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Dược mỹ phẩm
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Thuốc
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Chăm sóc cá nhân
                </a>
              </li>
            </ul>
          </div>
  
          {/* Learn More */}
          <div>
            <h3 className="font-bold text-sm sm:text-base mb-2">TÌM HIỂU THÊM</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="/health-check"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Góc sức khỏe
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Tra cứu thuốc
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Bệnh thường gặp
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Tin tức sự kiện
                </a>
              </li>
            </ul>
          </div>
  
          {/* Hotline */}
          <div>
            <h3 className="font-bold text-sm sm:text-base mb-2">TỔNG ĐÀI</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Tư vấn mua hàng 18006927
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline focus:underline"
                >
                  Góp ý: 18004127
                </a>
              </li>
            </ul>
          </div>
  
          {/* Social Media */}
          <div>
            <h3 className="font-bold text-sm sm:text-base mb-2">KẾT NỐI VỚI CHÚNG TÔI</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-600 hover:opacity-80 focus:opacity-80"
                aria-label="Follow us on Facebook"
              >
                <img
                  src="/icon/ic_facebook.png"
                  alt="Facebook Icon"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
              </a>
              <a
                href="#"
                className="text-blue-600 hover:opacity-80 focus:opacity-80"
                aria-label="Follow us on Zalo"
              >
                <img
                  src="/icon/ic_zalo.png"
                  alt="Zalo Icon"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };