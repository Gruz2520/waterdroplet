import { FC, useState } from 'react';
import FaqItemProps from './FaqItem.props';
import extendIcon from '@/public/img/extend_icon_faq.svg';
import Image from 'next/image';
import s from './FaqItem.module.scss';
import cn from 'classnames';

const FaqItem: FC<FaqItemProps> = (props) => {
  const { title, mainText } = props.item;
  const [extended, setExtended] = useState(false);

  const toggleExtend = () => setExtended(!extended);

  return (
    <div className={s.item}>
      <div className={s.heading} onClick={toggleExtend}>
        <p className={s.title}>{title}</p>
        <button className={cn(s.extendBtn, { [s.rotated]: extended })}>
          <Image
            src={extendIcon}
            alt='Показать ответ'
            className={s.extendIcon}
          />
        </button>
      </div>
      <div className={cn(s.parContainer, { [s.shown]: extended })}>
        {mainText.map((t, i) => (
          <p
            className={s.paragraph}
            key={i}
            dangerouslySetInnerHTML={{ __html: t }}
          />
        ))}
      </div>
    </div>
  );
};

export default FaqItem;
