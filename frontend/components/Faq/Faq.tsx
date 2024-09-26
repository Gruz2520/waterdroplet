import about from '@/public/data/aboutUs';
import s from './Faq.module.scss';
import FaqItem from '../FaqItem/FaqItem';

export default function Faq() {
  return (
    <div className={s.wrapper}>
      <div className={s.section}>
        <h2 className={s.title}>FAQ</h2>
        <div className={s.container}>
          {about.faq.map((f) => (
            <FaqItem item={f} key={f.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
