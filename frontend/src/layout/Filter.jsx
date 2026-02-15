import React from 'react';

const Filter = ({ setPrice, setRating, setCategory }) => {
  const categoryList = ['Telefon', 'Laptop', 'Saat', 'Tablet', 'Kulaklık', 'Oyun Konsolu', 'Drone'];

  const ratingList = [1, 2, 3, 4, 5];

  return (
    <div className="w-[200px] mt-3 p-1">
      <div>Filtreleme</div>
      <div className="flex items-center gap-2 my-2">
        <input
          onChange={(e) => setPrice((prev) => ({ ...prev, min: e.target.value }))}
          className="border  w-16 p-1 outline-none  "
          type="number"
          placeholder="Min"
        />
        <input
          onChange={(e) => setPrice((prev) => ({ ...prev, max: e.target.value }))}
          className="border  w-16 p-1 outline-none  "
          type="number"
          placeholder="Max"
        />
      </div>
      <div className="my-2">Kategori</div>
      {categoryList.map((category, i) => (
        <div onClick={() => setCategory(category)} className="text-sm cursor-pointer" key={i}>
          {category}
        </div>
      ))}
      <hr />
      <div className="my-2">Puanlama</div>

      {ratingList.map((rating, i) => (
        <div onClick={() => setRating(rating)} className="text-sm cursor-pointer" key={i}>
          {rating}
        </div>
      ))}
    </div>
  );
};

export default Filter;
