import Link from 'next/link';
import s from './Logs.module.scss';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import {
  getChecks,
  getCustomers,
  getMeters,
  getSuspChecks,
  getSuspMeters,
  incChecksPage,
  incCustomersPage,
  incMetersPage,
  incSuspChecksPage,
  resetChecksPageNo,
  resetMetersPageNo,
  resetSuspChecksPageNo,
  resetSuspMetersPageNo,
  resetCustomersPageNo,
} from '@/store/slices/checksSlice';
import { useEffect, useState } from 'react';
import Customer from '../ListItem/Customer';
import Meter from '../ListItem/Meter';
import api from '@/utils/api';
import PopupSystemMessage from '../PopupSystemMessage/PopupSystemMessage';
import downloadIcon from '../../public/img/download.svg';
import Image from 'next/image';
import TagsColumn from '../TagsColumn/TagsColumn';
import { ColumnSearchData } from '@/models/models';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Check from '../ListItem/Check';

export default function Logs() {
  const ITEMS_PER_PAGE = 15;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    customers,
    suspMeters,
    meters,
    metersPageNo,
    customersPageNo,
    suspMetersPageNo,
    customersTotalQty,
    metersTotalQty,
    suspMetersTotalQty,
    suspChecks,
    checks,
    checksPageNo,
    suspChecksPageNo,
    checksTotalQty,
    suspChecksTotalQty,
  } = useAppSelector((state) => state.checks);

  type FetchDataModeTypes =
    | 'customers'
    | 'suspMeters'
    | 'meters'
    | 'all'
    | 'suspChecks'
    | 'checks'
    | null;

  const [dataFetching, setDataFetching] = useState<FetchDataModeTypes>(null);
  const [systMsg, setSystMsg] = useState('');
  const [customersSearchApplied, setCustomersSearchApplied] = useState(false);
  const [metersSearchApplied, setMetersSearchApplied] = useState(false);
  const [suspMetersSearchApplied, setSuspMetersSearchApplied] = useState(false);
  const [checksSearchApplied, setChecksSearchApplied] = useState(false);
  const [suspChecksSearchApplied, setSuspChecksSearchApplied] = useState(false);
  const [customersQueryParam, setCustomerQueryParams] =
    useState<ColumnSearchData>({
      search: '',
      dateFrom: '',
      dateTo: '',
    });
  const [checksQueryParam, setChecksQueryParams] = useState<ColumnSearchData>({
    search: '',
    dateFrom: '',
    dateTo: '',
  });
  const [suspChecksQueryParam, setsuspChecksQueryParams] =
    useState<ColumnSearchData>({
      search: '',
      dateFrom: '',
      dateTo: '',
    });
  const [metersQueryParam, setMetersQueryParams] = useState<ColumnSearchData>({
    search: '',
    dateFrom: '',
    dateTo: '',
  });
  const [suspMetersQueryParam, setsuspMetersQueryParams] =
    useState<ColumnSearchData>({
      search: '',
      dateFrom: '',
      dateTo: '',
    });

  //Getting initial data for page by chunks
  const getCustomersList = async (params: {
    page: number;
    rewrite?: boolean;
    searchParams?: ColumnSearchData;
  }) => {
    const token = localStorage.getItem('token');
    await dispatch(getCustomers({ token, ...params }));
    setCustomersSearchApplied(
      !!params.searchParams?.dateFrom ||
        !!params.searchParams?.dateTo ||
        !!params.searchParams?.search
    );
  };
  const getSuspMetersList = async (params: {
    page: number;
    rewrite?: boolean;
    searchParams?: ColumnSearchData;
  }) => {
    const token = localStorage.getItem('token');
    await dispatch(getSuspMeters({ token, ...params }));
    setSuspMetersSearchApplied(
      !!params.searchParams?.dateFrom ||
        !!params.searchParams?.dateTo ||
        !!params.searchParams?.search
    );
  };
  const getMetersList = async (params: {
    page: number;
    rewrite?: boolean;
    searchParams?: ColumnSearchData;
  }) => {
    const token = localStorage.getItem('token');
    await dispatch(getMeters({ token, ...params }));
    setMetersSearchApplied(
      !!params.searchParams?.dateFrom ||
        !!params.searchParams?.dateTo ||
        !!params.searchParams?.search
    );
  };

  const getSuspCheckList = async (params: {
    page: number;
    rewrite?: boolean;
    searchParams?: ColumnSearchData;
  }) => {
    const token = localStorage.getItem('token');
    await dispatch(getSuspChecks({ token, ...params }));
    setSuspChecksSearchApplied(
      !!params.searchParams?.dateFrom ||
        !!params.searchParams?.dateTo ||
        !!params.searchParams?.search
    );
  };
  const getCheckList = async (params: {
    page: number;
    rewrite?: boolean;
    searchParams?: ColumnSearchData;
  }) => {
    const token = localStorage.getItem('token');
    await dispatch(getChecks({ token, ...params }));
    setChecksSearchApplied(
      !!params.searchParams?.dateFrom ||
        !!params.searchParams?.dateTo ||
        !!params.searchParams?.search
    );
  };

  //single func for getting all the initial chunks
  const fetchData = async () => {
    try {
      router.pathname === '/checks'
        ? Promise.all([
            getCustomersList({ page: customersPageNo }),
            getSuspCheckList({ page: suspChecksPageNo }),
            getCheckList({ page: checksPageNo }),
          ])
        : router.pathname === '/meters'
        ? Promise.all([
            getCustomersList({ page: customersPageNo }),
            getSuspMetersList({ page: suspMetersPageNo }),
            getMetersList({ page: metersPageNo }),
          ])
        : Promise.all([
            getCustomersList({ page: customersPageNo }),
            getSuspMetersList({ page: suspMetersPageNo }),
            getMetersList({ page: metersPageNo }),
            getSuspCheckList({ page: suspChecksPageNo }),
            getCheckList({ page: checksPageNo }),
          ]);
    } catch (err) {
      err.forEach((e) => console.log(e));
    }
  };

  // getting the new portion of the data to render

  const getCustomersPortion = async () => {
    if (
      customers.length % ITEMS_PER_PAGE ||
      customersPageNo * ITEMS_PER_PAGE - customers.length > ITEMS_PER_PAGE
    )
      return;
    dispatch(incCustomersPage());
    await getCustomersList({
      page: customersPageNo + 1,
      searchParams: customersQueryParam,
    });
  };

  const getMetersPortion = async () => {
    if (
      meters.length % ITEMS_PER_PAGE ||
      metersPageNo * ITEMS_PER_PAGE - meters.length > ITEMS_PER_PAGE
    )
      return;
    dispatch(incMetersPage());
    await getMetersList({
      page: metersPageNo + 1,
      searchParams: metersQueryParam,
    });
  };

  const getSuspMetersPortion = async () => {
    if (
      suspMeters.length % ITEMS_PER_PAGE ||
      suspMetersPageNo * ITEMS_PER_PAGE - suspMeters.length > ITEMS_PER_PAGE
    )
      return;
    dispatch(incSuspChecksPage());
    await getSuspMetersList({
      page: suspMetersPageNo + 1,
      searchParams: suspMetersQueryParam,
    });
  };

  const getChecksPortion = async () => {
    if (
      checks.length % ITEMS_PER_PAGE ||
      checksPageNo * ITEMS_PER_PAGE - checks.length > ITEMS_PER_PAGE
    )
      return;
    dispatch(incChecksPage());
    await getCheckList({
      page: checksPageNo + 1,
      searchParams: checksQueryParam,
    });
  };

  const getSuspChecksPortion = async () => {
    if (
      suspChecks.length % ITEMS_PER_PAGE ||
      suspChecksPageNo * ITEMS_PER_PAGE - suspChecks.length > ITEMS_PER_PAGE
    )
      return;
    dispatch(incSuspChecksPage());
    await getSuspCheckList({
      page: suspChecksPageNo + 1,
      searchParams: suspChecksQueryParam,
    });
  };

  const getDataPortion = async (mode: FetchDataModeTypes = 'all') => {
    try {
      switch (mode) {
        case 'all':
          const res = await Promise.all([
            getCustomersPortion(),
            getSuspMetersPortion(),
            getMetersPortion(),
          ]);
          break;
        case 'customers':
          getCustomersPortion();
          return;
        case 'meters':
          getMetersPortion();
          return;
        case 'suspMeters':
          getSuspMetersPortion();
          return;
        case 'checks':
          getChecksPortion();
          return;
        case 'suspChecks':
          getSuspChecksPortion();
          return;
        default:
          break;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDataFetching(null);
    }
  };

  useEffect(() => {
    dispatch(resetCustomersPageNo());
    getCustomersList({
      page: 1,
      searchParams: customersQueryParam,
      rewrite: true,
    });
  }, [
    customersQueryParam.dateFrom,
    customersQueryParam.dateTo,
    customersQueryParam.search,
  ]);

  useEffect(() => {
    dispatch(resetChecksPageNo());
    getCheckList({
      page: 1,
      searchParams: checksQueryParam,
      rewrite: true,
    });
  }, [
    checksQueryParam.dateFrom,
    checksQueryParam.dateTo,
    checksQueryParam.search,
  ]);

  useEffect(() => {
    dispatch(resetSuspChecksPageNo());
    getSuspCheckList({
      page: 1,
      searchParams: suspChecksQueryParam,
      rewrite: true,
    });
  }, [
    suspChecksQueryParam.dateFrom,
    suspChecksQueryParam.dateTo,
    suspChecksQueryParam.search,
  ]);
  useEffect(() => {
    dispatch(resetMetersPageNo());
    getMetersList({
      page: 1,
      searchParams: metersQueryParam,
      rewrite: true,
    });
  }, [
    metersQueryParam.dateFrom,
    metersQueryParam.dateTo,
    metersQueryParam.search,
  ]);
  useEffect(() => {
    dispatch(resetSuspMetersPageNo());
    getSuspMetersList({
      page: 1,
      searchParams: suspMetersQueryParam,
      rewrite: true,
    });
  }, [
    suspMetersQueryParam.dateFrom,
    suspMetersQueryParam.dateTo,
    suspMetersQueryParam.search,
  ]);

  const onFileSave = async () => {
    const msg = (await api.saveFile()).message;
    setSystMsg(msg);
  };

  // const scrollWatcher = (e) => {
  //   // needed to prevent duplicated fetch
  //   if (dataFetching || window.innerWidth <= 700) return;
  //   if (
  //     e.target.documentElement.scrollHeight -
  //       e.target.documentElement.scrollTop -
  //       window.innerHeight <
  //     ITEMS_PER_PAGE
  //   ) {
  //     setDataFetching('all');
  //     console.log('scroll');
  //   }
  // };

  useEffect(() => {
    fetchData();
    // window.addEventListener('scroll', scrollWatcher);
    // return () => window.removeEventListener('scroll', scrollWatcher);
  }, []);

  useEffect(() => {
    if (!dataFetching) return;
    getDataPortion(dataFetching);
  }, [dataFetching]);

  return (
    <section className={s.section}>
      <PopupSystemMessage
        externalSystMsg={systMsg}
        clearExtSystMsg={() => setSystMsg('')}
      />
      <button className={s.downloadBtn} onClick={onFileSave}>
        Файл статистики
        <Image
          src={downloadIcon}
          alt='Скачать файл статистики'
          className={s.downloadIcon}
        />
      </button>
      <div className={s.btnContainer}>
        <Link
          href='/meters'
          className={cn(s.link, { [s.blocked]: router.pathname === '/meters' })}
        >
          Клиенты
        </Link>
        <Link
          href='/checks'
          className={cn(s.link, { [s.blocked]: router.pathname === '/checks' })}
        >
          Проверки
        </Link>
        <Link
          href='/employees'
          className={cn(s.link, {
            [s.blocked]: router.pathname === '/employees',
          })}
        >
          Сотрудники
        </Link>
      </div>
      <div className={s.container}>
        <TagsColumn
          onLoadMore={() => {
            setDataFetching('customers');
          }}
          btnDisabled={customers.length >= customersTotalQty}
          title='Подключенные клиенты к нашей системе'
          withSearch={true}
          withoutDate={true}
          onSearchChange={(searchParams) => {
            setCustomerQueryParams(searchParams);
          }}
          totalQty={customersTotalQty}
          isSearchApplied={customersSearchApplied}
        >
          {customers.map((c) => (
            <Customer
              key={c.id_physic}
              customer={c}
              query={customersQueryParam}
            />
          ))}
        </TagsColumn>
        {router.pathname === '/meters' && (
          <>
            <TagsColumn
              onLoadMore={() => {
                setDataFetching('meters');
              }}
              btnDisabled={meters.length >= metersTotalQty}
              title='Показания'
              withSearch={true}
              onSearchChange={(searchParams) => {
                setMetersQueryParams(searchParams);
              }}
              totalQty={metersTotalQty}
              isSearchApplied={metersSearchApplied}
            >
              {meters.map((c) => {
                return (
                  <Meter
                    key={c.transaction_id}
                    item={c}
                    susp={false}
                    query={metersQueryParam}
                  />
                );
              })}
            </TagsColumn>
            <TagsColumn
              onLoadMore={() => {
                setDataFetching('suspMeters');
              }}
              btnDisabled={suspMeters.length >= suspMetersTotalQty}
              title='Подозрительные показания'
              withSearch={true}
              suspicious={true}
              onSearchChange={(searchParams) => {
                setsuspMetersQueryParams(searchParams);
              }}
              totalQty={suspMetersTotalQty}
              isSearchApplied={suspMetersSearchApplied}
            >
              {suspMeters.map((c) => (
                <Meter
                  key={c.transaction_id}
                  item={c}
                  susp={true}
                  query={suspMetersQueryParam}
                />
              ))}
            </TagsColumn>
          </>
        )}
        {router.pathname === '/checks' && (
          <>
            <TagsColumn
              onLoadMore={() => {
                setDataFetching('checks');
              }}
              btnDisabled={checks.length >= checksTotalQty}
              title='Проверки'
              withSearch={true}
              onSearchChange={(searchParams) => {
                setChecksQueryParams(searchParams);
              }}
              totalQty={checksTotalQty}
              isSearchApplied={checksSearchApplied}
            >
              {checks.map((c) => (
                <Check
                  key={c.validation_id}
                  check={c}
                  susp={false}
                  query={checksQueryParam}
                />
              ))}
            </TagsColumn>
            <TagsColumn
              onLoadMore={() => {
                setDataFetching('suspChecks');
              }}
              btnDisabled={suspChecks.length >= suspChecksTotalQty}
              title='Подозрительные проверки'
              withSearch={true}
              suspicious={true}
              onSearchChange={(searchParams) =>
                setsuspChecksQueryParams(searchParams)
              }
              totalQty={suspChecksTotalQty}
              isSearchApplied={suspChecksSearchApplied}
            >
              {suspChecks.map((c) => (
                <Check
                  key={c.validation_id}
                  check={c}
                  susp={true}
                  query={suspChecksQueryParam}
                />
              ))}
            </TagsColumn>
          </>
        )}
      </div>
    </section>
  );
}
