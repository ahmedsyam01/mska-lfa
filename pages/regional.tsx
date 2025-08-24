import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MapPin, Users, Building, Trees, Globe, ArrowRight, Compass } from 'lucide-react';

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
        <div className="min-h-screen py-12" dir="rtl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xl text-mauritania-gold-dark font-semibold">جاري التحميل...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-3xl flex items-center justify-center shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gradient mb-6">المناطق الجهوية</h1>
            <p className="text-xl text-mauritania-gold-dark">اكتشف تنوع وثراء مناطق موريتانيا</p>
          </div>

          {/* Regional Overview */}
          <div className="modern-card p-12 mb-16">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gradient">نظرة عامة على المناطق</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-2">15</h3>
                <p className="text-mauritania-gold-dark font-semibold">منطقة</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-2">4.6M+</h3>
                <p className="text-mauritania-gold-dark font-semibold">ساكن</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-2">216</h3>
                <p className="text-mauritania-gold-dark font-semibold">بلدية</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Trees className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-2">1M+</h3>
                <p className="text-mauritania-gold-dark font-semibold">كم² مساحة</p>
              </div>
            </div>
          </div>

          {/* Regions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {regions.map((region) => (
              <div key={region.id} className="modern-card overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
                <div className="relative h-56">
                  <img
                    src={region.image || '/images/news/placeholder-1.jpg'}
                    alt={region.nameAr || region.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {region.nameAr || region.name}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-mauritania-green-dark mb-4 group-hover:text-mauritania-green transition-colors duration-300">
                    {region.nameAr || region.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {region.descriptionAr || region.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-mauritania-gold-dark">
                      <div className="w-8 h-8 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold">العاصمة: {region.capitalAr || region.capital}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-mauritania-gold-dark">
                      <div className="w-8 h-8 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold">السكان: {region.population}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-mauritania-gold-dark">
                      <div className="w-8 h-8 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-lg flex items-center justify-center">
                        <Trees className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold">المساحة: {region.area}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-mauritania-green-dark mb-3">المميزات:</h4>
                    <div className="flex flex-wrap gap-2">
                      {region.highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 text-mauritania-green-dark text-xs px-3 py-2 rounded-full border border-mauritania-green/20 font-semibold"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white py-3 px-6 rounded-xl hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                    <span>اكتشف المزيد</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Map Section */}
          <div className="modern-card p-12">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gradient mb-6">خريطة المناطق</h2>
              <p className="text-mauritania-gold-dark text-lg mb-8">
                خريطة تفاعلية لجميع مناطق موريتانيا مع معلومات مفصلة عن كل منطقة
              </p>
              <button className="bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white px-8 py-4 rounded-2xl font-bold hover:from-mauritania-red hover:to-mauritania-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
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
