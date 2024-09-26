import { ICheckProps } from './Check.props';
import s from './ListItem.module.scss';
import Image from 'next/image';
import extendIcon from '../../public/img/extend_icon.svg';
import extendIconRed from '../../public/img/extend_icon_red.svg';
import { useState } from 'react';
import cn from 'classnames';
import { getCheckDetails } from '@/store/slices/checksSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';

export default function Check(props: ICheckProps) {
  const [check, setCheck] = useState<any>(props.check);
  const [extended, setExtended] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  // fetch extended data for particular user to show the widget
  const fetchDetailedData = async () => {
    const token = localStorage.getItem('token');
    const data = await dispatch(
      getCheckDetails({ token, id: check.validation_id })
    );
    setCheck(data.payload);
  };

  const toggleExtended = async () => {
    if (extended) {
      setExtended(false);
      setCheck(props.check);
    } else {
      setIsLoading(true);
      await fetchDetailedData();
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
                    props.check?.validation_id
                      ?.toString()
                      .toLowerCase()
                      .includes(props.query.search.toLowerCase()),
                })}
              >
                {props.check.validation_id}
              </span>
            </>
          ) : (
            <>
              <span
                className={cn({
                  [s.highlight]:
                    !!props.query.search &&
                    check?.full_name
                      ?.toString()
                      .toLowerCase()
                      .includes(props.query.search.toLowerCase()),
                })}
              >
                {check.full_name}
              </span>
              <span> </span>
              <span
                className={cn({
                  [s.highlight]:
                    (new Date(props?.query?.dateFrom?.toLowerCase()) <
                      new Date(check?.validation_date?.toLowerCase()) &&
                      !props.query.dateTo) ||
                    (!props.query.dateFrom &&
                      new Date(props?.query?.dateTo?.toLowerCase()) >
                        new Date(check?.validation_date?.toLowerCase())) ||
                    (new Date(props?.query?.dateFrom?.toLowerCase()) <
                      new Date(check?.validation_date?.toLowerCase()) &&
                      new Date(props?.query?.dateTo?.toLowerCase()) >
                        new Date(check?.validation_date?.toLowerCase())),
                })}
              >
                {check.validation_date.split(' ')[0].split('-')[2]}.
                {check.validation_date.split(' ')[0].split('-')[1]}.
                {check.validation_date.split(' ')[0].split('-')[0]}
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
        <div className={s.checkCustomerExt}>
          <div className={s.label}>
            <p className={s.mark}>ФИО сотрудника</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  check?.sotrudnik_name
                    ?.toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {check.sotrudnik_name}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Показания счётчиков</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  check?.sotrudnik_number
                    ?.toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {check.sotrudnik_number}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>ФИО клиента</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  check?.physic_name
                    ?.toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {check.physic_name}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Показания счётчиков</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  !!props.query.search &&
                  check?.physic_number
                    ?.toLowerCase()
                    .includes(props.query.search.toLowerCase()),
              })}
            >
              {check.physic_number}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Дата снятий показаний счётчиков</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  (new Date(props?.query?.dateFrom?.toLowerCase()) <
                    new Date(check?.physic_photo_date?.toLowerCase()) &&
                    !props.query.dateTo) ||
                  (!props.query.dateFrom &&
                    new Date(props?.query?.dateTo?.toLowerCase()) >
                      new Date(check?.physic_photo_date?.toLowerCase())) ||
                  (new Date(props?.query?.dateFrom?.toLowerCase()) <
                    new Date(check?.physic_photo_date?.toLowerCase()) &&
                    new Date(props?.query?.dateTo?.toLowerCase()) >
                      new Date(check?.physic_photo_date?.toLowerCase())),
              })}
            >
              {check.physic_photo_date}
            </p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Подозрительность проверки</p>
            <p className={s.input + ' ' + s.noUnderline}>{check.verdict}</p>
          </div>
          <div className={s.label}>
            <p className={s.mark}>Дата проверки показаний счётчиков</p>
            <p
              className={cn(s.input, s.noUnderline, {
                [s.highlight]:
                  (new Date(props?.query?.dateFrom?.toLowerCase()) <
                    new Date(check?.sotrudnik_photo_date?.toLowerCase()) &&
                    !props.query.dateTo) ||
                  (!props.query.dateFrom &&
                    new Date(props?.query?.dateTo?.toLowerCase()) >
                      new Date(check?.sotrudnik_photo_date?.toLowerCase())) ||
                  (new Date(props?.query?.dateFrom?.toLowerCase()) <
                    new Date(check?.sotrudnik_photo_date?.toLowerCase()) &&
                    new Date(props?.query?.dateTo?.toLowerCase()) >
                      new Date(check?.sotrudnik_photo_date?.toLowerCase())),
              })}
            >
              {check.sotrudnik_photo_date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
