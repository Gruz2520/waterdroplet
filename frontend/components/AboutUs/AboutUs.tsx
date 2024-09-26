import s from './AboutUs.module.scss';
import Image from 'next/image';
import about from '@/public/data/aboutUs';
import aboutUsImg from '../../public/img/logo_big.png';
import cn from 'classnames';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { editDescription } from '@/store/slices/aboutSlice';
export interface AboutUsProps {
  text: string;
}

export default function AboutUs({ text }: AboutUsProps): JSX.Element {
  const { isAdmin } = useAppSelector((state) => state.auth);
  const [isEditDescr, setIsEditDescr] = useState(false);
  const [currentDescText, setCurrentDescText] = useState('');
  const dispatch = useAppDispatch();

  const submitDescChange = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (text !== currentDescText) {
      dispatch(editDescription({ token, value: currentDescText }));
    }
    setIsEditDescr(false);
  };

  return (
    <div className={s.wrapper}>
      <section className={s.about}>
        <div className={s.column}>
          <h2 className={s.title}>{about.title}</h2>
          <div className={s.pictContainer}>
            <Image src={aboutUsImg} alt='О нас' fill />
          </div>
        </div>
        <div className={s.column}>
          {!isEditDescr ? (
            <p
              className={cn(s.description, { [s.editable]: isAdmin })}
              onClick={() => {
                if (!isAdmin) return;
                setCurrentDescText(text);
                setIsEditDescr(true);
              }}
            >
              {text}
            </p>
          ) : (
            <textarea
              rows={6}
              autoFocus
              className={s.description}
              value={currentDescText}
              onChange={(e) => setCurrentDescText(e.target.value)}
              onBlur={submitDescChange}
            />
          )}
          <div className={s.factsContainer}>
            {about.facts.map((a) => {
              return (
                <div className={s.fact} key={a.id}>
                  <p className={s.factTitle}>{a.heading}</p>
                  <p className={s.factText}>{a.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
