import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { resetPassword } from '../redux/userSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState('');

  const handleResetPassword = async () => {
    if (!password) return;
    try {
      const res = await dispatch(resetPassword({ token, password })).unwrap();
      // Başarılıysa login / auth sayfasına veya profile'a yönlendirebilirsin
      navigate('/auth');
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  return (
    <div className=" flex h-screen items-center justify-center ">
      <div className="w-1/3 space-y-3">
        <div className="text-3xl ">Yeni Şifre Oluştur</div>
        <Input
          placeholder={'Yeni Şifre'}
          onChange={(e) => setPassword(e.target.value)}
          name={'password'}
          id={'password'}
          type={'password'}
        />
        <Button name={'Onayla'} onClick={handleResetPassword} />
      </div>
    </div>
  );
};

export default ResetPassword;
