import s from './ListItem.module.scss';
import Image from 'next/image';
import extendIcon from '../../public/img/extend_icon.svg';
import extendIconRed from '../../public/img/extend_icon_red.svg';
import { useState } from 'react';
import cn from 'classnames';
import { IMeterProps } from './Meter.props';

export default function Meter(props: IMeterProps) {
  const [item, setItem] = useState(props.item);
  const [extended, setExtended] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleExtended = async () => {
    if (extended) {
      setExtended(false);
    } else {
      setIsLoading(true);
      setIsLoading(false);
      setExtended(true);
    }
  };

  return (
    <div
      className={cn({
        [s.listItem]: !props.susp,
        [s.listItemRed]: props.susp,
      })}
    >
      <div className={s.heading} onClick={toggleExtended}>
        <p className={cn(s.title, { [s.fade]: isLoading })}>
          {isLoading ? (
            'Загрузка...'
          ) : extended ? (
            <>
              <span>Проверка №</span>
              <span
                className={cn({
                  [s.highlight]:
                    !!props.query.search &&
                    item?.transaction_id
                      ?.toString()
                      .toLowerCase()
                      .includes(props.query.search.toLowerCase()),
                })}
              >
                {item?.transaction_id}
              </span>
            </>
          ) : (
            <>
              <span
                className={cn({
                  [s.highlight]:
                    !!props.query.search &&
                    item?.full_name
                      ?.toString()
                      .toLowerCase()
                      .includes(props.query.search.toLowerCase()),
                })}
              >
                {item?.full_name}
              </span>
              <span> </span>
              <span
                className={cn({
                  [s.highlight]:
                    (new Date(props?.query?.dateFrom?.toLowerCase()) <
                      new Date(item?.transaction_date.toLowerCase()) &&
                      !props.query.dateTo) ||
                    (!props.query.dateFrom &&
                      new Date(props?.query?.dateTo?.toLowerCase()) >
                        new Date(item?.transaction_date.toLowerCase())) ||
                    (new Date(props?.query?.dateFrom?.toLowerCase()) <
                      new Date(item?.transaction_date.toLowerCase()) &&
                      new Date(props?.query?.dateTo?.toLowerCase()) >
                        new Date(item?.transaction_date.toLowerCase())),
                })}
              >
                {item?.transaction_date.split(' ')[0].split('-')[2]}.
                {item?.transaction_date.split(' ')[0].split('-')[1]}.
                {item?.transaction_date.split(' ')[0].split('-')[0]}
              </span>
            </>
          )}
        </p>
        <Image
          className={cn({ [s.rotated]: extended })}
          src={props.susp ? extendIconRed : extendIcon}
          alt='развернуть карточку'
          width={15}
          height={7}
        />
      </div>
      <div className={cn(s.extendable, { [s.extended]: extended })}>
        <div className={s.itemCustomerExt}>
          <div className={s.label}>
            <p className={s.mark}>ФИО клиента</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  item.full_name
                    ?.toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {item.full_name}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Новые показания</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  item.new_number
                    ?.toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {item.new_number}
            </p>
          </div>

          <div className={s.label}>
            <p className={s.mark}>Предыдущие показания</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  item.prev_number
                    ?.toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {item.prev_number}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Дата снятий показаний счётчиков</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  (new Date(props?.query?.dateFrom?.toLowerCase()) <
                    new Date(item?.transaction_date?.toLowerCase()) &&
                    !props.query.dateTo) ||
                  (!props.query.dateFrom &&
                    new Date(props?.query?.dateTo?.toLowerCase()) >
                      new Date(item?.transaction_date?.toLowerCase())) ||
                  (new Date(props?.query?.dateFrom?.toLowerCase()) <
                    new Date(item?.transaction_date?.toLowerCase()) &&
                    new Date(props?.query?.dateTo?.toLowerCase()) >
                      new Date(item?.transaction_date?.toLowerCase())),
              })}
            >
              {item.transaction_date}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Сумма оплаты</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  item?.payment_sum
                    ?.toString()
                    ?.toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {item.payment_sum}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Подозрительность проверки</p>
            <p className={s.input + ' ' + s.noUnderline}>{item.verdict}</p>
          </div>
          {/* <div className={s.label}>
            <p className={s.mark}>Счетчик</p>
            <p className={s.input + ' ' + s.noUnderline}>{item.ipu}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
