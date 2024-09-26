import s from './AboutTitle.module.scss';

export default function AboutTitle() {
  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <div className={s.decor2}></div>
        <div className={s.decor4}></div>
        <div className={s.decor3}></div>
        <div className={s.decor5}></div>
        <h1 className={s.title}>
          <span className={s.title1}>МЫ ОТКРЫВАЕМ</span>
          <span className={s.title2}>НОВЫЙ ВЗГЛЯД НА ВОДУ</span>
        </h1>
      </section>
    </div>
  );
}
