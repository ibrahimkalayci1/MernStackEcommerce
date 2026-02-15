import React from 'react';

const Button = ({ name, onClick }) => {
  return (
    <button
      className=" w-full h-10 flex items-center  justify-center text-lg bg-black text-white rounded-md "
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
