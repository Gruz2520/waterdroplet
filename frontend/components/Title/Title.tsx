import s from './Title.module.scss';

export default function Title() {
  return (
    <div className={s.titleWrapper}>
      <div className={s.titleBlock}>
        <div className={s.cube1}></div>
        <h2 className={s.title}>
          <b>мы</b>
          <b className={s.row2}>открываем</b>
          <b>новый</b>
          <b className={s.row4}>взгляд</b>
          <b className={s.row5}>на воду</b>
        </h2>
        <div className={s.cube2}></div>
      </div>
    </div>
  );
}
