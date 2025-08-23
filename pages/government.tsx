import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Building, Users, FileText, Globe } from 'lucide-react';

interface GovernmentInfo {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  image?: string;
  url?: string;
}

const GovernmentPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [governmentData, setGovernmentData] = useState<GovernmentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API call when available
    const fetchGovernmentData = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData: GovernmentInfo[] = [
          {
            id: '1',
            title: 'رئاسة الجمهورية',
            titleAr: 'رئاسة الجمهورية',
            description: 'المؤسسة الرئاسية العليا في موريتانيا',
            descriptionAr: 'المؤسسة الرئاسية العليا في موريتانيا',
            category: 'رئاسة',
            image: '/images/news/economics-1.jpg',
            url: 'https://www.presidence.mr'
          },
          {
            id: '2',
            title: 'وزارة الخارجية',
            titleAr: 'وزارة الخارجية',
            description: 'وزارة الشؤون الخارجية والتعاون',
            descriptionAr: 'وزارة الشؤون الخارجية والتعاون',
            category: 'خارجية',
            image: '/images/news/economics-nouakchott.jpg',
            url: 'https://www.diplomatie.mr'
          },
          {
            id: '3',
            title: 'وزارة الداخلية',
            titleAr: 'وزارة الداخلية',
            description: 'وزارة الداخلية واللامركزية',
            descriptionAr: 'وزارة الداخلية واللامركزية',
            category: 'داخلية',
            image: '/images/news/tech-innovation.jpg',
            url: 'https://www.interieur.mr'
          },
          {
            id: '4',
            title: 'وزارة التعليم',
            titleAr: 'وزارة التعليم',
            description: 'وزارة التهذيب الوطني والتعليم الأساسي',
            descriptionAr: 'وزارة التهذيب الوطني والتعليم الأساسي',
            category: 'تعليم',
            image: '/images/news/education-rural.jpg',
            url: 'https://www.education.mr'
          },
          {
            id: '5',
            title: 'وزارة الصحة',
            titleAr: 'وزارة الصحة',
            description: 'وزارة الصحة',
            descriptionAr: 'وزارة الصحة',
            category: 'صحة',
            image: '/images/news/healthcare-mobile.jpg',
            url: 'https://www.sante.mr'
          },
          {
            id: '6',
            title: 'وزارة الاقتصاد',
            titleAr: 'وزارة الاقتصاد',
            description: 'وزارة الاقتصاد والصناعة',
            descriptionAr: 'وزارة الاقتصاد والصناعة',
            category: 'اقتصاد',
            image: '/images/news/economics-1.jpg',
            url: 'https://www.economie.mr'
          }
        ];
        
        setGovernmentData(mockData);
      } catch (error) {
        console.error('Error fetching government data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGovernmentData();
  }, []);

  const categories = ['جميع', 'رئاسة', 'خارجية', 'داخلية', 'تعليم', 'صحة', 'اقتصاد'];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">جاري التحميل...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">المؤسسات الحكومية</h1>
            <p className="text-xl text-gray-600">معلومات عن الوزارات والمؤسسات الحكومية في موريتانيا</p>
          </div>

          {/* Government Overview */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <Building className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">15+</h3>
                <p>وزارة</p>
              </div>
              <div>
                <Users className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">50+</h3>
                <p>مؤسسة</p>
              </div>
              <div>
                <FileText className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">100+</h3>
                <p>خدمة</p>
              </div>
              <div>
                <Globe className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">24/7</h3>
                <p>متاحة</p>
              </div>
            </div>
          </div>

          {/* Government Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {governmentData.map((institution) => (
              <div key={institution.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={institution.image || '/images/news/placeholder-1.jpg'}
                    alt={institution.titleAr || institution.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {institution.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {institution.titleAr || institution.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {institution.descriptionAr || institution.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {institution.category}
                    </span>
                    {institution.url && (
                      <a
                        href={institution.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        زيارة الموقع
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Services Section */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">الخدمات الحكومية</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">إصدار الوثائق</h3>
                <p className="text-gray-600">إصدار الهويات وجوازات السفر والوثائق الرسمية</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">التراخيص</h3>
                <p className="text-gray-600">تراخيص البناء والتجارة والأنشطة الاقتصادية</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">الخدمات الاجتماعية</h3>
                <p className="text-gray-600">المساعدات الاجتماعية والرعاية الصحية</p>
              </div>
            </div>
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

export default GovernmentPage;
