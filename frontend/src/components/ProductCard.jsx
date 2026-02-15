import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const ProductCard = ({ product ,edit}) => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div
      onClick={() => navigate(`/product/${product?._id}`)}
      className="w-[250px] bg-gray-100  relative p-3 rounded-xl"
    >
      <Slider {...settings}>
        {product?.images?.map((image, i) => (
          <div key={i} className="bg-gray-100">
            <img src={image.url} alt="" className="w-full h-[200px] object-cover rounded-lg" />
          </div>
        ))}
      </Slider>
      <div className=" text-xl  px-3">{product?.name}</div>
      <div className=" text-2xl px-3 ">{product?.price} ₺ </div>
      { 
   edit && 
   <div className=' absolute top-1 right-1 bg-white  shadow-gray-300  rounded-full p-2 flex gap-2 items-center justify-center '>
    <AiFillEdit size={24} />
    <MdDelete size={24} />
    </div>
      
      }
    </div>
  );
};

export default ProductCard;
