import Link from 'next/link';
import s from './Employees.module.scss';
import { useEffect, useState } from 'react';
import { getEmployees } from '@/store/slices/employeesSlice';
import Employee from '../ListItem/Employee';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import Form from './Form';

export default function Employees() {
  const dispatch = useAppDispatch();

  const { employeesList } = useAppSelector((state) => state.employees);
  const [firstColList, setFirstColList] = useState([]);
  const [secondColList, setSecondColList] = useState([]);

  const calculateColumns = () => {
    if (window.innerWidth > 700) {
      setFirstColList(employeesList.filter((e, i) => !(i % 2)));
      setSecondColList(employeesList.filter((e, i) => !!(i % 2)));
    } else {
      setFirstColList(employeesList);
      setSecondColList([]);
    }
  };

  const fetchEmpList = async () => {
    const token = localStorage.getItem('token');
    await dispatch(getEmployees(token));
  };

  useEffect(() => {
    fetchEmpList();
  }, []);

  useEffect(() => {
    window.removeEventListener('resize', calculateColumns);
    window.addEventListener('resize', calculateColumns);
    calculateColumns();
    return () => window.removeEventListener('resize', calculateColumns);
  }, [employeesList]);

  return (
    <section className={s.section}>
      <div className={s.btnContainer}>
        <Link href='/meters' className={s.link}>
          Клиенты
        </Link>
        <Link href='/checks' className={s.link}>
          Проверки
        </Link>
        <Link href='/employees' className={[s.link, s.blocked].join(' ')}>
          Сотрудники
        </Link>
      </div>
      <div className={s.container}>
        <div className={s.column}>
          {firstColList.map((e, i) => (
            <Employee employee={e} key={e.id_sotrudnik} />
          ))}
        </div>
        <div className={[s.column, s.colSecond].join(' ')}>
          {secondColList.map((e, i) => (
            <Employee employee={e} key={e.id_sotrudnik} />
          ))}
        </div>
        <div className={s.column}>
          <Form />
        </div>
      </div>
    </section>
  );
}
