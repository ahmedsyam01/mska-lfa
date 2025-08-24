import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Globe, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { name: 'الصفحة الأولى', href: '/', isActive: true },
    { name: '2', href: '/2' },
    { name: '3', href: '/3' },
    { name: '4', href: '/4' },
    { name: '5', href: '/5' },
    { name: '6', href: '/6' },
    { name: '7', href: '/7' },
    { name: '8', href: '/8' },
    { name: '9', href: '/9' },
    { name: '10', href: '/10' },
    { name: '11', href: '/11' },
    { name: 'أخبار', href: '/news' },
    { name: 'تغطيات', href: '/reports', isHighlighted: true },
    { name: 'كُتاب موريتانيا', href: '/articles' },
    { name: 'مواقع', href: '/sites' },
    { name: 'حكومية', href: '/government' },
    { name: 'جهوية', href: '/regional' },
    { name: 'رياضة', href: '/sport' },
    { name: 'مدونات', href: '/blog' },
    { name: 'اتصل بنا', href: '/contact' },
  ];

  return (
    <header className="relative bg-gradient-to-r from-mauritania-green via-mauritania-green-dark to-mauritania-green text-white shadow-lg" dir="rtl">
      {/* Top accent bar with Mauritania colors */}
      <div className="h-1 bg-gradient-to-r from-mauritania-green via-mauritania-gold to-mauritania-red"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-br from-mauritania-gold via-mauritania-red to-mauritania-green rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">ر</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">موريتانيا الآن</div>
                  <div className="text-xs text-mauritania-gold-light opacity-80">WWW.RIMNOW.COM</div>
                </div>
              </div>
            </div>

            {/* Authentication Buttons */}
            <div className="flex items-center space-x-3 space-x-reverse">
              {!isAuthenticated ? (
                // Show Login/Register buttons when not authenticated
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 bg-mauritania-gold text-mauritania-green-dark font-semibold rounded-lg hover:bg-mauritania-gold-light transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50"
                  >
                    إنشاء حساب
                  </Link>
                </>
              ) : (
                // Show Dashboard button when authenticated
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-mauritania-gold text-mauritania-green-dark font-semibold rounded-lg hover:bg-mauritania-gold-light transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 space-x-reverse"
                  >
                    <User className="w-4 h-4" />
                    <span>لوحة التحكم</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center space-x-2 space-x-reverse"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Navigation Menu */}
          <div className="border-t border-white/20 bg-white/5 backdrop-blur-sm">
            <ul className="flex items-center justify-center h-14">
            {navigationItems.map((item, index) => (
                <li key={item.name} className="relative group">
                  <div className={`h-full flex items-center ${
                    index > 0 ? 'border-r border-white/10' : ''
                  }`}>
                <Link
                  href={item.href}
                      className={`relative px-6 py-4 text-sm font-medium text-white transition-all duration-300 hover:text-mauritania-gold-light group-hover:bg-white/10 ${
                        item.isHighlighted ? 'bg-gradient-to-r from-mauritania-red to-mauritania-red-dark text-white' : ''
                      }`}
                    >
                      {item.name}
                      
                      {/* Hover effect line */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-mauritania-gold to-mauritania-red transition-all duration-300 group-hover:w-full"></div>
                      
                      {/* Active indicator */}
                      {router.pathname === item.href && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mauritania-gold to-mauritania-red"></div>
                      )}
                    </Link>
                  </div>
                  
                  {/* Hover dropdown for highlighted items */}
                  {item.isHighlighted && (
                    <div className="absolute top-full left-0 w-48 bg-white/95 backdrop-blur-md rounded-b-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="p-4">
                        <div className="text-mauritania-red font-semibold mb-2">تغطيات حية</div>
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600">آخر التقارير المباشرة</div>
                          <div className="text-xs text-gray-600">أخبار عاجلة</div>
                          <div className="text-xs text-gray-600">تقارير ميدانية</div>
                        </div>
                    </div>
                    </div>
                  )}
              </li>
            ))}
          </ul>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-mauritania-gold via-mauritania-red to-mauritania-green rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">ر</span>
              </div>
              <div>
                <div className="text-lg font-bold text-white">موريتانيا الآن</div>
                <div className="text-xs text-mauritania-gold-light opacity-80">WWW.RIMNOW.COM</div>
              </div>
            </div>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="bg-white/95 backdrop-blur-md border-t border-white/20 shadow-xl">
              <div className="p-4 space-y-2">
                {/* Authentication Buttons for Mobile */}
                <div className="mb-4">
                  {!isAuthenticated ? (
                    // Show Login/Register buttons when not authenticated
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/auth/login"
                        className="px-4 py-3 bg-mauritania-gold text-mauritania-green-dark font-semibold rounded-xl hover:bg-mauritania-gold-light transition-all duration-300 shadow-lg text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/auth/register"
                        className="px-4 py-3 bg-white/50 text-mauritania-green-dark font-semibold rounded-xl hover:bg-mauritania-green/10 transition-all duration-300 border border-mauritania-green/20 text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        إنشاء حساب
                      </Link>
                    </div>
                  ) : (
                    // Show Dashboard button when authenticated
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        className="w-full px-4 py-3 bg-mauritania-gold text-mauritania-green-dark font-semibold rounded-xl hover:bg-mauritania-gold-light transition-all duration-300 shadow-lg text-center flex items-center justify-center space-x-2 space-x-reverse"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>لوحة التحكم</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 bg-white/50 text-mauritania-green-dark font-semibold rounded-xl hover:bg-mauritania-green/10 transition-all duration-300 border border-mauritania-green/20 flex items-center justify-center space-x-2 space-x-reverse"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Navigation Items */}
                <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                      className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                        item.isHighlighted 
                          ? 'bg-gradient-to-r from-mauritania-red to-mauritania-red-dark text-white shadow-lg' 
                          : 'bg-white/50 text-mauritania-green-dark hover:bg-mauritania-green/10 hover:text-mauritania-green'
                      } ${
                        router.pathname === item.href ? 'ring-2 ring-mauritania-gold ring-opacity-50' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 