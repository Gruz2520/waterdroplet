import s from './SpinnerLds.module.scss';

export default function SpinnerLds() {
  return (
    <div className={s.container}>
      <div className={s.ldsRing}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className={s.text}>Идёт загрузка...</p>
    </div>
  );
}
