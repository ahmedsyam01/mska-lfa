import React from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Globe, ExternalLink, Star } from 'lucide-react';

const SitesPage: React.FC = () => {
  const { t } = useTranslation('common');

  const siteCategories = [
    {
      id: 1,
      name: 'المواقع الإخبارية',
      description: 'أهم المواقع الإخبارية الموريتانية والعربية',
      sites: [
        {
          name: 'وكالة الأنباء الموريتانية',
          url: 'https://www.ami.mr',
          description: 'الوكالة الرسمية للأخبار في موريتانيا',
          rating: 5,
          isOfficial: true
        },
        {
          name: 'موقع موريتانيا الآن',
          url: 'https://www.rimna.com',
          description: 'موقع إخباري شامل يغطي أخبار موريتانيا',
          rating: 4,
          isOfficial: false
        },
        {
          name: 'صحيفة الشعب',
          url: 'https://www.chaab.mr',
          description: 'صحيفة موريتانية يومية',
          rating: 4,
          isOfficial: false
        }
      ]
    },
    {
      id: 2,
      name: 'المواقع الحكومية',
      description: 'المواقع الرسمية للوزارات والمؤسسات الحكومية',
      sites: [
        {
          name: 'رئاسة الجمهورية',
          url: 'https://www.presidence.mr',
          description: 'الموقع الرسمي لرئاسة الجمهورية الموريتانية',
          rating: 5,
          isOfficial: true
        },
        {
          name: 'وزارة الخارجية',
          url: 'https://www.diplomatie.mr',
          description: 'الموقع الرسمي لوزارة الخارجية والتعاون',
          rating: 4,
          isOfficial: true
        },
        {
          name: 'وزارة الداخلية',
          url: 'https://www.interieur.mr',
          description: 'الموقع الرسمي لوزارة الداخلية',
          rating: 4,
          isOfficial: true
        }
      ]
    },
    {
      id: 3,
      name: 'المواقع التعليمية',
      description: 'مواقع الجامعات والمؤسسات التعليمية',
      sites: [
        {
          name: 'جامعة نواكشوط',
          url: 'https://www.univ-nkc.mr',
          description: 'الموقع الرسمي لجامعة نواكشوط',
          rating: 4,
          isOfficial: true
        },
        {
          name: 'معهد الدراسات العليا',
          url: 'https://www.ies.mr',
          description: 'معهد الدراسات العليا في موريتانيا',
          rating: 4,
          isOfficial: true
        }
      ]
    },
    {
      id: 4,
      name: 'المواقع التجارية',
      description: 'مواقع الشركات والمؤسسات التجارية',
      sites: [
        {
          name: 'بنك موريتانيا المركزي',
          url: 'https://www.bcm.mr',
          description: 'الموقع الرسمي للبنك المركزي الموريتاني',
          rating: 5,
          isOfficial: true
        },
        {
          name: 'شركة موريتانيا للكهرباء',
          url: 'https://www.somelec.mr',
          description: 'الموقع الرسمي لشركة الكهرباء',
          rating: 4,
          isOfficial: true
        }
      ]
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">المواقع</h1>
            <p className="text-xl text-gray-600">مجموعة من أهم المواقع الموريتانية المفيدة</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن مواقع..."
                className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Site Categories */}
          <div className="space-y-8">
            {siteCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                  <p className="text-blue-100">{category.description}</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.sites.map((site, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
                          {site.isOfficial && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              رسمي
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{site.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(site.rating)}
                          </div>
                          <span className="text-sm text-gray-500">{site.rating}/5</span>
                        </div>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                          زيارة الموقع
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit New Site */}
          <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">اقترح موقع جديد</h2>
            <p className="text-green-100 mb-6">
              هل تعرف موقع موريتاني مفيد؟ ساعدنا في إضافته إلى قائمتنا
            </p>
            <button className="bg-white text-green-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200">
              اقترح موقع
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

export default SitesPage;
