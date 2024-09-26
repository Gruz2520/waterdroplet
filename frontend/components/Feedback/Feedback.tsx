import s from './Feedback.module.scss';
import about from '@/public/data/aboutUs';
import FeedbackItem from '../FeedbackItem/FeedbackItem';
type Color = 'red' | 'blue' | 'purple';

export default function Feedback() {
  const colorsSet: Color[] = ['red', 'blue', 'purple', 'blue'];
  return (
    <div className={s.wrapper}>
      <section className={s.feedback}>
        <h2 className={s.title}>Отзывы</h2>
        <div className={s.container}>
          {about.feedback.map((f, i) => (
            <FeedbackItem
              item={f}
              color={
                colorsSet[i >= colorsSet.length ? i % colorsSet.length : i]
              }
              key={f.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
