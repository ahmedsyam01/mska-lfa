import React from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ArticlesPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">كُتاب موريتانيا</h1>
            <p className="text-xl text-gray-600">صفحة الكُتاب والمقالات</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              صفحة كُتاب موريتانيا ستكون متاحة قريباً
            </p>
            <p className="text-gray-500">
              Mauritanian Writers page will be available soon
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ArticlesPage;
