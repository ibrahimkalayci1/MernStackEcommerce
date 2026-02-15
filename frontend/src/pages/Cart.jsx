import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../redux/cartSlice';

const Cart = () => {
  const { carts } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  console.log(carts, 'cartsss');
  const deleteItem = (id) => {
    dispatch(removeFromCart(id));
  };
  return (
    <div className="h-screen  ">
      {carts?.length > 0 ? (
        <div>
          {carts?.map((cart, i) => (
            <div className="flex items-center justify-between border-b mb-2 py-2 px-4" key={i}>
              <img className="w-50" src={cart?.image?.url} alt="" />
              <div>{cart?.name}</div>
              <div>{cart?.quantity} adet </div>
              <div>{cart?.price} ₺ </div>
              <div
                onClick={() => deleteItem(cart?.id)}
                className="w-[150px] h-12 flex items-center justify-center rounded-md bg-red-500 text-white "
              >
                Sil
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Sepetinizde Ürün Bulunmamaktadır...</div>
      )}
    </div>
  );
};

export default Cart;
