import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductPreview } from "./ProductPreview";

export const TagByObject = ({ data }) => {
    const settings = {
        slidesToShow: 6,
        arrows: true,
        infinite: false,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                }, 
            },
        ],
    };

    return (
        <Slider {...settings}>
            {
                data.map((item, index) => (
                    <div className="pr-4" key={item.id || index}>
                        <ProductPreview item={item} />
                    </div>
                ))
            }
        </Slider>
    );
};
