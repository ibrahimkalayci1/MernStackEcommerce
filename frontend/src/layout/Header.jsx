import React, { useState } from 'react';
import profilImage from '../assets/images/profilImage.png';
import { SlBasket } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getKeyword } from '../redux/generalSlice';
import { logout } from '../redux/userSlice';
const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { user, isAuth } = useSelector((state) => state.user);
const {carts} = useSelector(state => state.cart)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuItems = [
    {
      name: 'Profil',
      url: '/profile',
    },
    {
      name: 'Admin',
      url: '/admin',
    },
    {
      name: 'Çıkış',
      url: '/logout',
    },
  ];

  const keywordFunc = () => {
    dispatch(getKeyword(keyword));
    setKeyword('');
    navigate('/products');
  };

  const menuFunc = (item) => {
    if (item.name === 'Çıkış') {
      localStorage.removeItem('token');
      dispatch(logout());
      navigate('/');
    } else {
      navigate(item.url);
    }
  };

  return (
    <div className="bg-gray-100 h-16 flex items-center justify-between px-2">
      <div className="text-4xl">e.com</div>

      <div className="flex items-center gap-5">
        <div className="flex items-center">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className=" p-2 outline-none bg-white"
            type="text"
            placeholder="Arama Yap"
          />
          <div onClick={keywordFunc} className="p-2 ml-1 bg-white cursor-pointer">
            Ara
          </div>
        </div>
        <div className="relative ">
          <img
            onClick={() => setOpenMenu(!openMenu)}
            className="w-12 h-12 rounded-full"
            src={user?.user ? user?.user?.avatar?.url : 'profilImage'}
            alt="profil"
          />
          {openMenu && (
            <div className="absolute  right-0 mt-3 w-[200px] bg-white shadow-lg shadow-gray-300 ">
              {menuItems.map((item, i) => (
                <div onClick={() => menuFunc(item)} className="px-2 py-1 hover:bg-gray-100" key={i}>
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div onClick={() => navigate('/cart')} className="relative">
          <SlBasket size={30} />
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center ">
            {carts?.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
