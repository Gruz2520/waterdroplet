import s from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/img/logo.svg';
import burger from '@/public/img/burger.svg';
import close from '@/public/img/close.svg';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/reduxHooks';
import cn from 'classnames';
import vkIcon from '../../public/img/vk.png';
import { HeaderProps } from './Header.props';
import about from '@/public/data/aboutUs';

export default function Header(props: HeaderProps) {
  const { onSideBarOpen } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLogged, currentUser, mustChgPswd } = useAppSelector(
    (state) => state.auth
  );

  const closeByEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // console.log('esc');
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('keyup', closeByEsc);
    } else {
      // console.log('removed');
      document.removeEventListener('keyup', closeByEsc);
    }
  }, [isSidebarOpen]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    onSideBarOpen(false);
    window.removeEventListener('resize', closeSidebar);
    window.removeEventListener('click', closeSidebar);
  };
  const openSidebar = () => {
    setIsSidebarOpen(true);
    onSideBarOpen(true);
    window.addEventListener('resize', closeSidebar);
    window.addEventListener('click', closeSidebar);
  };
  const toggleSidebar = (e: any) => {
    e.stopPropagation();
    isSidebarOpen ? closeSidebar() : openSidebar();
  };

  return (
    <div className={s.wrapper}>
      <div className={cn(s.overlay, { [s.shown]: isSidebarOpen })}></div>
      <header className={s.header}>
        <Link href='/' className={s.imgContainer}>
          <Image src={logo} alt='Логотип приложения капля' fill />
        </Link>
        <nav className={isSidebarOpen ? s.sidebar : ''}>
          <div className={s.menu}>
            <Link href='/' className={s.menuItem}>
              О нас
            </Link>
            <Link href='/price' className={s.menuItem}>
              Цены
            </Link>
            <Link href='/docs' className={s.menuItem}>
              Документация
            </Link>
            {!isLogged && (
              <Link href='/auth' className={s.menuItem}>
                Авторизация
              </Link>
            )}
            {isLogged && (
              <Link
                href='/account'
                className={s.menuItem + ' ' + s.menuItemThin}
              >
                {currentUser?.login ? currentUser.login : 'Личный кабинет'}
              </Link>
            )}
          </div>
          {isSidebarOpen && (
            <div className={s.stamp + ' ' + s.contacts}>
              <div className={s.contact}>
                <p className={s.contactTitle}>email</p>
                <p className={s.contactData}>
                  {about.contactList.email.contact}
                </p>
              </div>
              <div className={s.contact}>
                <p className={s.contactTitle}>phone</p>
                <p className={s.contactData}>
                  {about.contactList.phone.contact}
                </p>
              </div>
              <a
                href={'https://www.vk.com'}
                target={'blank'}
                className={s.socialLink}
              >
                <div className={s.img}>
                  <Image src={vkIcon} alt='ВКонтакте' fill />
                </div>
              </a>
            </div>
          )}
        </nav>
        <button className={s.burger} onClick={toggleSidebar}>
          <Image
            src={isSidebarOpen ? close : burger}
            alt='Кнопка открытия сайдбара.'
            fill
          />
        </button>
      </header>
    </div>
  );
}
