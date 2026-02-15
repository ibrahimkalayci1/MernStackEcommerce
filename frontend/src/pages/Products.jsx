import React, { useEffect, useState } from 'react';
import Filter from '../layout/Filter';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import ReactPaginate from 'react-paginate';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { keyword } = useSelector((state) => state.general);
  const [price, setPrice] = useState({ min: 0, max: 999999 });
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');

  const [itemOffset, setItemOffset] = useState(0);

  // 🔥 önce listeyi güvene al
  const productList = products?.products || [];

  // sonra hesaplama
  const endOffset = itemOffset + 1;
  const currentItems = productList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(productList.length / 1);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * 1) % productList.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    dispatch(getProducts({ keyword, price, rating, category }));
  }, [dispatch, keyword, price, rating, category]);

  console.log({ keyword, price, rating, category });

  return (
    <div className="min-h-screen">
      <div className="flex gap-3">
        <Filter setPrice={setPrice} setRating={setRating} setCategory={setCategory} />
        <div>
          {loading ? (
            'Loading...'
          ) : (
            <div>
              {products?.products && (
                <div className=" flex items-center justify-center gap-5 my-5 flex-wrap ">
                  {currentItems.map((product, i) => (
                    <ProductCard product={product} key={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default Products;
