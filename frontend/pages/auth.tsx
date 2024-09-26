import Layout from '@/hok/Layout/Layout';
import Auth from '@/components/Auth/Auth';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { login } from '@/store/slices/authSlice';
import Router from 'next/router';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLogged } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleSubmit = async (evt: any, accountType) => {
    evt.preventDefault();
    try {
      const response = await dispatch(
        login({ payload: { username, password }, accountType: accountType })
      ).unwrap();
      localStorage.setItem('token', response.token);
      localStorage.setItem('accountType', response.accountType);
      Router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLogged) Router.push('/');
  }, [isLogged]);
  return (
    <Layout metaKeyWords='авторизация' title='Авторизация' withForm={false}>
      {!isLogged && (
        <Auth
          onNameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      )}
    </Layout>
  );
}
