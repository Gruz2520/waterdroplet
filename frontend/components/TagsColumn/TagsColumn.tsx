import s from './TagsColumn.module.scss';
import { TagsColumnProps } from './TagsColumn.props';
import Image from 'next/image';
import searchIcon from '@/public/img/search_icon.svg';
import cn from 'classnames';
import { useState } from 'react';
import SearchBlock from '../ListItem/SearchBlock';

const TagsColumn = (props: TagsColumnProps) => {
  const {
    children,
    onLoadMore,
    onSearchChange,
    btnDisabled,
    title,
    suspicious,
    withSearch,
    withoutDate,
    isSearchApplied,
    totalQty,
  } = props;

  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = () => setSearchOpen(!searchOpen);

  return (
    <div className={s.column}>
      <div className={s.heading}>
        <h2 className={cn(s.colHead, { [s.red]: suspicious })}>
          {title}
          {isSearchApplied && <span>({totalQty})</span>}
        </h2>
        {withSearch && (
          <button className={s.searchBtn} onClick={toggleSearch}>
            <Image
              src={searchIcon}
              alt='Кнопка поиска'
              className={s.searchIcon}
            />
          </button>
        )}
      </div>
      {searchOpen && (
        <SearchBlock
          withoutDate={withoutDate}
          onSearchChange={onSearchChange}
          susp={suspicious}
        />
      )}
      {children}
      <button
        className={cn(s.btn, s.red, {
          [s.disabled]: btnDisabled,
        })}
        onClick={onLoadMore}
      >
        {/* {dataFetching === 'suspChecks' ? 'Загрузка...' : 'Загрузить ещё'} */}
        Загрузить ещё
      </button>
    </div>
  );
};

export default TagsColumn;
