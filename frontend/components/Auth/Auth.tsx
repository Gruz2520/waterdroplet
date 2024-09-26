import s from './Auth.module.scss';
import Title from '../Title/Title';
import { IAuthProps } from './Auth.props';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { showPasswordAlert } from '@/store/slices/authSlice';
import { AccountType } from '@/models/models';

export default function Auth(props: IAuthProps) {
  const [accountType, setAccountType] = useState<AccountType>('business');
  const { onNameChange, onPasswordChange, onSubmit } = props;
  const dispatch = useAppDispatch();

  const handleSubmitByKey = (e: any) => {
    if (e.key !== 'Enter') return;
    onSubmit(e, accountType);
  };
  useEffect(() => {
    document.addEventListener('keydown', handleSubmitByKey);
    return () => document.removeEventListener('keydown', handleSubmitByKey);
  });

  return (
    <section className={s.auth}>
      <Title />
      <div className={s.formWrapper}>
        <div className={s.form}>
          <div className={s.modeSelector}>
            {/* <button
              onClick={() => setAccountType('physic')}
              className={cn(
                { [s.btnStrong]: accountType === 'physic' },
                { [s.btnWeak]: accountType === 'business' }
              )}
            >
              физическое лицо
            </button> */}
            <button
              onClick={() => setAccountType('business')}
              className={cn(
                { [s.btnStrong]: accountType === 'business' },
                { [s.btnWeak]: accountType !== 'business' },
                s.deactivated
              )}
            >
              юридическое лицо
            </button>
          </div>
          <div className={s.inputContainer}>
            <input
              type='text'
              className={s.input}
              name='username'
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={'номер договора'}
            />
            <input
              type='password'
              name='password'
              className={s.input}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder='пароль'
            />
          </div>
          <div className={s.btnBlock}>
            <button
              className={s.btnStrong}
              onClick={(e) => onSubmit(e, accountType)}
            >
              войти
            </button>
            <button
              className={s.btnWeak + ' ' + s.btnSmallText}
              onClick={() => dispatch(showPasswordAlert())}
            >
              Забыл пароль?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
