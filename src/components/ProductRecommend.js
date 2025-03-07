import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductPreview } from "./ProductPreview";

export const ProductRecommend = ({ data }) => {
    const settings = {
        slidesToShow: 6,
        arrows: true,
        infinite: false,
        padding: 30,
        centerMode: false,
        centerPadding: '30px',
    };

    return (
        <Slider {...settings}>
            {
                data.map(item => {
                    return (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <ProductPreview item={item} />
                        </div>
                    )
                })
            }
        </Slider>
    );
};