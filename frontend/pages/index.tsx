import Layout from '@/hok/Layout/Layout';
import AboutUs from '@/components/AboutUs/AboutUs';
import AboutTitle from '@/components/AboutTitle/AboutTitle';
import Directories from '@/components/Directories/Directories';
import Gallery from '@/components/Gallery/Gallery';
import Feedback from '@/components/Feedback/Feedback';
import HowToUse from '@/components/HowToUse/HowToUse';
import { useAppSelector } from '../hooks/reduxHooks';
import { URL_ENDPOINTS } from '@/utils/constants';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/reduxHooks';
import { setDescrLocally } from '@/store/slices/aboutSlice';
import Faq from '@/components/Faq/Faq';

export type HomeProps = {
  about_text: string;
  // articles: IArticle[];
};

export default function Home({ about_text }: HomeProps) {
  const { description } = useAppSelector((state) => state.about);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setDescrLocally(about_text));
  }, []);
  return (
    <Layout metaKeyWords='О нас, главная, Капля' title='О нас' withForm>
      <AboutTitle />
      <AboutUs text={description || about_text} />
      <Directories />
      <Gallery />
      <HowToUse />
      <Feedback />
      <Faq />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const Textdata = await fetch(
    process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.GET_ABOUT_US
  );
  // const articlesData = await fetch(
  //   process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.GET_ALL_ARTICLES
  // );
  const { about_text } = await Textdata.json();
  // const articles = await articlesData.json();
  return {
    props: {
      about_text,
      // articles,
    },
  };
};
