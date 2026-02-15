import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import banner from '../assets/images/banner.webp';
const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(getProducts({ keyword: '' }));
  }, [dispatch]);

  const productList = products?.products || [];

  return (
    <>
      <div>
        <img src={banner} alt="banner" />
      </div>

      {loading ? (
        'Loading...'
      ) : error ? (
        <div className="text-red-600">Hata: {error}. Backend çalışıyor mu? (port 4000)</div>
      ) : (
        <div>
          {productList.length === 0 && <p>Henüz ürün yok.</p>}
          {productList.length > 0 && (
            <div className=" flex items-center justify-center gap-5 my-5 flex-wrap ">
              {productList.map((product, i) => (
                <ProductCard product={product} key={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default Home;

//42:21
