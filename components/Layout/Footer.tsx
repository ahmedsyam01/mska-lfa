import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-mauritania-green-dark via-mauritania-green to-mauritania-green-light text-white" dir="rtl">
      {/* Top accent bar with Mauritania colors */}
      <div className="h-1 bg-gradient-to-r from-mauritania-green via-mauritania-gold to-mauritania-red"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-mauritania-gold via-mauritania-red to-mauritania-green rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">ر</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">ريمنا</span>
                <div className="text-xs text-mauritania-gold-light opacity-80">WWW.RIMNOW.COM</div>
              </div>
            </div>
            <p className="text-white/90 text-sm text-right leading-relaxed">
              مصدرك الموثوق للأخبار الموريتانية والتوجهات وصحافة المواطن
            </p>
            <div className="flex space-x-4 space-x-reverse justify-end">
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-110">
                <Facebook className="h-5 w-5 text-mauritania-gold-light" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-110">
                <Twitter className="h-5 w-5 text-mauritania-gold-light" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-110">
                <Instagram className="h-5 w-5 text-mauritania-gold-light" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-110">
                <Youtube className="h-5 w-5 text-mauritania-gold-light" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-right text-white relative">
              روابط سريعة
              <div className="absolute bottom-0 right-0 w-12 h-1 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full"></div>
            </h3>
            <ul className="space-y-3 text-right">
              <li>
                <Link href="/" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>الرئيسية</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>الأخبار</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>الرائج</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
              <li>
                <Link href="/celebrities" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>المشاهير</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>التصنيفات</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-right text-white relative">
              الفئات
              <div className="absolute bottom-0 right-0 w-12 h-1 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full"></div>
            </h3>
            <ul className="space-y-3 text-right">
              <li>
                <Link href="/news?category=politics" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>السياسة</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
              <li>
                <Link href="/news?category=sports" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>الرياضة</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
              <li>
                <Link href="/news?category=technology" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>التكنولوجيا</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
              <li>
                <Link href="/news?category=culture" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>الثقافة</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
              <li>
                <Link href="/news?category=economy" className="text-white/80 hover:text-mauritania-gold-light transition-colors duration-300 flex items-center justify-start space-x-2 space-x-reverse group">
                  <span>الاقتصاد</span>
                  <div className="w-0 h-0.5 bg-mauritania-gold transition-all duration-300 group-hover:w-4"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-right text-white relative">
              تواصل معنا
              <div className="absolute bottom-0 right-0 w-12 h-1 bg-gradient-to-r from-mauritania-gold to-mauritania-red rounded-full"></div>
            </h3>
            <ul className="space-y-4 text-white/80 text-right">
              <li className="flex items-center justify-start space-x-3 space-x-reverse">
                <Mail className="h-5 w-5 text-mauritania-gold-light" />
                <span>info@rimna.mr</span>
              </li>
              <li className="flex items-center justify-start space-x-3 space-x-reverse">
                <Phone className="h-5 w-5 text-mauritania-gold-light" />
                <span>+222 XX XX XX XX</span>
              </li>
              <li className="flex items-center justify-start space-x-3 space-x-reverse">
                <MapPin className="h-5 w-5 text-mauritania-gold-light" />
                <span>نواكشوط، موريتانيا</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row-reverse justify-between items-center">
          <p className="text-white/70 text-sm flex items-center space-x-2 space-x-reverse">
          <Heart className="h-4 w-4 text-mauritania-red animate-pulse" />
            <span>© 2025 ريمنا. جميع الحقوق محفوظة</span>
           
          </p>
          <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0">
            <Link href="/privacy" className="text-white/70 hover:text-mauritania-gold-light transition-colors duration-300 text-sm">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-white/70 hover:text-mauritania-gold-light transition-colors duration-300 text-sm">
              شروط الاستخدام
            </Link>
            <Link href="/contact" className="text-white/70 hover:text-mauritania-gold-light transition-colors duration-300 text-sm">
              اتصل بنا
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 