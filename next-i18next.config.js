const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar'],
    localeDetection: false,
  },
  localePath: path.resolve('./locales'),
  react: {
    useSuspense: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
} 