import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  Globe,
  ChevronDown
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  const isRTL = router.locale === 'ar';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Rimna</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('search.placeholder') as string}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              {t('nav.home')}
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              {t('nav.news')}
            </Link>
            <Link href="/reports" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              {t('nav.reports')}
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              {t('nav.about')}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 text-sm font-medium"
              >
                <Globe className="h-4 w-4" />
                <span>{router.locale === 'ar' ? 'عربي' : 'English'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setIsLanguageMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('ar');
                      setIsLanguageMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 text-sm font-medium"
              >
                <User className="h-4 w-4" />
                <span>{t('auth.sign_in')}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t('auth.sign_in')}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t('auth.sign_up')}
                  </Link>
                  <hr className="my-1" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 inline mr-2" />
                    {t('settings')}
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="h-4 w-4 inline mr-2" />
                    {t('auth.sign_out')}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('search.placeholder') as string}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/news"
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
            >
              {t('nav.news')}
            </Link>
            <Link
              href="/reports"
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
            >
              {t('nav.reports')}
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
            >
              {t('nav.about')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 