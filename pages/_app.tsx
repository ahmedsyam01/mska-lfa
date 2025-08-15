import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { appWithTranslation } from 'next-i18next';
import { AuthProvider } from '../hooks/useAuth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp); 