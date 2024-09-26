import s from './TokenIntro.module.scss';
import Link from 'next/link';
import photo from '../../public/img/gallery/2-1.jpg';
import Image from 'next/image';

export default function TokenIntro() {
  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <h2 className={s.title}>Секретный ключ (token)</h2>
        <p className={s.text}>
          Для аутентификации запросов необходимо использовать секретный ключ{' '}
          <span className={s.accent}>token</span>
        </p>
        <p className={s.textBlueFramed}>
          Секретный ключ отвечает за безопасность ваших данных. Храните его в
          защищенном месте и не публикуйте на сторонних ресурсах (например,
          вместе с примерами кода).
        </p>
        <div className={s.wrapperInt}>
          <div className={s.textWrapper}>
            <p className={s.text}>
              <b>Пример секретного ключа:</b>
              <b className={s.textBlue}>
                $2b$12$SBoo01DAeUtI.rR2PZb3he&#173;TVV.Hbc0yP/796tOT6lVk8MYXidQnkS
              </b>
            </p>
            <p className={s.text}>
              Секретный ключ вы можете найти в своем бизнес аккаунте после
              заключения договора о покупке лицензии.
              <Link className={s.textRed} href='/price'>
                Как оформить лицензию?
              </Link>
            </p>
          </div>
          <div className={s.screenshot}>
            <Image
              src={photo}
              alt='Рука с телефоном фотографиует водяной счетчик'
              fill
            />
          </div>
        </div>
      </section>
    </div>
  );
}
