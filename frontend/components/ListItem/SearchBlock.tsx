import { SearchBlockProps } from './SearchBlock.props';
import s from './ListItem.module.scss';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import filterIcon from '@/public/img/Frame.svg';
import cn from 'classnames';

export default function SearchBlock(props: SearchBlockProps) {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState({ from: '', to: '' });
  const { susp, onSearchChange, withoutDate } = props;
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const searchParams = {
      search: searchText,
      dateFrom: date.from,
      dateTo: date.to,
    };
    console.log(withoutDate);

    onSearchChange(searchParams);
  }, [date.from, date.to]);

  // separate useEffect for debounce
  useEffect(() => {
    let searchTimeOut = setTimeout(() => {
      const searchParams = {
        search: searchText,
        dateFrom: date.from,
        dateTo: date.to,
      };
      onSearchChange(searchParams);
    }, 300);
    return () => clearTimeout(searchTimeOut);
  }, [searchText, date.from, date.to]);

  useEffect(() => {
    if (isModalOpen) {
      document.querySelector('body').style.overflow = 'hidden';
    } else {
      document.querySelector('body').style.overflow = 'auto';
    }
  }, [isModalOpen]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div
      className={
        susp
          ? s.listItemRed + ' ' + s.searchItem
          : s.listItem + ' ' + s.searchItem
      }
    >
      <input
        className={s.searchInput}
        type='text'
        value={searchText}
        placeholder='Поиск'
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
      />
      {!withoutDate && (
        <button
          className={cn(s.filterBtn, { [s.highlighted]: date.from || date.to })}
          type='button'
          onClick={toggleModal}
        >
          <Image src={filterIcon} alt='Открыть настройки поиска' />
        </button>
      )}
      {isModalOpen && (
        <div
          className={s.modalwrapper}
          onClick={(e) => {
            setIsModalOpen(false);
          }}
        >
          <form
            className={s.modal}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3 className={s.modalTitle}>Интервал дат поиска</h3>
            <label htmlFor='dateFrom' className={s.inputLabel}>
              Начало периода
              <input
                type='date'
                className={s.dateInput}
                name='dateFrom'
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </label>
            <label htmlFor='dateTo' className={s.inputLabel}>
              Конец периода
              <input
                type='date'
                className={s.dateInput}
                name='dateTo'
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </label>
            <button
              className={s.buttonSolid}
              onClick={(e) => {
                e.preventDefault();
                setDate({ from: dateFrom, to: dateTo });
                setIsModalOpen(false);
              }}
            >
              Применить
            </button>
            <button
              className={s.buttonTrans}
              onClick={(e) => {
                e.preventDefault();
                setDate({ from: '', to: '' });
                setDateFrom('');
                setDateTo('');
                setIsModalOpen(false);
              }}
            >
              Cбросить
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
