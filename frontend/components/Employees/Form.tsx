import validatePassword from '@/utils/validatePassword';
import cn from 'classnames';
import s from './Employees.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IAddEmployeeFormData } from '@/models/models';
import { addEmployee } from '@/store/slices/employeesSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { useState } from 'react';

export default function Form() {
  const [extended, setExtended] = useState(false);

  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<IAddEmployeeFormData>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<IAddEmployeeFormData> = async (data) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await dispatch(
      addEmployee({
        token,
        worker: {
          login: data.login,
          phone: data.phone,
          password: data.password,
          full_name: data.name,
        },
      })
    );
    reset();
  };

  return (
    <div className={s.formContainer}>
      <div className={s.spoiler} onClick={() => setExtended(!extended)}>
        <p className={s.spoilerHead}>Добавить сотрудника</p>
        <div className={s.extendBtn}>
          <div className={s.icon}></div>
          <div className={cn(s.icon, { [s.rotated]: !extended })}></div>
        </div>
      </div>
      <form
        className={cn(s.form, { [s.extended]: extended })}
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor='empLogin' className={s.label}>
          <p className={s.error}>{errors?.name?.message}</p>
          ФИО
          <input
            type='text'
            id='empNewName'
            className={cn(s.input, { [s.disabledInput]: errors?.name })}
            {...register('name', {
              required: 'Обязательное поле',
              minLength: {
                value: 3,
                message: 'Минимум 3 символа',
              },
              maxLength: {
                value: 30,
                message: 'Максимум 30 символов',
              },
            })}
          />
        </label>
        <label htmlFor='empLogin' className={s.label}>
          <p className={s.error}>{errors?.login?.message}</p>
          логин
          <input
            type='text'
            id='empNewLogin'
            className={cn(s.input, { [s.disabledInput]: errors?.login })}
            {...register('login', {
              required: 'Обязательное поле',
              minLength: {
                value: 3,
                message: 'Минимум 3 символа',
              },
              maxLength: {
                value: 30,
                message: 'Максимум 20 символов',
              },
            })}
          />
        </label>
        <label htmlFor='empPhone' className={s.label}>
          <p className={s.error}>
            {errors.password &&
              (errors?.password?.message ||
                'от 8 до 20 символов, минимум две цифры, минимум одна заглавная латинская буква')}
          </p>
          пароль
          <input
            type='password'
            id='empNewPassword'
            className={cn(s.input, { [s.disabledInput]: errors?.password })}
            {...register('password', {
              required: 'Обязательное поле',
              validate: validatePassword,
            })}
          />
        </label>
        <label htmlFor='empNewPhone' className={s.label}>
          <p className={s.error}>{errors?.phone?.message}</p>
          номер телефона
          <input
            type='text'
            id='empPhone'
            className={cn(s.input, { [s.disabledInput]: errors?.phone })}
            {...register('phone', {
              required: 'Обязательное поле',
              pattern: {
                value: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
                message: 'Неверный формат номера',
              },
            })}
          />
        </label>
        <button
          type='submit'
          className={cn(s.buttonSolid, { [s.disabledBtn]: !isValid })}
          disabled={!isValid}
        >
          добавить сотрудника
        </button>
      </form>
    </div>
  );
}
