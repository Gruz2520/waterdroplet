import { ProtectedRouteProps } from './ProtectedRoute.props';
import Layout from '@/hok/Layout/Layout';
import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/reduxHooks';
import Router from 'next/router';

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const { isAuthCheckDone, isLogged } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthCheckDone) return;
    if (!isLogged) Router.push('/auth');
  }, [isLogged, isAuthCheckDone]);
  return <Layout {...props}>{isLogged && props.children}</Layout>;
}
