import s from './DocIntro.module.scss';

export default function DocIntro() {
  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <div className={s.content}>
          <div className={s.article}>
            <h2 className={s.heading}>API Капля</h2>
            <p className={s.text}>
              API для получения показаний счетчиков воды по фото, используя
              нейронные сети и компьютерное зрение. Для юридических лиц и
              разработчиков, которые решили внедрять сложные технологии в свои
              проекты легко!
            </p>
          </div>
          <div className={s.article}>
            <h2 className={s.heading + ' ' + s.lowercase}>API документация</h2>
            <p className={s.text}>
              API в качестве основного протокола использует HTTP, а значит
              подходит для разработки на любом языке программирования, который
              умеет работать с HTTP-библиотеками (cURL и другими).
              <br />
              API поддерживает POST. POST-запросы используют JSON-аргументы, API
              всегда возвращает ответ в формате JSON
            </p>
          </div>
        </div>
        {/* <div className={s.container}> */}
        <div className={s.decorContainer}>
          <div className={s.decor1}></div>
          <div className={s.decor2}></div>
          <div className={s.decor2 + ' ' + s.decor2_2}></div>
          <div className={s.decor3}></div>
          <div className={s.decor4}></div>
        </div>
        <div className={s.outlined}>
          <a href='#' className={s.blue}>
            API endpoint: https://api.waterdroplet.ru
          </a>
          {/* </div> */}
        </div>
      </section>
    </div>
  );
}
