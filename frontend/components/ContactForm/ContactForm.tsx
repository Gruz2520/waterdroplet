import s from './ContactForm.module.scss';
import Image from 'next/image';
import sendIcon from '../../public/img/send.png';
import vkIcon from '../../public/img/vk.png';
import { useForm, SubmitHandler } from 'react-hook-form';
import cn from 'classnames';
import { ContactFormData } from '@/models/models';
import api from '@/utils/api';
import PopupSystemMessage from '../PopupSystemMessage/PopupSystemMessage';
import { useState } from 'react';
import about from '@/public/data/aboutUs';

export default function ContactForm() {
  const [systemMessage, setSystemMessage] = useState('');
  const clearMsg = () => setSystemMessage('');

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<ContactFormData>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    const res = await api.sendForm(data);
    if (res.detail === 'success') reset();
    setSystemMessage(res.message);
  };

  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <div className={s.decor1}></div>
        <div className={s.decor2}></div>
        <div className={s.decor3}></div>
        {systemMessage && (
          <PopupSystemMessage
            externalSystMsg={systemMessage}
            clearExtSystMsg={clearMsg}
          />
        )}
        <h2 className={s.title}>контакты</h2>
        <div className={s.columns}>
          <div className={s.column}>
            <h3 className={s.formTitle}>ОСТАВЬ ЗАЯВКУ</h3>
            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={s.inputName}>
                <input
                  className={s.input}
                  placeholder='имя'
                  {...register('name', {
                    required: 'Обязательное поле',
                    minLength: {
                      value: 3,
                      message: 'Минимальная длина 3 символа',
                    },
                    maxLength: {
                      value: 30,
                      message: 'Максимальная длина 30 символов',
                    },
                  })}
                />
                <p className={s.error}>{errors?.name?.message}</p>
              </div>
              <div className={s.inputPhone}>
                <input
                  className={s.input}
                  type='tel'
                  placeholder='телефон'
                  {...register('phone', {
                    required: 'Обязательное поле',
                    pattern: {
                      value:
                        /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
                      message: 'Введите телефонный номер в правильном формате',
                    },
                  })}
                />
                <p className={s.error}>{errors?.phone?.message || ''}</p>
              </div>
              <div className={s.inputMessage}>
                <input
                  className={s.input}
                  placeholder='сообщение'
                  {...register('message', {
                    required: 'Обязательное поле',
                    minLength: {
                      value: 5,
                      message: 'Минимальная длина 5 символов',
                    },
                    maxLength: {
                      value: 300,
                      message: 'Максимальная длина 300 символов',
                    },
                  })}
                />
                <p className={s.error}>{errors?.message?.message}</p>
              </div>
              <button
                className={cn(s.btn, { [s.btn_disabled]: !isValid })}
                type='submit'
                disabled={!isValid}
              >
                <p className={s.btnText}>отправить</p>
                <div className={s.img}>
                  <Image src={sendIcon} alt='отправить' fill />
                </div>
              </button>
            </form>
          </div>
          <div className={s.column + ' ' + s.contacts}>
            <div className={s.contact}>
              <p className={s.contactTitle}>email</p>
              <p className={s.contactData}>{about.contactList.email.contact}</p>
            </div>
            <div className={s.contact}>
              <p className={s.contactTitle}>phone</p>
              <p className={s.contactData}>{about.contactList.phone.contact}</p>
            </div>
            <a
              href={'https://www.vk.com'}
              target={'blank'}
              className={s.socialLink}
            >
              <div className={s.img}>
                <Image src={vkIcon} alt='ВКонтакте' fill />
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
