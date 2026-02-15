import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../redux/userSlice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const handleForgotPassword = () => {
    if (!email) return;
    dispatch(forgotPassword(email));
  };

  return (
    <div className=" flex h-screen items-center justify-center ">
      <div className="w-1/3 space-y-3">
        <div className="text-3xl ">Şifremi Unuttum</div>
        <Input
          placeholder={'Email'}
          onChange={(e) => setEmail(e.target.value)}
          name={'email'}
          id={'email'}
          type={'text'}
        />
        <Button name={'Onayla'} onClick={handleForgotPassword} />
      </div>
    </div>
  );
};

export default ForgotPassword;
