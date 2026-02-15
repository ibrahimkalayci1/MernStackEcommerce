import React from 'react';
import { useSelector } from 'react-redux';
import profilImage from '../assets/images/profilImage.png';
import Button from '../components/Button';

const Profile = () => {
  const { user, isAuth } = useSelector((state) => state.user);

  return (
    <div className=" min-h-screen ">
      <div className="flex justify-center gap-5 my-10">
        <div className="">
          <img
            className="w-[300px] h-[300px] rounded-full"
            src={user?.user?.avatar?.url || profilImage}
            alt=""
          />
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold "> {user?.user?.name} </div>
          <div className="text-3xl  "> {user?.user?.email} </div>
          <Button name={'Profili Güncelle'} onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
