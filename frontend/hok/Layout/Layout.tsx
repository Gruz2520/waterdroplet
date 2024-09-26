import Header from '../../components/Header/Header';
import Head from 'next/head';
import s from './Layout.module.scss';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { logout } from '@/store/slices/authSlice';
import { checkAuth } from '@/store/slices/authSlice';
import SpinnerLds from '@/components/UI/SpinnerLds/SpinnerLds';
import ContactForm from '@/components/ContactForm/ContactForm';
import PopupSystemMessage from '@/components/PopupSystemMessage/PopupSystemMessage';
import PasswordAlert from '@/components/PasswordAlert/PasswordAlert';
import { AccountType } from '@/models/models';
import { setMustChgPswd } from '@/store/slices/authSlice';
import { LayoutProps } from './Layout.props';
import cn from 'classnames';
import { cleanChecks } from '@/store/slices/checksSlice';
import { cleanEmployees } from '@/store/slices/employeesSlice';

export default function Layout(props: LayoutProps) {
  const dispatch = useAppDispatch();
  const { isLogged, mustChgPswd } = useAppSelector((state) => state.auth);
  const isServiceLoading = useAppSelector((state) => state.services).isLoading;
  const isInfoLoading = useAppSelector((state) => state.about).isLoading;
  const isAuthLoading = useAppSelector((state) => state.auth).isLoading;
  const isEmployeesLoading = useAppSelector(
    (state) => state.employees
  ).isLoading;
  const isLoading =
    isServiceLoading || isInfoLoading || isAuthLoading || isEmployeesLoading;

  const [scrollLocked, setScrollLocked] = useState(false);

  useEffect(() => {
    const MustChgPswd = localStorage.getItem('mustChgPswd');
    const token = localStorage.getItem('token');
    const accountType = localStorage.getItem('accountType') as AccountType;
    !!MustChgPswd
      ? dispatch(setMustChgPswd(true))
      : dispatch(setMustChgPswd(false));
    if (!token) {
      dispatch(logout());
      dispatch(cleanChecks());
      dispatch(cleanEmployees());
    }
    if (typeof token !== 'string') return;
    dispatch(checkAuth({ token, accountType }));
  }, []);
  const { children, metaKeyWords, title } = props;

  return (
    <>
      <Head>
        <meta content={`Капля ${metaKeyWords}`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='./favicon.ico' sizes='any' />
        <title>{title}</title>
      </Head>
      <div className={cn(s.base, { [s.noScroll]: scrollLocked })}>
        {mustChgPswd && <PasswordAlert />}
        <div className={s.page}>
          {!mustChgPswd && <Header onSideBarOpen={setScrollLocked} />}
          <PopupSystemMessage />
          {isLoading && <SpinnerLds />}
          <>
            {children}
            {props.withForm && <ContactForm />}
          </>
        </div>
      </div>
    </>
  );
}
