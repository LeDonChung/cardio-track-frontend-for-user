import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Banner } from "../components/Banner";
import { Brand } from "../components/Brand";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../redux/slice/BrandSlice";
import { useEffect, useState } from "react";
import { getProminents } from "../redux/slice/CategorySlice";
import { getObject } from "../redux/slice/TagSlice";
import { TagByObject } from "../components/TagByObject";
import { setIsChatOpen } from "../redux/slice/ChatSlice";
import { fetchAllHealthTests } from "../redux/slice/HealthCheckSlice";
import React from "react";


const policiesInit = [
    {
        id: "policy1",
        logo: '/policy/ic_policy_1.png',
        title: 'Thuốc chính hãng',
        des: "đa dạng và chuyên sâu"
    },
    {
        id: "policy2",
        logo: '/policy/ic_policy_2.png',
        title: 'Đổi trả trong 30 ngày',
        des: "kể từ ngày mua hàng"

    },
    {
        id: "policy3",
        logo: '/policy/ic_policy_3.png',
        title: 'Cam kết 100%',
        des: "chất lượng sản phẩm"

    },
    {
        id: "policy4",
        logo: '/policy/ic_policy_4.png',
        title: 'Miễn phí vận chuyển',
        des: "theo chính sách giao hàng"

    }
]
export const HomePage = () => {
    const navigate = useNavigate();

    //thêm vào để sd 2 nút cuộn trái phải
    const [scrollPosition, setScrollPosition] = useState(0); 
    const containerRef = React.createRef(); 
  
    // Function to scroll to the left
    const scrollLeft = () => {
      if (containerRef.current) {
        containerRef.current.scrollLeft -= 500; //tốc độc cuộn
        setScrollPosition(containerRef.current.scrollLeft);
      }
    };
  
    // Function to scroll to the right
    const scrollRight = () => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += 500; 
        setScrollPosition(containerRef.current.scrollLeft);
      }
    };
    const isChatOpen = useSelector(state => state.chat.isChatOpen);
    const menus = [
        {
            id: 'menu1',
            icon: 'https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/canmuathuoc_29bf521996.png',
            title: 'Cần mua thuốc',
            onPress: () => {
                navigate('/filter-product')
            },
        },
        {
            id: 'menu2',
            icon: 'https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/tuvanvoiduocsi_1855320b40.png',
            title: 'Tư vấn với Dược Sỹ',
            onPress: () => { 
                dispatch(setIsChatOpen(true))
            },
        },
        {
            id: 'menu4',
            icon: 'https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/doncuatoi_5058ac6058.png',
            title: 'Đơn của tôi',
            onPress: () => { 
                navigate('/user')
             },
        },
        {
            id: 'menu5',
            icon: 'https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/vaccine_013e37b079.png',
            title: 'Tiêm vắc xin',
            onPress: () => { },
        },
        {
            id: 'menu6',
            icon: 'https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/kiemtrasuckhoe_15f6ff48e9.png',
            title: 'Kiểm tra sức khỏe',
            onPress: () => { },
        }
    ]
    const brands = useSelector(state => state.brand.brands);
    const dispatch = useDispatch();
    const initital = async () => {
        await dispatch(getBrands());
        await dispatch(getProminents());
        await dispatch(getObject());
        setSelectedTag(tagsByObject[0]); 
    }

    const prominents = useSelector(state => state.category.prominents);

    const tagsByObject = useSelector(state => state.tag.tagsByObject);

    const [selectedTag, setSelectedTag] = useState(tagsByObject[0]);

    const [policies] = useState(policiesInit); 

    const { healthTests } = useSelector((state) => state.healthcheck);
    useEffect(() => {
        initital();
        dispatch(fetchAllHealthTests());
    }, [dispatch])




    return (
        <div className="bg-[#EDF0F3] text-gray-900">
            <Header />
            {/* Banner */}
            <div className="container mx-auto ">
                <div className="flex">
                    {/* Phần 8/12 */}
                    <div className="w-2/3 mr-4">
                        <Banner data={[
                            'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_Web_PC_1610x492_ba2ba6f811.png',
                            'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_web_PC_b1cd389f86.png',
                            'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/web_PC_1610x492_84aa59fcfb.jpg',
                            'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_Web_PC_1610x492_8b230abeb8.png',
                            'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/homepageweb_PC_dbf43baf7b.jpg',
                            'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Telfast_Phospholugel_banner_web_PC_bed811377b.png'
                        ]} />
                    </div>

                    {/* Phần 4/12 */}
                    <div className="w-1/3">
                        <div className="mb-2">
                            <Banner data={[
                                'https://cdn.nhathuoclongchau.com.vn/unsafe/425x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/399x117_1_3d5f4d9c5d.png',
                                'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/1610x492_Banner_WEB_628d06fb5b.png'
                            ]} />
                        </div>
                        <div className="mt-2">
                            <Banner data={[
                                'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_Web_PC_1610x492_8b230abeb8.png',
                                'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Banner_Web_PC_1610x492_ba2ba6f811.png'
                            ]} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Menu */}
            <div className="container mx-auto my-4">
                <div className="flex items-center justify-between">
                    {
                        menus && menus.map(menu => {
                            return (
                                <div onClick={menu.onPress} key={menu.id} className="flex bg-white items-center px-6 py-2 cursor-pointer rounded-lg">
                                    <img src={menu.icon} alt="Thera Care Logo" className="h-10 w-10 mr-2" />
                                    <span className="text-custom-size font-medium mt-2">{menu.title}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* Brand */}
            {
                brands && (
                    <div>
                        <div className="container mx-auto my-4">
                            <div className="">
                                <div className="flex items-center">
                                    <div className="flex items-center">
                                        <img className="mr-2" src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/thuong_hieu_yeu_thich_e0c23dded6.png" />
                                        <h2 className="text-[20px] font-semibold">Thương hiệu nổi bật</h2>
                                    </div>
                                </div>
                                <div className="w-full my-5">
                                    <Brand  data={brands} />
                                </div>
                            </div>
                        </div>

                    </div>
                )
            }


            {/* Category Outstanding */}
            <div>
                <div className="container mx-auto my-4">
                    <div className="">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <img className="mr-2" src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/danh_muc_noi_bat_d03496597a.png" />
                                <h2 className="text-[20px] font-semibold">Danh mục nổi bật</h2>
                            </div>
                        </div>
                        <div className="w-full my-5 grid grid-cols-6 gap-4">
                            {prominents && prominents.map((category, index) => (
                                <div key={index} className="flex flex-col h-[130px] items-center py-3 px-4 justify-between rounded-lg shadow-sm bg-white hover:cursor-pointer" >
                                    <img src={category.icon} className="w-9 h-9 object-cover" />
                                    <h2 className="text-custom-size font-medium mt-2 text-center">{category.title}</h2>
                                    <h3 className="text-gray-400">{category.num} sản phẩm </h3>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>

            </div>


            {/* Medicine Object */}
            <div className="container mx-auto my-4">
                <div className="">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <img className="mr-2" src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/danh_muc_noi_bat_d03496597a.png" />
                            <h2 className="text-[20px] font-semibold">Sản phẩm theo đối tượng</h2>
                        </div>
                        <div className="my-5">
                            <div className="flex space-x-4">
                                {tagsByObject && tagsByObject.map((tag) => (
                                    <button
                                        key={tag}
                                        className={`px-4 py-2 font-medium rounded-full ${selectedTag && selectedTag.id === tag.id ? "bg-blue-600 text-white" : "bg-white"
                                            }`}
                                        onClick={() => setSelectedTag(tag)}
                                    >
                                        {tag.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full my-5">
                        {
                            selectedTag &&
                            <TagByObject data={selectedTag.medicines} />
                        }
                    </div>
                </div>
            </div>

            {/* Policies */} 
            <div className="container mx-auto my-4">
                <div className="grid grid-cols-4 gap-4">
                    {policies.map(policy => {
                        return (
                            <div key={policy.id} className="flex flex-col items-center">
                                <img
                                    src={policy.logo}
                                    alt="Thera Care Logo"
                                    className="h-15 w-15"
                                />
                                <h2 className="text-custom-size font-semibold mt-2">{policy.title}</h2>
                                <h3 className="text-gray-400 mt-2 text-center">{policy.des}</h3>
                            </div>
                        )
                    })}
                </div>
            </div>

          {/* Health Tests - Horizontal Scroll */}
      <div className="container mx-auto my-6">
        <h2 className="text-2xl font-semibold mb-4">Các bài kiểm tra sức khỏe</h2>
          {/* Background container */}
        <div className="relative bg-cover bg-center bg-blue-500 p-4 rounded-lg" style={{ backgroundImage: "url('https://cdn.nhathuoclongchau.com.vn/unsafe/1440x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/Kiem_tra_suc_khoe_27634e751f.jpg')", height:"230px" }}>
          <div
            ref={containerRef}
            className="flex overflow-x-auto space-x-6 pb-4"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE and Edge
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            {healthTests.map((test) => (
              <div key={test.id} className="bg-white p-4 rounded-lg shadow-md w-[250px] flex-shrink-0" >
                <img
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/96x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/ic_tien_dai_thao_duong_688b8d7cde.png"
                  alt={test.testName}
                  className="w-14 h-14 mb-3 mx-auto"
                />
                <h3 className="text-base font-semibold text-center">{test.testName}</h3>
                <button
                  onClick={() => navigate(`/health-check/${test.id}`)}
                  className="text-blue-600 font-semibold hover:underline w-full text-center"
                >
                  Bắt đầu
                </button>
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-3xl bg-gray-700 text-white p-2 rounded-full"
            onClick={scrollLeft}
          >
            &#8249;
          </button>

          {/* Right Arrow */}
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-3xl bg-gray-700 text-white p-2 rounded-full"
            onClick={scrollRight}
          >
            &#8250;
          </button>
        </div>
      </div>






            <Footer />
        </div>

    )
}