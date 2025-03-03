import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faAngleDown, faAngleUp, faSearch, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getBrandFilter, getCategoryByLevelFilter, getTagByObjectFilter, searchData, setFilter, setPageData } from "../redux/slice/FilterSlice";
import { ProductPreview } from "../components/ProductPreview";
import { useParams, useSearchParams } from "react-router-dom";

export const FilterProductPage = () => {
    const [searchParams] = useSearchParams();

    const key = searchParams.get("key");
    const category = searchParams.get("category");


    const dispatch = useDispatch();

    const [showCategory, setShowCategory] = useState(false);
    const [showObject, setShowObject] = useState(false);
    const [showBrand, setShowBrand] = useState(false);

    const [categorySelected, setCategorySelected] = useState(() => {
        if (category) {
            return [{ id: parseInt(category), title: "Tất cả" }];
        }
        return [{ id: 0, title: "Tất cả" }];
    });
    const [brandSelected, setBrandSelected] = useState([{ id: 0, title: "Tất cả" }]);
    const [objectSelected, setObjectSelected] = useState([{ id: 0, title: "Tất cả" }]);

    const filterCategories = useSelector(state => state.filter.filterCategories);
    const filterBrands = useSelector(state => state.filter.filterBrands);
    const filterObjects = useSelector(state => state.filter.filterObjects);
    const pageData = useSelector(state => state.filter.pageData);
    const data = useSelector(state => state.filter.data);
    const search = useSelector(state => state.filter.search);


    const [categoryLimit, setCategoryLimit] = useState(5);
    const [objectLimit, setObjectLimit] = useState(5);
    const [brandLimit, setBrandLimit] = useState(5);

    const [searchCategory, setSearchCategory] = useState("");
    const [searchObject, setSearchObject] = useState("");
    const [searchBrand, setSearchBrand] = useState("");

    const chooseSortBy = [{ id: 0, title: "Giá thấp" }, { id: 1, title: "Giá cao" }];
    const [priceSelected, setPriceSelected] = useState(chooseSortBy[0]);

    const salePrices = [{ id: 0, title: "Dưới 100.000đ" }, { id: 1, title: "100.000đ đến 300.000đ" }, { id: 2, title: "300.000đ đến 500.000đ" }, { id: 3, title: "Trên 500.000đ" }];
    const [salePriceSelected, setSalePriceSelected] = useState(salePrices[0]);

    


    const handlerActionSearch = async () => {
        let XpriceFrom = null;
        let XpriceTo = null;
        switch (salePriceSelected.id) {
            case 0:
                XpriceFrom = 0;
                XpriceTo = 100000;
                break;
            case 1:
                XpriceFrom = 100000;
                XpriceTo = 300000;
                break;
            case 2:
                XpriceFrom = 300000;
                XpriceTo = 500000;
                break;
            case 3:
                XpriceFrom = 500000;
                XpriceTo = null;
                break;
        }

        let XcategorySelected = []
        XcategorySelected = categorySelected.filter(item => item.id !== 0);

        let XobjectSelected = []
        XobjectSelected = objectSelected.filter(item => item.id !== 0);

        let XbrandSelected = []
        XbrandSelected = brandSelected.filter(item => item.id !== 0);

        const searchX = {
            key: key ? key : "",
            categories: XcategorySelected.map(item => item.id),
            brands: XbrandSelected.map(item => item.id),
            objects: XobjectSelected.map(item => item.id),
            priceFrom: XpriceFrom,
            priceTo: XpriceTo
        }

        dispatch(setFilter(searchX));

        await dispatch(searchData({
            page: pageData.page,
            size: pageData.size,
            sortBy: "price",
            sortName: priceSelected.id === 0 ? "ASC" : "DESC",
            searchData: searchX
        }));
    };
    useEffect(() => {
        handlerActionSearch();
    }, [categorySelected, objectSelected, brandSelected, priceSelected, salePriceSelected, pageData.size]);

    // tôi muốn đứng ở trang này gọi lại đúng trang này sẽ load lại dữ liệu
    useEffect(() => {
        dispatch(getCategoryByLevelFilter());
        dispatch(getBrandFilter());
        dispatch(getTagByObjectFilter());
    }, []);

    const toggleSelection = (value, setFunction, selectedValues) => {
        if (value.id === 0) {
            setFunction([{ id: 0, title: "Tất cả" }]);
        } else {
            const filteredSelected = selectedValues.filter(item => item.id !== 0);
            if (filteredSelected.some(item => item.id === value.id)) {
                const updatedSelection = filteredSelected.filter(item => item.id !== value.id);
                setFunction(updatedSelection.length ? updatedSelection : [{ id: 0, title: "Tất cả" }]);
            } else {
                setFunction([...filteredSelected, value]);
            }
        }
    };

    const filterList = (list, searchTerm) => {
        return list.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    return (
        <div className="bg-gray-100 text-gray-900">
            <Header />
            <div className="container mx-auto mt-5">
                <div className="p-4 bg-white my-5 rounded-xl">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faCircleDot} color="#2563eb" className="mr-2" />
                        <p className="font-bold">Sản phẩm</p>
                    </div>
                    <p className="font-medium">Tìm thấy {data.lenght} sản phẩm</p>
                </div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-4 p-4 bg-white rounded-xl">
                        <div className="w-full h-[50px] border-b border-gray-200 flex items-center">
                            <FontAwesomeIcon icon={faFilter} size="24" className="text-xl mx-[20px]" />
                            <span className="font-medium">Bộ lọc nâng cao</span>
                        </div>

                        {/* Bộ lọc Category */}
                        <div className="w-full mt-[10px]">
                            <div className="flex items-center justify-between w-full h-[30px] mx-[10px]" onClick={() => setShowCategory(!showCategory)}>
                                <p className="font-medium">Loại sản phẩm</p>
                                <FontAwesomeIcon icon={showCategory ? faAngleUp : faAngleDown} size="24" className="text-2xl mx-[20px]" />
                            </div>
                            {showCategory && (
                                <div className="mx-[10px] my-[10px]">
                                    <div className="relative mb-2">
                                        <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm theo tên"
                                            className="pl-8 p-1 w-full border rounded"
                                            value={searchCategory}
                                            onChange={(e) => setSearchCategory(e.target.value)}
                                        />
                                    </div>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={categorySelected.some(item => item.id === 0)}
                                            onChange={() => toggleSelection({ id: 0, title: "Tất cả" }, setCategorySelected, categorySelected)}
                                            className="mr-2"
                                        />
                                        Tất cả
                                    </label>
                                    {filterList(filterCategories, searchCategory).slice(0, categoryLimit).map(item => (
                                        <label key={item.id} className="flex items-center cursor-pointer py-1 ">
                                            <input type="checkbox" checked={categorySelected.some(selected => selected.id === item.id)} onChange={() => toggleSelection(item, setCategorySelected, categorySelected)} className="mr-2" />
                                            {item.title}
                                        </label>
                                    ))}
                                    {categoryLimit < filterList(filterCategories, searchCategory).length && (
                                        <button onClick={() => setCategoryLimit(prev => prev + 5)} className="text-blue-500 text-sm mt-2">Xem thêm...</button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bộ lọc Object */}
                        <div className="w-full mt-[10px]">
                            <div className="flex items-center justify-between w-full h-[30px] mx-[10px]" onClick={() => setShowObject(!showObject)}>
                                <p className="font-medium">Đối tượng</p>
                                <FontAwesomeIcon icon={showObject ? faAngleUp : faAngleDown} size="24" className="text-2xl mx-[20px]" />
                            </div>
                            {showObject && (
                                <div className="mx-[10px] my-[10px]">
                                    <div className="relative mb-2">
                                        <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            className="pl-8 p-1 w-full border rounded"
                                            value={searchObject}
                                            onChange={(e) => setSearchObject(e.target.value)}
                                        />
                                    </div>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={objectSelected.some(item => item.id === 0)}
                                            onChange={() => toggleSelection({ id: 0, title: "Tất cả" }, setObjectSelected, objectSelected)}
                                            className="mr-2"
                                        />
                                        Tất cả
                                    </label>
                                    {filterList(filterObjects, searchObject).slice(0, objectLimit).map(item => (
                                        <label key={item.id} className="flex items-center cursor-pointer">
                                            <input type="checkbox" checked={objectSelected.some(selected => selected.id === item.id)} onChange={() => toggleSelection(item, setObjectSelected, objectSelected)} className="mr-2" />
                                            {item.title}
                                        </label>
                                    ))}
                                    {objectLimit < filterList(filterObjects, searchObject).length && (
                                        <button onClick={() => setObjectLimit(prev => prev + 5)} className="text-blue-500 text-sm mt-2">Xem thêm...</button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bộ lọc giá */}
                        <div className="w-full mt-[10px]">
                            <div className="flex items-center justify-between w-full h-[30px] mx-[10px]">
                                <p className="font-medium">Giá sản phẩm</p>
                            </div>
                            <div className="mx-[10px] my-[10px]">
                                {
                                    salePrices.map((item, index) => {
                                        return (
                                            <div onClick={() => setSalePriceSelected(item)} className={"flex justify-center rounded-full py-4 border mb-3 cursor-pointer" + (item.id === salePriceSelected.id ? "border border-blue-600" : "")}>
                                                <span>
                                                    {item.title}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        {/* Bộ lọc Brand */}
                        <div className="w-full mt-[10px]">
                            <div className="flex items-center justify-between w-full h-[30px] mx-[10px]" onClick={() => setShowBrand(!showBrand)}>
                                <p className="font-medium">Thương hiệu</p>
                                <FontAwesomeIcon icon={showBrand ? faAngleUp : faAngleDown} size="24" className="text-2xl mx-[20px]" />
                            </div>
                            {showBrand && (
                                <div className="mx-[10px] my-[10px]">
                                    <div className="relative mb-2">
                                        <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            className="pl-8 p-1 w-full border rounded"
                                            value={searchBrand}
                                            onChange={(e) => setSearchBrand(e.target.value)}
                                        />
                                    </div>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={brandSelected.some(item => item.id === 0)}
                                            onChange={() => toggleSelection({ id: 0, title: "Tất cả" }, setBrandSelected, brandSelected)}
                                            className="mr-2"
                                        />
                                        Tất cả
                                    </label>
                                    {filterList(filterBrands, searchBrand).slice(0, objectLimit).map(item => (
                                        <label key={item.id} className="flex items-center cursor-pointer">
                                            <input type="checkbox" checked={brandSelected.some(selected => selected.id === item.id)} onChange={() => toggleSelection(item, setBrandSelected, brandSelected)} className="mr-2" />
                                            {item.title}
                                        </label>
                                    ))}
                                    {objectLimit < filterList(filterBrands, searchBrand).length && (
                                        <button onClick={() => setObjectLimit(prev => prev + 5)} className="text-blue-500 text-sm mt-2">Xem thêm...</button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div class="col-span-8 p-4 rounded-xl" >
                        <div className="flex items-center justify-between">
                            <h1 className="font-bold">Danh sách sản phẩm</h1>
                            <div className="flex items-center">
                                <h1 className="mr-4">Sắp xếp theo</h1>
                                {
                                    chooseSortBy && chooseSortBy.map((item, index) => (
                                        <button key={index} className={"bg-white py-1 px-4 border rounded-full mr-4 " + (priceSelected.id === item.id ? "border-blue-600 text-blue-600" : "text-gray-600 border-gray-600")} onClick={() => setPriceSelected(item)}>
                                            {item.title}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {
                                data && data.map((item, index) => (
                                    <div>
                                        <ProductPreview item={item} />
                                    </div>
                                ))
                            }
                        </div>
                        <div>
                            {
                                pageData.totalPage > 1 ? (
                                    <button className="flex items-center py-4 my-4 justify-center w-full" onClick={() => {
                                        dispatch(setPageData({ ...pageData, size: pageData.size + 16 }));
                                    }}>
                                        <svg width="20" height="20" class="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.9516 10.4793C19.2944 10.8392 19.2806 11.4088 18.9207 11.7517L12.6201 17.7533C12.2725 18.0844 11.7262 18.0844 11.3786 17.7533L5.07808 11.7517C4.71818 11.4088 4.70433 10.8392 5.04716 10.4793C5.38999 10.1193 5.95967 10.1055 6.31958 10.4483L11.9994 15.8586L17.6792 10.4483C18.0391 10.1055 18.6088 10.1193 18.9516 10.4793ZM18.9516 5.67926C19.2944 6.03916 19.2806 6.60884 18.9207 6.95167L12.6201 12.9533C12.2725 13.2844 11.7262 13.2844 11.3786 12.9533L5.07808 6.95167C4.71818 6.60884 4.70433 6.03916 5.04716 5.67926C5.38999 5.31935 5.95967 5.3055 6.31958 5.64833L11.9994 11.0586L17.6792 5.64833C18.0391 5.30551 18.6088 5.31935 18.9516 5.67926Z" fill="currentColor"></path></svg>
                                        Xem thêm
                                    </button>
                                ) : (
                                    <p className="flex items-center py-4 my-4 justify-center w-full" onClick={() => {

                                    }}>
                                        Bạn đã xem hết danh sách
                                    </p>
                                )
                            }
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};
