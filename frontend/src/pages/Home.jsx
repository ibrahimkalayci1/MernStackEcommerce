import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import banner from '../assets/images/banner.webp';
const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(getProducts({ keyword: '' }));
  }, [dispatch]);

  return (
    <>
      <div>
        <img src={banner} alt="banner" />
      </div>

      {loading ? (
        'Loading...'
      ) : (
        <div>
          {
          products?.products && (
            <div className=" flex items-center justify-center gap-5 my-5 flex-wrap ">
              {products?.products?.map((product, i) => (
                <ProductCard product={product} key={i} />
              ))}
            </div>
          )
          }
        </div>
      )}
    </>
  );
};
export default Home;

//42:21
