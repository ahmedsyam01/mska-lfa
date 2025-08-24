import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Globe } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'البريد الإلكتروني',
      value: 'info@rimna.com',
      description: 'راسلنا عبر البريد الإلكتروني'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'الهاتف',
      value: '+222 1234 5678',
      description: 'اتصل بنا مباشرة'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'العنوان',
      value: 'نواكشوط، موريتانيا',
      description: 'مقرنا الرئيسي'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'ساعات العمل',
      value: 'الأحد - الخميس',
      description: '8:00 ص - 6:00 م'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen py-12" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-3xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gradient mb-6">اتصل بنا</h1>
            <p className="text-xl text-mauritania-gold-dark">نحن هنا للإجابة على أسئلتك واستقبال اقتراحاتك</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="modern-card p-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark rounded-xl flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gradient">أرسل رسالة</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-mauritania-green-dark mb-3">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 border-2 border-mauritania-green/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-mauritania-green-dark mb-3">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 border-2 border-mauritania-green/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-mauritania-green-dark mb-3">
                    الموضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-mauritania-green/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg"
                    placeholder="أدخل موضوع الرسالة"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-mauritania-green-dark mb-3">
                    الرسالة
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 border-2 border-mauritania-green/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Send className="w-6 h-6" />
                  إرسال الرسالة
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="modern-card p-10">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gradient">معلومات الاتصال</h2>
                </div>
                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-2xl flex items-center justify-center text-white shadow-lg">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-mauritania-green-dark mb-2">{info.title}</h3>
                        <p className="text-mauritania-gold-dark font-semibold text-lg mb-1">{info.value}</p>
                        <p className="text-gray-600">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="modern-card p-10">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark rounded-xl flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gradient">تابعنا</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex items-center gap-4 p-6 bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white rounded-2xl hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold">f</span>
                    </div>
                    <span className="font-semibold">فيسبوك</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-4 p-6 bg-gradient-to-r from-mauritania-gold to-mauritania-gold-dark text-white rounded-2xl hover:from-mauritania-gold-dark hover:to-mauritania-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold">ت</span>
                    </div>
                    <span className="font-semibold">تويتر</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-4 p-6 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark text-white rounded-2xl hover:from-mauritania-red-dark hover:to-mauritania-red transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold">ي</span>
                    </div>
                    <span className="font-semibold">يوتيوب</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-4 p-6 bg-gradient-to-r from-mauritania-green to-mauritania-gold text-white rounded-2xl hover:from-mauritania-gold hover:to-mauritania-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold">و</span>
                    </div>
                    <span className="font-semibold">واتساب</span>
                  </a>
                </div>
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

export default ContactPage;
