import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'الصفحة الأولى', href: '/', isActive: true },
    { name: '2', href: '/2.html' },
    { name: '3', href: '/3.html' },
    { name: '4', href: '/4.html' },
    { name: '5', href: '/5.html' },
    { name: '6', href: '/6.html' },
    { name: '7', href: '/7.html' },
    { name: '8', href: '/8.html' },
    { name: '9', href: '/9.html' },
    { name: '10', href: '/10.html' },
    { name: '11', href: '/11.html' },
    { name: 'أخبار', href: 'https://www.rimnow.net/w/?q=news' },
    { name: 'تغطيات', href: 'https://www.rimnow.net/w/?q=nv', isHighlighted: true },
    { name: 'كُتاب موريتانيا', href: 'http://rimnow.net/w/?q=articles' },
    { name: 'Français', href: '/fr.html' },
    { name: 'EN', href: '/en.html' },
    { name: 'مواقع', href: '/site.html' },
    { name: 'حكومية', href: '/gov.html' },
    { name: 'جهوية', href: '/region.html' },
    { name: 'رياضة', href: '/sport.html' },
    { name: 'مدونات', href: '/blog.html' },
    { name: 'بحث', href: 'https://www.rimnow.com/search.htm' },
    { name: 'اتصل بنا', href: '/c.html' },
  ];

  return (
    <header className="bg-[#184349] text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation - Matching rimnow.com CSS */}
        <nav className="hidden md:flex items-center justify-center h-8" style={{ 
          background: '#184349',
          borderBottom: '1px solid #529490',
          clear: 'both'
        }}>
          <ul className="flex items-center justify-center h-8 w-full" style={{ 
            margin: '0 auto',
            padding: 0,
            height: '32px',
            overflow: 'hidden',
            background: '#184349'
          }}>
            {navigationItems.map((item, index) => (
              <li key={item.name} style={{
                listStyle: 'none',
                height: '32px',
                borderLeft: index > 0 ? '1px solid #0d2e35' : 'none'
              }}>
                <Link
                  href={item.href}
                  className="block text-center leading-8 text-white no-underline text-xs font-medium transition-all duration-300"
                  style={{
                    textAlign: 'center',
                    lineHeight: '31px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '15px',
                    direction: 'rtl',
                    padding: '0 9px',
                    height: '32px',
                    display: 'block',
                    WebkitTransition: 'all .3s ease-out',
                    MozTransition: 'all .3s ease-out',
                    msTransition: 'all .3s ease-out',
                    OTransition: 'all .3s ease-out'
                  }}
                  onMouseEnter={(e) => {
                    if (item.isHighlighted) {
                      e.currentTarget.style.color = '#fff581';
                    } else {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.background = '#005f59';
                      e.currentTarget.style.fontSize = '16px';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.isHighlighted) {
                      e.currentTarget.style.color = '#fff';
                    } else {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.fontSize = '12px';
                    }
                  }}
                >
                  {item.isHighlighted && (
                    <div style={{ background: '#c50400', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',    padding: '0 9px' }}>
                      {item.name}
                    </div>
                  )}
                  {!item.isHighlighted && (
                    <div className="flex items-center justify-center h-full">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-8 px-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-gray-200"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            
            <div className="text-yellow-300 font-bold text-xs">موريتانيا الآن</div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="bg-[#184349] border-t border-[#529490]">
              <div className="grid grid-cols-2 gap-1 p-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-xs text-white hover:text-gray-200 hover:bg-[#005f59] rounded ${
                      item.isHighlighted ? 'bg-[#c50400] text-white' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 