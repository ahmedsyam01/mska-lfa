// Utility to fix localhost image URLs for Railway deployment
export const fixImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  // If it's a localhost URL, replace with Railway backend URL
  if (url.startsWith('http://localhost:3001')) {
    return url.replace('http://localhost:3001', 'https://rimna-backend-production.up.railway.app');
  }
  
  // If it's a relative URL, make it absolute with Railway backend URL
  if (url.startsWith('/')) {
    return `https://rimna-backend-production.up.railway.app${url}`;
  }
  
  // Return as-is if it's already a proper URL
  return url;
};

// Hook for components to use
export const useImageUrl = (url: string | null | undefined): string | null => {
  return fixImageUrl(url);
};
