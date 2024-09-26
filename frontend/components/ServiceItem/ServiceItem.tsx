import s from './ServiceItem.module.scss';
import Button from '../UI/Button/Button';
import Image from 'next/image';
import editIcon from '@/public/img/edit_icon.svg';
import deleteIcon from '@/public/img/trash_icon.svg';
import closeIcon from '@/public/img/close_icon.svg';
import confirmIcon from '@/public/img/ok_icon.svg';
import { SeviceItemProps } from './SeviceItem.props';
import {
  deleteServiceItem,
  editServiceItem,
} from '@/store/slices/servicesSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useState } from 'react';
import cn from 'classnames';
import Input from '../UI/Input/Input';

export default function ServiceItem({ item }: SeviceItemProps) {
  const dispatch = useAppDispatch();
  const { isAdmin } = useAppSelector((state) => state.auth);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentServiceText, setCurrentServiceText] = useState('');
  const [currentServicePrice, setCurrentServicePrice] = useState('');

  const submitDelete = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    dispatch(deleteServiceItem({ token, id: item.id_service as number }));
  };
  const submitEdit = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    dispatch(
      editServiceItem({
        token,
        item: {
          service_name: currentServiceText,
          price: currentServicePrice,
          id_service: item.id_service,
        },
      })
    );
    setIsEditMode(false);
  };

  const activateEdit = () => {
    setCurrentServiceText(item.service_name);
    setCurrentServicePrice(item.price);
    setIsEditMode(true);
  };

  return (
    <div className={s.item}>
      {isEditMode ? (
        <>
          <Input
            useFor='editService'
            id='editServiceName'
            value={currentServiceText}
            onChange={(e) => setCurrentServiceText(e.target.value)}
            placeholder='название услуги...'
          />
          <Input
            useFor='editService'
            id='editServicePrice'
            value={currentServicePrice}
            onChange={(e) => setCurrentServicePrice(e.target.value)}
            placeholder='цена...'
          />
        </>
      ) : (
        <>
          <p className={s.itemName}>{item.service_name}</p>
          <p className={s.itemPrice}>{item.price}</p>
        </>
      )}
      <div className={cn(s.adminPanel, { [s.shown]: isAdmin })}>
        <Button
          colorBkg='yellow'
          type='admin'
          onClick={activateEdit}
          className={cn({ [s.hidden]: isEditMode })}
        >
          <Image
            src={editIcon}
            alt='Редактировать позицию'
            width='24'
            height='24'
          />
        </Button>
        <Button
          colorBkg='red'
          type='admin'
          onClick={submitDelete}
          className={cn({ [s.hidden]: isEditMode })}
        >
          <Image
            src={deleteIcon}
            alt='Удалить позицию'
            width='24'
            height='24'
          />
        </Button>
        <Button
          className={cn({ [s.hidden]: !isEditMode })}
          colorBkg='green'
          type='admin'
          onClick={submitEdit}
        >
          <Image
            src={confirmIcon}
            alt='Подтвердить данные'
            width='24'
            height='24'
          />
        </Button>
        <Button
          colorBkg='red'
          type='admin'
          onClick={() => setIsEditMode(false)}
          className={cn({ [s.hidden]: !isEditMode })}
        >
          <Image
            src={closeIcon}
            alt='Отменить редактирование.'
            width='24'
            height='24'
          />
        </Button>
      </div>
    </div>
  );
}
