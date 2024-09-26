import s from './Contacts.module.scss';
import about from '@/public/data/aboutUs';

export default function Contacts() {
  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <div className={s.item}>
          <div className={s.itemColumn}>
            <p className={s.itemText}>{about.contactList.phone.intro}</p>
          </div>
          <div className={s.itemColumn}>
            <p className={s.itemText}>{about.contactList.phone.contact}</p>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.itemColumn + ' ' + s.itemText_narrow}>
            <p className={s.itemText}>{about.contactList.email.intro}</p>
          </div>
          <div className={s.itemColumn}>
            <p className={s.itemText}>{about.contactList.email.contact}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
