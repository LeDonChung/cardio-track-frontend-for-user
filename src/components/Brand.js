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
    };

    return (
        <Slider {...settings}>
            {
                data.map(item => {
                    return (
                        <div className="px-2 rounded-lg overflow-hidden" key={item.id}>
                            <a href="/" className="bg-white block">
                                <img src={item.image} className="w-full h-36" />
                            </a>
                        </div>
                    )
                })
            }
        </Slider>
    );
};

