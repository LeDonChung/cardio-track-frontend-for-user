import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Banner } from "../components/Banner";
import { Brand } from "../components/Brand";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../redux/slice/BrandSlice";
import { useEffect, useState, useRef } from "react";
import { getProminents } from "../redux/slice/CategorySlice";
import { getObject } from "../redux/slice/TagSlice";
import { TagByObject } from "../components/TagByObject";
import { setIsChatOpen } from "../redux/slice/ChatSlice";
import { fetchAllHealthTests } from "../redux/slice/HealthCheckSlice";
import { fetchAllListPost } from "../redux/slice/PostSlice";
import { fetchUserInfo } from "../redux/slice/UserSlice";

const policiesInit = [
  {
    id: "policy1",
    logo: "/policy/ic_policy_1.png",
    title: "Thuốc chính hãng",
    des: "đa dạng và chuyên sâu",
  },
  {
    id: "policy2",
    logo: "/policy/ic_policy_2.png",
    title: "Đổi trả trong 30 ngày",
    des: "kể từ ngày mua hàng",
  },
  {
    id: "policy3",
    logo: "/policy/ic_policy_3.png",
    title: "Cam kết 100%",
    des: "chất lượng sản phẩm",
  },
  {
    id: "policy4",
    logo: "/policy/ic_policy_4.png",
    title: "Miễn phí vận chuyển",
    des: "theo chính sách giao hàng",
  },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Scroll controls for health tests
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);

  // Fetch user info
  useEffect(() => {
    dispatch(fetchUserInfo()).then((res) => {
      if (res.payload) {
        localStorage.setItem("userInfo", JSON.stringify(res.payload.data));
      }
    });
  }, [dispatch]);

  // Scroll functions
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 300; // Reduced for mobile
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 300;
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const isChatOpen = useSelector((state) => state.chat.isChatOpen);
  const menus = [
    {
      id: "menu1",
      icon: "https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/canmuathuoc_29bf521996.png",
      title: "Cần mua thuốc",
      onPress: () => navigate("/filter-product"),
    },
    {
      id: "menu2",
      icon: "https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/tuvanvoiduocsi_1855320b40.png",
      title: "Tư vấn với Dược Sỹ",
      onPress: () => dispatch(setIsChatOpen(true)),
    },
    {
      id: "menu4",
      icon: "https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/doncuatoi_5058ac6058.png",
      title: "Đơn của tôi",
      onPress: () => navigate("/user"),
    },
    {
      id: "menu6",
      icon: "https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/kiemtrasuckhoe_15f6ff48e9.png",
      title: "Kiểm tra sức khỏe",
      onPress: () => {
        navigate("/health-check");
      },
    },
  ];

  const brands = useSelector((state) => state.brand.brands);
  const prominents = useSelector((state) => state.category.prominents);
  const tagsByObject = useSelector((state) => state.tag.tagsByObject);
  const [selectedTag, setSelectedTag] = useState(null);
  const [policies] = useState(policiesInit);
  const { healthTests } = useSelector((state) => state.healthcheck);
  const posts = useSelector((state) => state.post.myPosts);

  const initital = async () => {
    await dispatch(getBrands());
    await dispatch(getProminents());
    await dispatch(getObject());
  };
  useEffect(() => {
    if (tagsByObject && tagsByObject.length > 0) {
      setSelectedTag(tagsByObject[0]);
    }
  }, [tagsByObject])

  useEffect(() => {
    initital();
    dispatch(fetchAllHealthTests());
    dispatch(fetchAllListPost());
  }, [dispatch]);

  // Sort posts by 'createdAt' and limit to 4
  const sortedPosts = posts
    ? [...posts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
    : [];

  return (
    <div className="bg-[#EDF0F3] text-gray-900">
      <Header />

      {/* Banner */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Banner (8/12) */}
          <div className="w-full lg:w-2/3">
            <Banner
              data={[
                "https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_Web_PC_1610x492_ba2ba6f811.png",
                "https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_web_PC_b1cd389f86.png",
                "https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/web_PC_1610x492_84aa59fcfb.jpg",
                "https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_Web_PC_1610x492_8b230abeb8.png",
                "https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/homepageweb_PC_dbf43baf7b.jpg",
                "https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Telfast_Phospholugel_banner_web_PC_bed811377b.png",
              ]}
            />
          </div>
          {/* Side Banners (4/12) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <Banner
              data={[
                "https://cdn.nhathuoclongchau.com.vn/unsafe/425x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/399x117_1_3d5f4d9c5d.png",
                "https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/1610x492_Banner_WEB_628d06fb5b.png",
              ]}
            />
            <Banner
              data={[
                "https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_Web_PC_1610x492_8b230abeb8.png",
                "https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_Web_PC_1610x492_ba2ba6f811.png",
              ]}
            />
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {menus.map((menu) => (
            <div
              onClick={menu.onPress}
              key={menu.id}
              className="flex bg-white items-center px-4 py-3 cursor-pointer rounded-lg hover:shadow-md transition"
            >
              <img
                src={menu.icon}
                alt={menu.title}
                className="h-8 w-8 sm:h-10 sm:w-10 mr-2"
              />
              <span className="text-sm sm:text-base font-medium">
                {menu.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand */}
      {brands && (
        <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <img
              className="mr-2 h-6"
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/thuong_hieu_yeu_thich_e0c23dded6.png"
              alt="Brands Icon"
            />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              Thương hiệu nổi bật
            </h2>
          </div>
          <Brand data={brands} />
        </div>
      )}

      {/* Category Outstanding */}
      <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-4">
          <img
            className="mr-2 h-6"
            src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/danh_muc_noi_bat_d03496597a.png"
            alt="Categories Icon"
          />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            Danh mục nổi bật
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {prominents &&
            prominents.map((category, index) => (
              <a
                href={`/filter-product?category=${category.id}`}
                key={index}
                className="flex flex-col h-[120px] sm:h-[130px] items-center py-3 px-4 rounded-lg shadow-sm bg-white hover:cursor-pointer hover:shadow-md transition"
              >
                <img
                  src={category.icon}
                  className="w-8 h-8 sm:w-9 sm:h-9 object-cover"
                  alt={category.title}
                />
                <h2 className="text-sm sm:text-base font-medium mt-2 text-center">
                  {category.title}
                </h2>
                <h3 className="text-xs sm:text-sm text-gray-400">
                  {category.num} sản phẩm
                </h3>
              </a>
            ))}
        </div>
      </div>

      {/* Medicine Object */}
      <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-4">
          <img
            className="mr-2 h-6"
            src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/danh_muc_noi_bat_d03496597a.png"
            alt="Medicine Object Icon"
          />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            Sản phẩm theo đối tượng
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          {tagsByObject &&
            tagsByObject.map((tag) => (
              <button
                key={tag.id}
                className={`px-3 py-2 text-sm sm:text-base font-medium rounded-full ${
                  selectedTag && selectedTag.id === tag.id
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag.title}
              </button>
            ))}
        </div>
        {selectedTag && <TagByObject data={selectedTag.medicines} />}
      </div>

      {/* Policies */}
      <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {policies.map((policy) => (
            <div key={policy.id} className="flex flex-col items-center">
              <img
                src={policy.logo}
                alt={policy.title}
                className="h-12 w-12 sm:h-15 sm:w-15"
              />
              <h2 className="text-sm sm:text-base font-semibold mt-2 text-center">
                {policy.title}
              </h2>
              <h3 className="text-xs sm:text-sm text-gray-400 mt-2 text-center">
                {policy.des}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Health Tests - Horizontal Scroll */}
      <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4">
          Các bài kiểm tra sức khỏe
        </h2>
        <div
          className="relative bg-cover bg-center bg-blue-500 p-4 rounded-lg"
          style={{
            backgroundImage:
              "url('https://cdn.nhathuoclongchau.com.vn/unsafe/1440x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Kiem_tra_suc_khoe_27634e751f.jpg')",
            height: "230px",
          }}
        >
          <div
            ref={containerRef}
            className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {healthTests.map((test) => (
              <div
                key={test.id}
                className="bg-white p-3 sm:p-4 rounded-lg shadow-md w-[200px] sm:w-[250px] flex-shrink-0 snap-center"
              >
                <img
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/96x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/ic_tien_dai_thao_duong_688b8d7cde.png"
                  alt={test.testName}
                  className="w-12 h-12 sm:w-14 sm:h-14 mb-3 mx-auto"
                />
                <h3 className="text-sm sm:text-base font-semibold text-center">
                  {test.testName}
                </h3>
                <button
                  onClick={() => navigate(`/health-check/${test.id}`)}
                  className="text-blue-600 text-sm sm:text-base font-semibold hover:underline w-full text-center"
                >
                  Bắt đầu
                </button>
              </div>
            ))}
          </div>
          {/* Scroll Arrows */}
          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 text-2xl bg-gray-700 text-white p-1 sm:p-2 rounded-full"
            onClick={scrollLeft}
          >
            ‹
          </button>
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-2xl bg-gray-700 text-white p-1 sm:p-2 rounded-full"
            onClick={scrollRight}
          >
            ›
          </button>
        </div>
      </div>

      {/* Posts Section */}
      <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-4">
          <img
            src="https://cdn.nhathuoclongchau.com.vn/unsafe/64x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/goc_suc_khoe_77c4d4524f.png"
            alt="Góc sức khỏe Icon"
            className="w-6 h-6 sm:w-8 sm:h-8 mr-2"
          />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            Góc sức khỏe
          </h2>
          <span className="mx-2">|</span>
          <a href="/news" className="text-blue-600 text-sm sm:text-base hover:underline">
            Xem tất cả
          </a>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 bg-blue-200 p-4 rounded-lg">
          {/* Left Image Section */}
          <div className="w-full lg:w-2/3">
            <img
              src="https://cdn.nhathuoclongchau.com.vn/unsafe/860x456/https://cms-prod.s3-sgn09.fptcloud.com/Mat_tien_1_0f879faa8d.jpg"
              alt="Health Section Image"
              className="w-full h-auto rounded-lg shadow-md"
            />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mt-4">
              NHÀ THUỐC Cardio Track TỰ HÀO TRIỂN KHAI MÔ HÌNH ĐẠI LÝ DỊCH VỤ CÔNG TRỰC TUYẾN TRÊN ĐỊA BÀN...
            </h2>
          </div>
          {/* Right Posts Section */}
          <div className="w-full lg:w-1/3">
            {sortedPosts && sortedPosts.length > 0 ? (
              <div
                className="flex flex-col overflow-y-auto space-y-4 max-h-[400px] sm:max-h-[500px]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style>
                  {`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}
                </style>
                {sortedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white p-3 sm:p-4 rounded-lg shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={post.imgTitle}
                        alt={post.title}
                        className="w-20 h-16 sm:w-25 sm:h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold">
                          {post.title}
                        </h3>
                        <button
                          onClick={() => navigate(`/search/${post.title}`)}
                          className="text-blue-600 text-sm sm:text-base font-semibold hover:underline"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base">Không có bài viết nào.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};