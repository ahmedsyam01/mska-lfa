import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Building, Users, FileText, Globe, Shield, ArrowRight, Award, Settings } from 'lucide-react';

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
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gradient mb-6">المؤسسات الحكومية</h1>
            <p className="text-xl text-mauritania-gold-dark">معلومات عن الوزارات والمؤسسات الحكومية في موريتانيا</p>
          </div>

          {/* Government Overview */}
          <div className="modern-card p-12 mb-16">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gradient">نظرة عامة على الحكومة</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-2">15+</h3>
                <p className="text-mauritania-gold-dark font-semibold">وزارة</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-2">50+</h3>
                <p className="text-mauritania-gold-dark font-semibold">مؤسسة</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-2">100+</h3>
                <p className="text-mauritania-gold-dark font-semibold">خدمة</p>
              </div>
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-2">24/7</h3>
                <p className="text-mauritania-gold-dark font-semibold">متاحة</p>
              </div>
            </div>
          </div>

          {/* Government Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {governmentData.map((institution) => (
              <div key={institution.id} className="modern-card overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
                <div className="relative h-56">
                  <img
                    src={institution.image || '/images/news/placeholder-1.jpg'}
                    alt={institution.titleAr || institution.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-mauritania-gold to-mauritania-red text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {institution.category}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-mauritania-green-dark mb-4 group-hover:text-mauritania-green transition-colors duration-300">
                    {institution.titleAr || institution.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {institution.descriptionAr || institution.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-mauritania-gold-dark bg-gradient-to-r from-mauritania-green/10 to-mauritania-gold/10 px-3 py-2 rounded-full border border-mauritania-green/20 font-semibold">
                      {institution.category}
                    </span>
                    {institution.url && (
                      <a
                        href={institution.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white px-6 py-3 rounded-xl hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                      >
                        <span>زيارة الموقع</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Services Section */}
          <div className="modern-card p-12">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gradient">الخدمات الحكومية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 border-2 border-mauritania-green/20 rounded-2xl hover:border-mauritania-green/40 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-mauritania-green-dark mb-3 group-hover:text-mauritania-green transition-colors duration-300">إصدار الوثائق</h3>
                <p className="text-mauritania-gold-dark leading-relaxed">إصدار الهويات وجوازات السفر والوثائق الرسمية</p>
              </div>
              <div className="text-center p-8 border-2 border-mauritania-gold/20 rounded-2xl hover:border-mauritania-gold/40 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-mauritania-green-dark mb-3 group-hover:text-mauritania-green transition-colors duration-300">التراخيص</h3>
                <p className="text-mauritania-gold-dark leading-relaxed">تراخيص البناء والتجارة والأنشطة الاقتصادية</p>
              </div>
              <div className="text-center p-8 border-2 border-mauritania-red/20 rounded-2xl hover:border-mauritania-red/40 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-mauritania-green-dark mb-3 group-hover:text-mauritania-green transition-colors duration-300">الخدمات الاجتماعية</h3>
                <p className="text-mauritania-gold-dark leading-relaxed">المساعدات الاجتماعية والرعاية الصحية</p>
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
