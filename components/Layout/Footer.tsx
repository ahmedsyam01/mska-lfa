import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ر</span>
              </div>
              <span className="text-xl font-bold">ريمنا</span>
            </div>
            <p className="text-gray-400 text-sm text-right">
              مصدرك الموثوق للأخبار الموريتانية والتوجهات وصحافة المواطن
            </p>
            <div className="flex space-x-4 space-x-reverse justify-end">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-right text-white">روابط سريعة</h3>
            <ul className="space-y-2 text-right">
              <li><Link href="/" className="text-gray-400 hover:text-white">الرئيسية</Link></li>
              <li><Link href="/news" className="text-gray-400 hover:text-white">الأخبار</Link></li>
              <li><Link href="/trending" className="text-gray-400 hover:text-white">الرائج</Link></li>
              <li><Link href="/celebrities" className="text-gray-400 hover:text-white">المشاهير</Link></li>
              <li><Link href="/rankings" className="text-gray-400 hover:text-white">التصنيفات</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-right text-white">الفئات</h3>
            <ul className="space-y-2 text-right">
              <li><Link href="/news?category=politics" className="text-gray-400 hover:text-white">السياسة</Link></li>
              <li><Link href="/news?category=sports" className="text-gray-400 hover:text-white">الرياضة</Link></li>
              <li><Link href="/news?category=technology" className="text-gray-400 hover:text-white">التكنولوجيا</Link></li>
              <li><Link href="/news?category=culture" className="text-gray-400 hover:text-white">الثقافة</Link></li>
              <li><Link href="/news?category=economy" className="text-gray-400 hover:text-white">الاقتصاد</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-right text-white">تواصل معنا</h3>
            <ul className="space-y-2 text-gray-400 text-right">
              <li>البريد الإلكتروني: info@rimna.mr</li>
              <li>الهاتف: +222 XX XX XX XX</li>
              <li>العنوان: نواكشوط، موريتانيا</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row-reverse justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ريمنا. جميع الحقوق محفوظة
          </p>
          <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
              شروط الاستخدام
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm">
              اتصل بنا
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 