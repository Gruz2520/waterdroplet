import { IEmployeeProps } from './Employee.props';
import s from './ListItem.module.scss';
import Image from 'next/image';
import extendIcon from '../../public/img/extend_icon.svg';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { getEmployeeDetails } from '@/store/slices/employeesSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { editEmployee, removeEmployee } from '@/store/slices/employeesSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IAddEmployeeFormData } from '@/models/models';
import validatePassword from '@/utils/validatePassword';
import showIcon from '../../public/img/show_icon.svg';
import hideIcon from '../../public/img/hide_icon.svg';

export default function Employee(props: IEmployeeProps) {
  const [employee, setEmployee] = useState<any>(props.employee);
  const [extended, setExtended] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);

  useEffect(() => {
    setEmployee(props.employee);
  }, [props.employee]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<IAddEmployeeFormData>({ mode: 'onChange' });

  const dispatch = useAppDispatch();

  // fetch extended data for particular user to show the widget
  const fetchDetailedData = async () => {
    const token = localStorage.getItem('token');
    const data = await dispatch(
      getEmployeeDetails({ token, id: employee.id_sotrudnik })
    );
    setEmployee(data.payload);
  };

  const onSubmitEdit: SubmitHandler<IAddEmployeeFormData> = async (data) => {
    const { login, password, phone, name } = data;
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await dispatch(
      editEmployee({
        token,
        login,
        password,
        phone,
        id: employee.id_sotrudnik,
        name,
      })
    );
    setExtended(false);
    setEditMode(false);
    reset();
  };

  const submitDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    dispatch(
      removeEmployee({
        token,
        id: employee.id_sotrudnik,
      })
    );
    setEditMode(false);
  };

  const toggleExtended = async () => {
    if (extended) {
      setExtended(false);
      setEditMode(false);
    } else {
      setIsLoading(true);
      await fetchDetailedData();
      setIsLoading(false);
      setExtended(true);
    }
  };

  return (
    <div className={s.listItem}>
      <div className={s.heading} onClick={toggleExtended}>
        <p className={cn(s.title, { [s.fade]: isLoading })}>
          {isLoading ? 'Загрузка...' : employee.full_name}
        </p>
        <Image
          className={cn({ [s.rotated]: extended })}
          src={extendIcon}
          alt='развернуть карточку'
          width={15}
          height={7}
        />
      </div>
      <div className={cn(s.extendable, { [s.extended]: extended })}>
        {editMode && (
          <form className={s.form} onSubmit={handleSubmit(onSubmitEdit)}>
            <label htmlFor='empName' className={s.label}>
              <p className={s.error}>{errors?.name?.message}</p>
              Имя сотрудника
              <input
                defaultValue={employee.full_name}
                type='text'
                id='empName'
                className={cn(s.input, { [s.frozen]: !editMode })}
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
                id='empLogin'
                defaultValue={employee.login}
                className={cn(s.input, { [s.frozen]: !editMode })}
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
            <label htmlFor='empPassword' className={s.label}>
              <p className={s.error}>
                {errors.password &&
                  (errors?.password?.message ||
                    'от 8 до 20 символов, минимум две цифры, минимум одна заглавная латинская буква')}
              </p>
              пароль
              <input
                type='text'
                id='empPassword'
                defaultValue={employee.hashed_password}
                className={cn(s.input, { [s.frozen]: !editMode })}
                {...register('password', {
                  required: 'Обязательное поле',
                  validate: validatePassword,
                })}
              />
            </label>
            <label htmlFor='empPhone' className={s.label}>
              <p className={s.error}>{errors?.phone?.message}</p>
              номер телефона
              <input
                type='text'
                id='empPhone'
                defaultValue={employee.phone}
                className={cn(s.input, { [s.frozen]: !editMode })}
                {...register('phone', {
                  required: 'Обязательное поле',
                  pattern: {
                    value:
                      /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
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
              сохранить
            </button>
            <button
              className={s.buttonTrans}
              type='button'
              onClick={() => setEditMode(false)}
            >
              отмена
            </button>
          </form>
        )}
        {!editMode && (
          <div className={s.form}>
            <div className={s.label}>
              <p className={s.mark}>логин</p>
              <p className={s.input}>{employee.login}</p>
            </div>
            <div className={s.label}>
              <button className={s.showPasswordBtn} onClick={togglePassword}>
                <Image
                  alt='Показать или скрыть пароль.'
                  src={showPassword ? hideIcon : showIcon}
                  fill
                />
              </button>
              <p className={s.mark}>пароль</p>
              <p className={cn(s.input, { [s.password]: !showPassword })}>
                {employee.hashed_password}
              </p>
            </div>
            <div className={s.label}>
              <p className={s.mark}>телефон</p>
              <p className={s.input}>{employee.phone}</p>
            </div>
            <div className={s.label}>
              <p className={s.mark}>id сотрудника</p>
              <p className={s.input}>{employee.id_sotrudnik}</p>
            </div>
            <div className={s.label}>
              <p className={s.mark}>id организации</p>
              <p className={s.input}>{employee.id_business}</p>
            </div>

            {!removeMode && (
              <>
                <button
                  className={s.buttonTrans}
                  type='button'
                  onClick={() => setEditMode(true)}
                >
                  редактировать профиль
                </button>
                <button
                  className={s.buttonTrans}
                  type='button'
                  onClick={() => setRemoveMode(true)}
                >
                  удалить профиль
                </button>
              </>
            )}
            {removeMode && (
              <>
                <button
                  className={s.buttonTrans}
                  type='button'
                  onClick={() => setRemoveMode(false)}
                >
                  Отмена
                </button>
                <button
                  className={s.buttonSolid}
                  type='button'
                  onClick={submitDelete}
                >
                  Подтвердите удаление
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
