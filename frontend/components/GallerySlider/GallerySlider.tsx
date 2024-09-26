import s from './GallerySlider.module.scss';
import photo1_1 from '../../public/img/gallery/1-1.jpg';
import photo1_2 from '../../public/img/gallery/1-2.jpg';
import photo1_3 from '../../public/img/gallery/1-3.jpg';
import photo1_4 from '../../public/img/gallery/1-4.png';
import photo1_5 from '../../public/img/gallery/1-5.png';
import photo1_6 from '../../public/img/gallery/1-6.jpg';
import photo1_7 from '../../public/img/gallery/1-7.jpg';
import photo1_8 from '../../public/img/gallery/1-8.png';
import photo1_9 from '../../public/img/gallery/1-9.png';
import photo2_1 from '../../public/img/gallery/2-1.jpg';
import photo2_2 from '../../public/img/gallery/2-2.jpg';
import photo2_3 from '../../public/img/gallery/2-3.jpg';
import photo2_4 from '../../public/img/gallery/2-4.jpg';
import photo2_5 from '../../public/img/gallery/2-5.jpg';
import photo2_6 from '../../public/img/gallery/2-6.jpg';
import photo2_7 from '../../public/img/gallery/2-7.png';
import Image from 'next/image';

export default function GallerySlider() {
  return (
    <div className={s.container}>
      <div className={s.row}>
        <div className={s.roller}>
          <div className={s.item}>
            <Image
              src={photo1_7}
              alt='Девушка рвет пополам бумажную квитанцию.'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            <Image
              src={photo1_2}
              alt='Порванные бумажные квитанции валяются кучей.'
              fill
              loading='eager'
            />
          </div>

          <div className={s.item}>
            <Image
              src={photo1_3}
              alt='Смартфон с приложением капля, на экране которого капли воды.'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            <Image
              src={photo1_4}
              alt='Рука держит смартфон на фоне кучи бумажных квитанций.'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            <Image
              src={photo1_5}
              alt='Портрет девушки с смартфотом в руке с запущенным на нем приложением "Капля"'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            <Image
              src={photo1_6}
              alt='Два водяных счётчика.'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            <Image
              src={photo1_1}
              alt='Узор: брызги воды на красном фоне.'
              fill
              loading='eager'
            />
          </div>

          <div className={s.item}>
            <Image
              src={photo1_9}
              alt='Портрет девушки с смартфотом в руке с запущенным на нем приложением "Капля"'
              fill
              loading='eager'
            />
          </div>
        </div>
      </div>
      <div className={s.row}>
        <div className={s.roller}>
          <div className={s.item}>
            <Image
              src={photo2_1}
              alt='Рука с телефоном фотографиует водяной счетчик'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            <Image
              src={photo2_2}
              alt='Портрет парня на оранжевом фоне, на заднем плане летят бумажные квитанции.'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            <Image
              src={photo2_3}
              alt='Узор: брызги воды на фиолетовом фоне.'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            {' '}
            <Image
              src={photo2_4}
              alt='Портрет парня с смартфотом в руке с запущенным на нем приложением "Капля"'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            <Image
              src={photo2_5}
              alt='Крупным планом две руки рвут бумажную квитанцию.'
              fill
              loading='eager'
            />
          </div>
          <div className={s.item}>
            <Image
              src={photo2_6}
              alt='Водяные счетчики.'
              fill
              loading='eager'
            />
            <div className={s.item}>
              <Image
                src={photo1_8}
                alt='Смартфон на стопке бумаг с приложением "Капля" на экране.'
                fill
                loading='eager'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
