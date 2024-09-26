import s from './Account.module.scss';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
// import Input from '../UI/Input/Input';
import { useState } from 'react';
import { changeEmail, changePassword } from '@/store/slices/authSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { EditUserFormData } from '@/models/models';
import validatePassword from '@/utils/validatePassword';
import cn from 'classnames';
import { AccountType } from '@/models/models';
import { logoutWithPopup } from '@/store/slices/authSlice';
import Link from 'next/link';
import { cleanChecks } from '@/store/slices/checksSlice';
import { cleanEmployees } from '@/store/slices/employeesSlice';

export default function Account() {
  const { currentUser, mustChgPswd } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState<'password' | 'email' | null>(
    mustChgPswd ? 'password' : null
  );

  const handleLogout = () => {
    dispatch(logoutWithPopup());
    dispatch(cleanChecks());
    dispatch(cleanEmployees());
    localStorage.clear();
  };

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    getValues,
  } = useForm<EditUserFormData>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<EditUserFormData> = async (data) => {
    const token = localStorage.getItem('token');
    const accountType = localStorage.getItem('accountType') as AccountType;
    if (editMode === 'email') {
      const { email } = data;
      dispatch(
        changeEmail({
          token,
          email,
          accountType,
        })
      );
    } else {
      const { password } = data;
      dispatch(
        changePassword({
          token,
          password,
          accountType,
        })
      );
    }
    setEditMode(null);
  };

  return (
    <div className={s.wrapper}>
      <section className={cn(s.account, { [s.fullHeight]: mustChgPswd })}>
        {!mustChgPswd && !editMode && (
          <button className={s.logoutBtn} onClick={handleLogout}>
            Выйти
          </button>
        )}
        {mustChgPswd && (
          <p className={s.msg}>Вам необходимо установить постоянный пароль</p>
        )}
        <form
          action='post'
          className={s.form}
          onSubmit={handleSubmit(onSubmit)}
        >
          {!editMode && (
            <>
              {currentUser.accountType === 'business' && (
                <div className={s.btnContainer}>
                  <Link href='/meters' className={s.link}>
                    Клиенты
                  </Link>
                  <Link href='/checks' className={s.link}>
                    проверки
                  </Link>{' '}
                  <Link href='/employees' className={s.link}>
                    сотрудники
                  </Link>
                </div>
              )}
              <p className={s.type}>
                {currentUser.accountType === 'business'
                  ? 'Юридическое лицо'
                  : 'Администратор'}
              </p>
              <p className={s.input + ' ' + s.static}>
                {currentUser.full_name || currentUser.company_name}
              </p>
              <p className={s.input + ' ' + s.static}>{currentUser.login}</p>
              {currentUser.accountType === 'business' && (
                <p className={s.input + ' ' + s.static}>
                  <span>{currentUser.apitoken}</span>
                  <span>{currentUser.expiration_date}</span>
                </p>
              )}
            </>
          )}
          <div className={s.inputWrapper}>
            {editMode === 'email' ? (
              <input
                autoComplete='off'
                className={s.input}
                id='editUserEmail'
                placeholder='Введите новый email'
                type='email'
                defaultValue={currentUser.email}
                {...register('email', {
                  required: 'Обязательное поле',
                  validate: (value) => value !== currentUser.email,
                  pattern: {
                    value:
                      /^((([0-9A-Za-z]{1}[-0-9A-z\.]{0,30}[0-9A-Za-z]?)|([0-9А-Яа-я]{1}[-0-9А-я\.]{0,30}[0-9А-Яа-я]?))@([-A-Za-z]{1,}\.){1,}[-A-Za-z]{2,})$/,
                    message:
                      'Введите адрес электронной почты в правильном формате',
                  },
                })}
              />
            ) : !editMode ? (
              <p className={s.input + ' ' + s.static}>{currentUser.email}</p>
            ) : null}
            <p className={s.error}>{errors?.email?.message}</p>
          </div>
          {editMode === 'password' && (
            <>
              <div className={s.inputWrapper}>
                <input
                  autoComplete='off'
                  className={s.input}
                  id='editUserPassword'
                  placeholder='Введите новый пароль'
                  type='password'
                  defaultValue=''
                  {...register('password', {
                    required: 'Обязательное поле',
                    validate: validatePassword,
                  })}
                />
                <p className={s.error}>
                  {errors.password &&
                    (errors?.password?.message ||
                      'от 8 до 20 символов, минимум две цифры, минимум одна заглавная латинская буква')}
                </p>
              </div>
              <div className={s.inputWrapper}>
                <input
                  autoComplete='off'
                  className={s.input}
                  id='repeatPassword'
                  placeholder='повторите пароль'
                  type='password'
                  defaultValue=''
                  {...register('passwordRepeat', {
                    validate: () =>
                      getValues('password') === getValues('passwordRepeat'),
                  })}
                />
                <p className={s.error}>
                  {errors.passwordRepeat &&
                    (errors?.passwordRepeat?.message ||
                      'Пароли должны совпадать')}
                </p>
              </div>
            </>
          )}
          {!editMode && (
            <>
              <button className={s.button} onClick={() => setEditMode('email')}>
                Изменить адрес электронной почты
              </button>
              <button
                className={s.button}
                onClick={() => setEditMode('password')}
              >
                Изменить пароль
              </button>
            </>
          )}
          {editMode && (
            <>
              <button
                className={cn(s.button, { [s.inactiveBtn]: !isValid })}
                type='submit'
                disabled={!isValid}
              >
                Сохранить изменения
              </button>
              {!mustChgPswd && (
                <button
                  className={s.buttonWeak}
                  onClick={() => {
                    setEditMode(null);
                    reset();
                  }}
                >
                  Отмена
                </button>
              )}
            </>
          )}
        </form>
      </section>
    </div>
  );
}
