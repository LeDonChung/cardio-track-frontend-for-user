import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Banner = ( {data} ) => {
  const settings = {
    infinite: true, 
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Slider {...settings} className="rounded-lg overflow-hidden"> 
    {
        data.map(item => {
            return ( 
                <img key={item} src={item} className="w-full"/>
            )
        })
    }
    </Slider>
  );
};

