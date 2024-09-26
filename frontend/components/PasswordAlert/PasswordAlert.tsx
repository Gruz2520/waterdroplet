import Link from 'next/link';
import s from './PasswordAlert.module.scss';

export default function PasswordAlert() {
  return (
    <div className={s.alert}>
      <div className={s.container}>
        <p className={s.msg}>
          Внимание! Вам необходимо сменить одноразовый пароль
        </p>
        <Link href='/account' className={s.btn}>
          Установить пароль
        </Link>
      </div>
    </div>
  );
}
