import s from './Directories.module.scss';
import aboutUs from '@/public/data/aboutUs';

export default function Directories() {
  const colorsSet = ['blue', 'red', 'purple'];
  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <h2 className={s.title}>Наша направленность:</h2>
        <div className={s.container}>
          {aboutUs.directions.map((d, i) => (
            <p
              className={
                s[
                  `item${
                    colorsSet[i >= colorsSet.length ? i % colorsSet.length : i]
                  }`
                ]
              }
              key={d.id}
            >
              {d.text}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
