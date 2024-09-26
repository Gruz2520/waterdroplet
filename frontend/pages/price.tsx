import Layout from '@/hok/Layout/Layout';
import Intro from '@/components/Intro/Intro';
import PriceList from '@/components/PriceList/PriсeList';
import Contacts from '@/components/Contacts/Contacts';
import { GetStaticProps } from 'next';
import { URL_ENDPOINTS } from '@/utils/constants';
import { IService } from '@/components/PriceList/PriceList.props';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { setServicesLocally } from '@/store/slices/servicesSlice';
import { useEffect } from 'react';

export type PriceProps = {
  services: IService[];
};

export default function Price({ services }: PriceProps) {
  const dispatch = useAppDispatch();
  const { serviceList } = useAppSelector((state) => state.services);
  useEffect(() => {
    dispatch(setServicesLocally(services));
  }, []);
  return (
    <Layout metaKeyWords='цены, прайс, прайслист' title='Цены' withForm={true}>
      <Intro />
      <PriceList itemsList={serviceList.length > 0 ? serviceList : services} />
      <Contacts />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.GET_ALL_SERVICES
  );
  const services = await response.json();
  return {
    props: {
      services,
    },
  };
};
