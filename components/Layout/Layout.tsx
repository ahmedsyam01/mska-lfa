import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'ريمنا - مصدرك الموثوق للأخبار الموريتانية',
  description = 'ابق على اطلاع بآخر الأخبار من موريتانيا والمنطقة. نقدم لك تغطية شاملة للأحداث السياسية والاقتصادية والثقافية والرياضية.'
}) => {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-mauritania-green-light/5 via-white to-mauritania-gold-light/5">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content="ar" />
        <meta name="dir" content="rtl" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 