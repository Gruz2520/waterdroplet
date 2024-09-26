import Layout from '@/hok/Layout/Layout';
import DocIntro from '@/components/DocIntro/DocIntro';
import ReqStructure from '@/components/ReqStructure/ReqStructure';
import TokenIntro from '@/components/TokenIntro/TokenIntro';
import RequestTypes from '@/components/RequestTypes/RequestTypes';

export default function Docs() {
  return (
    <Layout
      metaKeyWords='документация, API, подключение'
      title='Документация'
      withForm
    >
      <DocIntro />
      <ReqStructure />
      <TokenIntro />
      <RequestTypes />
    </Layout>
  );
}
