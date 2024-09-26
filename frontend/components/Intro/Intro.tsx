import s from './Intro.module.scss';
import about from '@/public/data/aboutUs';

export default function HowToUse() {
  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <p className={s.text}>{about.intro}</p>
      </section>
    </div>
  );
}
