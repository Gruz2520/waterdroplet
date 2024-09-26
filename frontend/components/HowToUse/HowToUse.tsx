import s from './HowToUse.module.scss';
import Image from 'next/image';
import about from '@/public/data/aboutUs';

export default function HowToUse() {
  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <h2 className={s.title}>как пользоваться?</h2>
        <div className={s.container}>
          {about.steps.map((step) => (
            <div className={s['step' + step.id]} key={step.id}>
              <div className={s.textBlock}>
                <p className={s['stepN' + step.id]}>{step.id}</p>
                <p className={s['stepText' + step.id]}>{step.text}</p>
                <div className={s['arrContainer' + step.id]}>
                  <Image
                    src={step.arr}
                    alt='Стрелочка между текстом и картинкой.'
                    fill
                  />
                </div>
              </div>
              <div className={s['picContainer' + step.id]}>
                <Image src={step.img} alt={step.text} fill />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
