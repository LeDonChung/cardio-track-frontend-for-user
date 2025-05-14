import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Brand = ({ data }) => {
    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            {
                breakpoint: 1280, // >=1024 and <1280
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 1024, // >=768 and <1024
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768, // >=640 and <768
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640, // <640 (mobile)
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <Slider {...settings}>
            {
                data.map(item => (
                    <div className="px-2 rounded-lg overflow-hidden" key={item.id}>
                        <a href="/" className="bg-white block">
                            <img src={item.image} className="w-full h-36 object-contain" alt="Brand" />
                        </a>
                    </div>
                ))
            }
        </Slider>
    );
};
