import s from './PriceList.module.scss';
import { IPriceListProps } from './PriceList.props';
import ServiceItem from '../ServiceItem/ServiceItem';
import { useAppSelector } from '@/hooks/reduxHooks';
import AddServiceForm from '../AddServiceForm/AddServiceForm';

export default function PriceList({ itemsList }: IPriceListProps) {
  const { isAdmin } = useAppSelector((state) => state.auth);
  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <div className={s.columns}>
          <div className={s.column}>
            <h3 className={s.title}>ВРЕМЕННОЙ ПРОМЕЖУТОК</h3>
          </div>
          <div className={s.column}>
            <h3 className={s.title}>СТОИМОСТЬ</h3>
          </div>
        </div>
        {itemsList.map((s: any) => (
          <ServiceItem item={s} key={s.id_service} />
        ))}
        {isAdmin && <AddServiceForm />}
      </section>
    </div>
  );
}
