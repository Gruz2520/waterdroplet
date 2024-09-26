import s from './AddServiceForm.module.scss';
import { addServiceItem } from '@/store/slices/servicesSlice';
import Button from '../UI/Button/Button';
import Image from 'next/image';
import addIcon from '../../public/img/plus_icon.svg';
import Input from '../UI/Input/Input';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import PopupSystemMessage from '../PopupSystemMessage/PopupSystemMessage';

export default function AddServiceForm() {
  const dispatch = useAppDispatch();
  const [newServiceText, setNewServiceText] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [alert, setAlert] = useState('');

  const clearAlert = () => setAlert('');

  const submitAddService = async (e: Event) => {
    e.preventDefault();
    if (
      newServiceText.length < 3 ||
      newServiceText.length > 60 ||
      newServicePrice.length < 3 ||
      newServicePrice.length > 60
    ) {
      setAlert('Допустимая длина обоих значений - от 3 до 60 символов');
      console.log(newServiceText.length);
      console.log(newServicePrice.length);

      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    await dispatch(
      addServiceItem({
        token,
        item: {
          service_name: newServiceText,
          price: newServicePrice,
        },
      })
    );
    setNewServiceText('');
    setNewServicePrice('');
  };
  return (
    <form className={s.addItem}>
      <PopupSystemMessage
        externalSystMsg={alert}
        clearExtSystMsg={clearAlert}
      />
      <Input
        useFor='addService'
        id='serviceName'
        value={newServiceText}
        onChange={(e) => {
          setNewServiceText(e.target.value);
        }}
        placeholder='название услуги...'
      />
      <Input
        useFor='addService'
        id='servicePrice'
        value={newServicePrice}
        onChange={(e) => {
          setNewServicePrice(e.target.value);
        }}
        placeholder='цена...'
      />
      <Button colorBkg='green' type='admin' onClick={submitAddService}>
        <Image
          src={addIcon}
          alt='Редактировать позицию'
          width='24'
          height='24'
        />
      </Button>
    </form>
  );
}
