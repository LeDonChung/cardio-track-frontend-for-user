import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faAngleDown, faAngleUp, faSearch, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getBrandFilter, getCategoryByLevelFilter, getTagByObjectFilter, searchData, setFilter, setPageData } from "../redux/slice/FilterSlice";
import { ProductPreview } from "../components/ProductPreview";
import { useSearchParams } from "react-router-dom";

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

  const filterCategories = useSelector((state) => state.filter.filterCategories);
  const filterBrands = useSelector((state) => state.filter.filterBrands);
  const filterObjects = useSelector((state) => state.filter.filterObjects);
  const pageData = useSelector((state) => state.filter.pageData);
  const data = useSelector((state) => state.filter.data);

  const [categoryLimit, setCategoryLimit] = useState(5);
  const [objectLimit, setObjectLimit] = useState(5);
  const [brandLimit, setBrandLimit] = useState(5);

  const [searchCategory, setSearchCategory] = useState("");
  const [searchObject, setSearchObject] = useState("");
  const [searchBrand, setSearchBrand] = useState("");

  const chooseSortBy = [
    { id: 0, title: "Giá thấp" },
    { id: 1, title: "Giá cao" },
  ];
  const [priceSelected, setPriceSelected] = useState(chooseSortBy[0]);

  const salePrices = [
    { id: 0, title: "Dưới 100.000đ" },
    { id: 1, title: "100.000đ đến 300.000đ" },
    { id: 2, title: "300.000đ đến 500.000đ" },
    { id: 3, title: "Trên 500.000đ" },
  ];
  const [salePriceSelected, setSalePriceSelected] = useState(null); // Allow null for "Search All"

  const handlerActionSearch = async () => {
    let XpriceFrom = null;
    let XpriceTo = null;
    if (salePriceSelected) {
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
        default:
          break;
      }
    }

    const XcategorySelected = categorySelected.filter((item) => item.id !== 0);
    const XobjectSelected = objectSelected.filter((item) => item.id !== 0);
    const XbrandSelected = brandSelected.filter((item) => item.id !== 0);

    const searchX = {
      key: key || "",
      categories: XcategorySelected.map((item) => item.id),
      brands: XbrandSelected.map((item) => item.id),
      objects: XobjectSelected.map((item) => item.id),
      priceFrom: XpriceFrom,
      priceTo: XpriceTo,
    };

    dispatch(setFilter(searchX));

    await dispatch(
      searchData({
        page: pageData.page,
        size: pageData.size,
        sortBy: "price",
        sortName: priceSelected.id === 0 ? "ASC" : "DESC",
        searchData: searchX,
      })
    );
  };

  const handleSearchAll = () => {
    setSalePriceSelected(null); // Reset price filter
    handlerActionSearch();
  };

  useEffect(() => {
    handlerActionSearch();
  }, [categorySelected, objectSelected, brandSelected, priceSelected, salePriceSelected, pageData.size]);

  useEffect(() => {
    dispatch(getCategoryByLevelFilter());
    dispatch(getBrandFilter());
    dispatch(getTagByObjectFilter());
  }, [dispatch]);

  const toggleSelection = (value, setFunction, selectedValues) => {
    if (value.id === 0) {
      setFunction([{ id: 0, title: "Tất cả" }]);
    } else {
      const filteredSelected = selectedValues.filter((item) => item.id !== 0);
      if (filteredSelected.some((item) => item.id === value.id)) {
        const updatedSelection = filteredSelected.filter((item) => item.id !== value.id);
        setFunction(updatedSelection.length ? updatedSelection : [{ id: 0, title: "Tất cả" }]);
      } else {
        setFunction([...filteredSelected, value]);
      }
    }
  };

  const filterList = (list, searchTerm) => {
    return list.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return (
    <div className="bg-gray-100 text-gray-900">
      <Header />
      <div className="container mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <div className="p-4 bg-white my-5 rounded-xl">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCircleDot} color="#2563eb" className="mr-2" />
            <p className="font-bold text-lg sm:text-xl">Sản phẩm</p>
          </div>
          <p className="font-medium text-sm sm:text-base">
            Tìm thấy {data?.length || 0} sản phẩm
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 p-4 bg-white rounded-xl">
            <div className="w-full h-[50px] border-b border-gray-200 flex items-center">
              <FontAwesomeIcon icon={faFilter} className="text-xl mx-4 sm:mx-5" />
              <span className="font-medium text-base sm:text-lg">Bộ lọc nâng cao</span>
            </div>

            {/* Bộ lọc Category */}
            <div className="w-full mt-3">
              <div
                className="flex items-center justify-between w-full h-10 mx-2 sm:mx-3 cursor-pointer"
                onClick={() => setShowCategory(!showCategory)}
              >
                <p className="font-medium text-sm sm:text-base">Loại sản phẩm</p>
                <FontAwesomeIcon
                  icon={showCategory ? faAngleUp : faAngleDown}
                  className="text-xl sm:text-2xl mx-4 sm:mx-5"
                />
              </div>
              {showCategory && (
                <div className="mx-2 sm:mx-3 my-3">
                  <div className="relative mb-3">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên"
                      className="pl-10 p-2 w-full border rounded text-sm"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                    />
                  </div>
                  <label className="flex items-center cursor-pointer text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={categorySelected.some((item) => item.id === 0)}
                      onChange={() =>
                        toggleSelection({ id: 0, title: "Tất cả" }, setCategorySelected, categorySelected)
                      }
                      className="mr-2"
                    />
                    Tất cả
                  </label>
                  {filterList(filterCategories, searchCategory)
                    .slice(0, categoryLimit)
                    .map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center cursor-pointer py-1 text-sm sm:text-base"
                      >
                        <input
                          type="checkbox"
                          checked={categorySelected.some((selected) => selected.id === item.id)}
                          onChange={() => toggleSelection(item, setCategorySelected, categorySelected)}
                          className="mr-2"
                        />
                        {item.title}
                      </label>
                    ))}
                  {categoryLimit < filterList(filterCategories, searchCategory).length && (
                    <button
                      onClick={() => setCategoryLimit((prev) => prev + 5)}
                      className="text-blue-500 text-sm mt-2"
                    >
                      Xem thêm...
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bộ lọc Object */}
            <div className="w-full mt-3">
              <div
                className="flex items-center justify-between w-full h-10 mx-2 sm:mx-3 cursor-pointer"
                onClick={() => setShowObject(!showObject)}
              >
                <p className="font-medium text-sm sm:text-base">Đối tượng</p>
                <FontAwesomeIcon
                  icon={showObject ? faAngleUp : faAngleDown}
                  className="text-xl sm:text-2xl mx-4 sm:mx-5"
                />
              </div>
              {showObject && (
                <div className="mx-2 sm:mx-3 my-3">
                  <div className="relative mb-3">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="pl-10 p-2 w-full border rounded text-sm"
                      value={searchObject}
                      onChange={(e) => setSearchObject(e.target.value)}
                    />
                  </div>
                  <label className="flex items-center cursor-pointer text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={objectSelected.some((item) => item.id === 0)}
                      onChange={() =>
                        toggleSelection({ id: 0, title: "Tất cả" }, setObjectSelected, objectSelected)
                      }
                      className="mr-2"
                    />
                    Tất cả
                  </label>
                  {filterList(filterObjects, searchObject)
                    .slice(0, objectLimit)
                    .map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center cursor-pointer py-1 text-sm sm:text-base"
                      >
                        <input
                          type="checkbox"
                          checked={objectSelected.some((selected) => selected.id === item.id)}
                          onChange={() => toggleSelection(item, setObjectSelected, objectSelected)}
                          className="mr-2"
                        />
                        {item.title}
                      </label>
                    ))}
                  {objectLimit < filterList(filterObjects, searchObject).length && (
                    <button
                      onClick={() => setObjectLimit((prev) => prev + 5)}
                      className="text-blue-500 text-sm mt-2"
                    >
                      Xem thêm...
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bộ lọc giá */}
            <div className="w-full mt-3">
              <div className="flex items-center justify-between w-full h-10 mx-2 sm:mx-3">
                <p className="font-medium text-sm sm:text-base">Giá sản phẩm</p>
              </div>
              <div className="mx-2 sm:mx-3 my-3">
                <div
                  onClick={handleSearchAll}
                  className={`flex justify-center rounded-full py-3 border mb-3 cursor-pointer text-sm sm:text-base ${
                    !salePriceSelected ? "border-blue-600 text-blue-600" : "border-gray-300"
                  }`}
                >
                  <span>Tất cả giá</span>
                </div>
                {salePrices.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSalePriceSelected(item)}
                    className={`flex justify-center rounded-full py-3 border mb-3 cursor-pointer text-sm sm:text-base ${
                      salePriceSelected?.id === item.id
                        ? "border-blue-600 text-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bộ lọc Brand */}
            <div className="w-full mt-3">
              <div
                className="flex items-center justify-between w-full h-10 mx-2 sm:mx-3 cursor-pointer"
                onClick={() => setShowBrand(!showBrand)}
              >
                <p className="font-medium text-sm sm:text-base">Thương hiệu</p>
                <FontAwesomeIcon
                  icon={showBrand ? faAngleUp : faAngleDown}
                  className="text-xl sm:text-2xl mx-4 sm:mx-5"
                />
              </div>
              {showBrand && (
                <div className="mx-2 sm:mx-3 my-3">
                  <div className="relative mb-3">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="pl-10 p-2 w-full border rounded text-sm"
                      value={searchBrand}
                      onChange={(e) => setSearchBrand(e.target.value)}
                    />
                  </div>
                  <label className="flex items-center cursor-pointer text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={brandSelected.some((item) => item.id === 0)}
                      onChange={() =>
                        toggleSelection({ id: 0, title: "Tất cả" }, setBrandSelected, brandSelected)
                      }
                      className="mr-2"
                    />
                    Tất cả
                  </label>
                  {filterList(filterBrands, searchBrand)
                    .slice(0, brandLimit)
                    .map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center cursor-pointer py-1 text-sm sm:text-base"
                      >
                        <input
                          type="checkbox"
                          checked={brandSelected.some((selected) => selected.id === item.id)}
                          onChange={() => toggleSelection(item, setBrandSelected, brandSelected)}
                          className="mr-2"
                        />
                        {item.title}
                      </label>
                    ))}
                  {brandLimit < filterList(filterBrands, searchBrand).length && (
                    <button
                      onClick={() => setBrandLimit((prev) => prev + 5)}
                      className="text-blue-500 text-sm mt-2"
                    >
                      Xem thêm...
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-8 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <h1 className="font-bold text-lg sm:text-xl mb-2 sm:mb-0">Danh sách sản phẩm</h1>
              <div className="flex items-center">
                <h1 className="mr-4 text-sm sm:text-base">Sắp xếp theo</h1>
                {chooseSortBy.map((item) => (
                  <button
                    key={item.id}
                    className={`bg-white py-1 px-3 sm:px-4 border rounded-full mr-2 sm:mr-4 text-sm sm:text-base ${
                      priceSelected.id === item.id
                        ? "border-blue-600 text-blue-600"
                        : "text-gray-600 border-gray-600"
                    }`}
                    onClick={() => setPriceSelected(item)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {data?.map((item) => (
                <div key={item.id}>
                  <ProductPreview item={item} />
                </div>
              ))}
            </div>
            <div>
              {pageData.totalPage > 1 ? (
                <button
                  className="flex items-center py-4 my-4 justify-center w-full text-sm sm:text-base"
                  onClick={() => {
                    dispatch(setPageData({ ...pageData, size: pageData.size + 16 }));
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    className="mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9516 10.4793C19.2944 10.8392 19.2806 11.4088 18.9207 11.7517L12.6201 17.7533C12.2725 18.0844 11.7262 18.0844 11.3786 17.7533L5.07808 11.7517C4.71818 11.4088 4.70433 10.8392 5.04716 10.4793C5.38999 10.1193 5.95967 10.1055 6.31958 10.4483L11.9994 15.8586L17.6792 10.4483C18.0391 10.1055 18.6088 10.1193 18.9516 10.4793ZM18.9516 5.67926C19.2944 6.03916 19.2806 6.60884 18.9207 6.95167L12.6201 12.9533C12.2725 13.2844 11.7262 13.2844 11.3786 12.9533L5.07808 6.95167C4.71818 6.60884 4.70433 6.03916 5.04716 5.67926C5.38999 5.31935 5.95967 5.3055 6.31958 5.64833L11.9994 11.0586L17.6792 5.64833C18.0391 5.30551 18.6088 5.31935 18.9516 5.67926Z"
                      fill="currentColor"
                    />
                  </svg>
                  Xem thêm
                </button>
              ) : (
                <p className="flex items-center py-4 my-4 justify-center w-full text-sm sm:text-base">
                  Bạn đã xem hết danh sách
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};