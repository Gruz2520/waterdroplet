import { ICustomerProps } from './Customer.props';
import s from './ListItem.module.scss';
import Image from 'next/image';
import extendIcon from '../../public/img/extend_icon.svg';
import { useState } from 'react';
import cn from 'classnames';

export default function Customer(props: ICustomerProps) {
  const customer = props.customer;
  const [extended, setExtended] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // fetch extended data for particular user to show the widget
  // const fetchDetailedData = async () => {
  //   const token = localStorage.getItem('token');
  //   const data = await dispatch(getCheckDetails({ token, id: 2 }));
  //   setCheck(data.payload);
  // };

  const toggleExtended = async () => {
    if (extended) {
      setExtended(false);
    } else {
      setIsLoading(true);
      // await fetchDetailedData();
      setIsLoading(false);
      setExtended(true);
    }
  };

  return (
    <div className={s.listItem}>
      <div className={s.heading} onClick={toggleExtended}>
        <p className={cn(s.title, { [s.fade]: isLoading })}>
          {isLoading ? (
            'Загрузка...'
          ) : (
            <span
              className={cn({
                [s.highlight]:
                  !!props.query.search &&
                  customer?.full_name
                    .toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {customer.full_name ?? 'Не указано'}
            </span>
          )}
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
        <div className={s.checkCustomerExt}>
          <div className={s.label}>
            <p className={s.mark}>Email</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  customer?.email
                    .toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {customer.email ?? 'Не указан'}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Адрес</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  customer?.address
                    ?.toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {customer.address ?? 'Не указан'}
            </p>
          </div>
          {/* <div className={s.label}>
            <p className={s.mark}>Номер договора</p>
            <p className={s.input + ' ' + s.noUnderline}>
              {customer.contract_number}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Подключенные счетчики</p>
            <p className={s.input + ' ' + s.noUnderline}>
              {customer.ipus
                ? customer.ipus.split(' ').join(', ')
                : 'Отсутствуют'}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
