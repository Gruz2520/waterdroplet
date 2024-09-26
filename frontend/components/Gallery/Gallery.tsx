import s from './Gallery.module.scss';
import GallerySlider from '../GallerySlider/GallerySlider';

export default function Gallery() {
  return (
    <div className={s.wrapper}>
      <section className={s.gallery}>
        <div className={s.column}>
          <h2 className={s.title}>галерея</h2>
          <p className={s.text}>мы помогаем делать вашу жизнь проще</p>
        </div>
        <div className={s.column}>
          <GallerySlider />
        </div>
      </section>
    </div>
  );
}
