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
        centerMode: false,
        centerPadding: '30px',
        responsive: [
            {
                breakpoint: 1536, // >= 1536px
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 1280, // >= 1280px
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 1024, // >= 1024px
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768, // >= 768px (tablet)
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480, // < 480px (mobile)
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    return (
        <Slider {...settings}>
            {data.map((item) => (
                <div key={item.id} className="flex justify-start">
                    <ProductPreview item={item} />
                </div>
            ))}
        </Slider>
    );
};
