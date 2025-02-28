import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { calculateSalePrice, formatPrice } from "../utils/AppUtils";
import { ProductPreview } from "./ProductPreview";

export const TagByObject = ({ data }) => {
    const settings = {
        slidesToShow: 6,
        arrows: true,
        infinite: false,
        padding: 30,
        centerPadding: '30px',
    };

    return (
        <Slider {...settings}>
            {
                data.map(item => {
                    return (
                        <div className="pr-10">
                            <ProductPreview item={item} />
                        </div>
                    )
                })
            }
        </Slider>
    );
};

