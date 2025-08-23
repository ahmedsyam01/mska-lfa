import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

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
    { name: 'Français', href: '/fr' },
    { name: 'EN', href: '/en' },
    { name: 'مواقع', href: '/sites' },
    { name: 'حكومية', href: '/government' },
    { name: 'جهوية', href: '/regional' },
    { name: 'رياضة', href: '/sport' },
    { name: 'مدونات', href: '/blog' },
    { name: 'بحث', href: '/search' },
    { name: 'اتصل بنا', href: '/contact' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ريمنا
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  item.isHighlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : item.isActive && router.pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  item.isHighlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : item.isActive && router.pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 