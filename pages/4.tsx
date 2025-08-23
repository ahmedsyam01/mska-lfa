import React from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Page4: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">الصفحة 4</h1>
            <p className="text-xl text-gray-600">محتوى الصفحة الرابعة</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-32 h-32 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-purple-600">4</span>
            </div>
            <p className="text-gray-600 mb-4">هذه الصفحة تحت الإنشاء. سيتم إضافة المحتوى قريباً.</p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors duration-200">
              العودة للصفحة الرئيسية
            </button>
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

export default Page4;
