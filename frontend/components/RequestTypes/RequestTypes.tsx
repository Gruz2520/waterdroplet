import s from './RequestTypes.module.scss';
import RequestTypesItem from './RequestTypesItem/RequestTypesItem';
import { REQUESTS, ERRORS } from '@/public/data/requestTypes';

export default function RequestTypes() {
  return (
    <div className={s.wrapper}>
      <div className={s.section}>
        <h2 className={s.title}>Типы запросов</h2>
        {REQUESTS.map((r) => (
          <RequestTypesItem request={r} key={r.id} />
        ))}
        <div className={s.errors}>
          <p className={s.error}>Ошибки</p>
          {ERRORS.map((e) => (
            <p key={e.id} className={s.error}>
              {e.code + ' - ' + e.desc}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
