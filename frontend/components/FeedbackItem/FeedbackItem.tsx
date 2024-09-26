import s from './FeedbackItem.module.scss';
import Image from 'next/image';
import FeedBackItemProps from './FeedbackItem.props';

export default function FeedbackItem(props: FeedBackItemProps) {
  const { item, color } = props;
  return (
    <div className={s.item} key={item.id}>
      <div className={s['pictContainer_' + color]}>
        <Image src={item.img} alt='О нас' fill />
      </div>
      <div className={s.content}>
        <span className={s['heading_' + color]}>{item.name}</span>
        <p className={s.text}>{item.text}</p>
      </div>
    </div>
  );
}
