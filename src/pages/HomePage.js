import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { Banner } from "../components/Banner";
import { Brand } from "../components/Brand";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../redux/slice/BrandSlice";
import { useEffect } from "react";
const menus = [
    {
        id: 'menu1',
        icon: 'https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/canmuathuoc_29bf521996.png',
        title: 'Cần mua thuốc',
        onPress: () => { },
    },
    {
        id: 'menu2',
        icon: 'https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/tuvanvoiduocsi_1855320b40.png',
        title: 'Tư vấn với Dược Sỹ',
        onPress: () => { },
    },
    {
        id: 'menu3',
        icon: 'https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/timnhathuoc_cbadb52c85.png',
        title: 'Tìm nhà thuốc',
        onPress: () => { },
    },
    {
        id: 'menu4',
        icon: 'https://cdn.nhathuoclongchau.com.vn/unsafe/40x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/doncuatoi_5058ac6058.png',
        title: 'Đơn của tôi',
        onPress: () => { },
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

export const HomePage = () => {
    const brands = useSelector(state => state.brand.brands);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initital = async () => {
        await dispatch(getBrands());
    }
 

    useEffect(() => {
        initital();
    }, [])

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
                        menus.map(menu => {
                            return (
                                <div key={menu.id} className="flex bg-white items-center px-6 py-2 cursor-pointer rounded-lg">
                                    <img src={menu.icon} alt="Thera Care Logo" className="h-10 w-10 mr-2" />
                                    <span className="text-custom-size font-medium mt-2">{menu.title}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* Brand */}
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
                            <Brand data={brands} />
                        </div>
                    </div>
                </div>

            </div>


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
                        <div className="w-full my-5">
                            
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>

    )
}