import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MapPin, Users, Building, Trees } from 'lucide-react';

interface RegionalInfo {
  id: string;
  name: string;
  nameAr?: string;
  capital: string;
  capitalAr?: string;
  population: string;
  area: string;
  description: string;
  descriptionAr?: string;
  image?: string;
  highlights: string[];
}

const RegionalPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [regions, setRegions] = useState<RegionalInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API call when available
    const fetchRegionalData = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData: RegionalInfo[] = [
          {
            id: '1',
            name: 'Nouakchott',
            nameAr: 'نواكشوط',
            capital: 'Nouakchott',
            capitalAr: 'نواكشوط',
            population: '958,399',
            area: '1,000 km²',
            description: 'العاصمة وأكبر مدينة في موريتانيا، مركز اقتصادي وإداري مهم',
            descriptionAr: 'العاصمة وأكبر مدينة في موريتانيا، مركز اقتصادي وإداري مهم',
            image: '/images/news/economics-nouakchott.jpg',
            highlights: ['عاصمة البلاد', 'مركز اقتصادي', 'ميناء بحري', 'مطار دولي']
          },
          {
            id: '2',
            name: 'Hodh Ech Chargui',
            nameAr: 'الحوض الشرقي',
            capital: 'Néma',
            capitalAr: 'النعمة',
            population: '430,668',
            area: '182,700 km²',
            description: 'منطقة حدودية مع مالي، تتميز بالزراعة والرعي',
            descriptionAr: 'منطقة حدودية مع مالي، تتميز بالزراعة والرعي',
            image: '/images/news/education-rural.jpg',
            highlights: ['زراعة', 'رعي', 'حدود مالية', 'مناظر طبيعية']
          },
          {
            id: '3',
            name: 'Hodh El Gharbi',
            nameAr: 'الحوض الغربي',
            capital: 'Ayoun el Atrous',
            capitalAr: 'العيون',
            population: '294,109',
            area: '53,400 km²',
            description: 'منطقة زراعية خصبة، تعتمد على نهر السنغال',
            descriptionAr: 'منطقة زراعية خصبة، تعتمد على نهر السنغال',
            image: '/images/news/healthcare-mobile.jpg',
            highlights: ['زراعة خصبة', 'نهر السنغال', 'منتجات زراعية', 'مياه وفيرة']
          },
          {
            id: '4',
            name: 'Assaba',
            nameAr: 'آسابا',
            capital: 'Kiffa',
            capitalAr: 'كيفة',
            population: '325,897',
            area: '36,600 km²',
            description: 'منطقة جبلية، معروفة بالمناجم والموارد الطبيعية',
            descriptionAr: 'منطقة جبلية، معروفة بالمناجم والموارد الطبيعية',
            image: '/images/news/tech-innovation.jpg',
            highlights: ['مناجم', 'جبال', 'موارد طبيعية', 'مناظر خلابة']
          },
          {
            id: '5',
            name: 'Gorgol',
            nameAr: 'كوركول',
            capital: 'Kaédi',
            capitalAr: 'كيدي',
            population: '335,917',
            area: '13,600 km²',
            description: 'منطقة خصبة على ضفاف نهر السنغال، معروفة بالزراعة',
            descriptionAr: 'منطقة خصبة على ضفاف نهر السنغال، معروفة بالزراعة',
            image: '/images/news/economics-1.jpg',
            highlights: ['نهر السنغال', 'زراعة', 'خصوبة', 'مياه']
          },
          {
            id: '6',
            name: 'Brakna',
            nameAr: 'براكنة',
            capital: 'Aleg',
            capitalAr: 'ألاك',
            population: '312,277',
            area: '37,100 km²',
            description: 'منطقة ساحلية، معروفة بالصيد البحري والسياحة',
            descriptionAr: 'منطقة ساحلية، معروفة بالصيد البحري والسياحة',
            image: '/images/news/sports-festival.jpg',
            highlights: ['ساحل بحري', 'صيد بحري', 'سياحة', 'شواطئ']
          }
        ];
        
        setRegions(mockData);
      } catch (error) {
        console.error('Error fetching regional data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionalData();
  }, []);

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">المناطق الجهوية</h1>
            <p className="text-xl text-gray-600">اكتشف تنوع وثراء مناطق موريتانيا</p>
          </div>

          {/* Regional Overview */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <MapPin className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">15</h3>
                <p>منطقة</p>
              </div>
              <div>
                <Users className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">4.6M+</h3>
                <p>ساكن</p>
              </div>
              <div>
                <Building className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">216</h3>
                <p>بلدية</p>
              </div>
              <div>
                <Trees className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">1M+</h3>
                <p>كم² مساحة</p>
              </div>
            </div>
          </div>

          {/* Regions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regions.map((region) => (
              <div key={region.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={region.image || '/images/news/placeholder-1.jpg'}
                    alt={region.nameAr || region.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {region.nameAr || region.name}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {region.nameAr || region.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {region.descriptionAr || region.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>العاصمة: {region.capitalAr || region.capital}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>السكان: {region.population}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Trees className="w-4 h-4 text-purple-600" />
                      <span>المساحة: {region.area}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">المميزات:</h4>
                    <div className="flex flex-wrap gap-1">
                      {region.highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    اكتشف المزيد
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Map Section */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">خريطة المناطق</h2>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-16 h-16 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-4">
                خريطة تفاعلية لجميع مناطق موريتانيا مع معلومات مفصلة عن كل منطقة
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200">
                عرض الخريطة
              </button>
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

export default RegionalPage;
