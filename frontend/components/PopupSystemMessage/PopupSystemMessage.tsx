import { useEffect } from 'react';
import s from './PopupSystemMessage.module.scss';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { clearSystMsgAbout } from '@/store/slices/aboutSlice';
import { clearSystMsgAuth } from '@/store/slices/authSlice';
import { clearSystMsgService } from '@/store/slices/servicesSlice';
import { clearSystMsgEmployee } from '@/store/slices/employeesSlice';
import { PopupSystMsgProps } from './PopupSystemMessage.props';

export default function PopupSystemMessage(props: PopupSystMsgProps) {
  // ***OPTIONALMessage that could be recieved as props.
  const { externalSystMsg, clearExtSystMsg } = props;
  const dispatch = useAppDispatch();

  // System messages through the entire store
  const { systMsgAuth } = useAppSelector((state) => state.auth);
  const { systMsgService } = useAppSelector((state) => state.services);
  const { systMsgAbout } = useAppSelector((state) => state.about);
  const { systMsgEmployees } = useAppSelector((state) => state.employees);

  const externalSystMsgToShow = !!externalSystMsg ? externalSystMsg : '';

  const message =
    systMsgAuth +
    systMsgService +
    systMsgAbout +
    externalSystMsgToShow +
    systMsgEmployees;

  const resetSystMsg = () => {
    dispatch(clearSystMsgAbout());
    dispatch(clearSystMsgAuth());
    dispatch(clearSystMsgService());
    dispatch(clearSystMsgEmployee());
    clearExtSystMsg && clearExtSystMsg();
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      resetSystMsg();
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [message]);
  return (
    <div
      className={cn(s.popup, { [s.active]: message })}
      onClick={resetSystMsg}
    >
      <div className={s.container} onClick={(e) => e.stopPropagation()}>
        <p className={s.text}>{message}</p>
        <div className={s.bar}></div>
      </div>
    </div>
  );
}
