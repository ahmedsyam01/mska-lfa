# Rimna Frontend - موريتانيا الآن

## Project Overview
Rimna Frontend is a Next.js-based news and information platform for Mauritania, providing local news, celebrity information, trending topics, and various content categories.

## Project Structure

### Core Pages
- **Home** (`/`) - Main landing page with featured content
- **News** (`/news`) - News articles and updates
- **Trending** (`/trending`) - Trending topics and popular content
- **Celebrities** (`/celebrities`) - Information about Mauritanian celebrities
- **Reports** (`/reports`) - User-generated reports and content
- **News Sources** (`/news-sources`) - Various news sources and feeds
- **Dashboard** (`/dashboard`) - User dashboard and personal content

### New Navigation Pages
- **Sports** (`/sport`) - Sports news and updates from Mauritania
- **Blogs** (`/blog`) - Articles and opinions from Mauritanian writers
- **Contact** (`/contact`) - Contact form and information
- **Sites** (`/sites`) - Directory of Mauritanian websites
- **Government** (`/government`) - Government institutions and services
- **Regional** (`/regional`) - Regional information and statistics

### Admin Section
- **Admin Dashboard** (`/admin/dashboard`) - Administrative overview
- **Articles Management** (`/admin/articles`) - CRUD operations for articles
- **Celebrities Management** (`/admin/celebrities`) - CRUD operations for celebrities
- **Admin Login** (`/admin/login`) - Administrative access

### Authentication
- **User Login** (`/auth/login`) - User authentication
- **User Registration** (`/auth/register`) - User account creation

## Navigation Structure

The main navigation menu now includes **working links** to all major sections:

### Primary Navigation
- **الصفحة الأولى** (Home) - Links to `/`
- **أخبار** (News) - Links to `/news`
- **تغطيات** (Coverage) - Links to `/reports`
- **كُتاب موريتانيا** (Mauritanian Writers) - Links to `/articles`
- **رياضة** (Sports) - Links to `/sport` ✅ **NEW - API Integrated**
- **مدونات** (Blogs) - Links to `/blog` ✅ **NEW - API Integrated**
- **مواقع** (Sites) - Links to `/sites` ✅ **NEW - Working**
- **حكومية** (Government) - Links to `/government` ✅ **NEW - Working**
- **جهوية** (Regional) - Links to `/regional` ✅ **NEW - Working**
- **بحث** (Search) - External search functionality
- **اتصل بنا** (Contact Us) - Links to `/contact` ✅ **NEW - Working**

### Language Options
- **Français** - French language support (placeholder)
- **EN** - English language support (placeholder)

## API Integration Status

### ✅ Fully Integrated with API
- **Sport Page** (`/sport`) - Fetches sports articles from `articlesAPI.getAll({category: 'sports'})`
- **Blog Page** (`/blog`) - Fetches blog posts from `articlesAPI.getAll()` with category filtering

### 🔄 Ready for API Integration
- **Government Page** (`/government`) - Currently uses mock data, ready for government API
- **Regional Page** (`/regional`) - Currently uses mock data, ready for regional API
- **Sites Page** (`/sites`) - Currently uses mock data, ready for sites API
- **Contact Page** (`/contact`) - Form ready for contact API integration

### 📡 Available API Endpoints
```typescript
// Articles API
articlesAPI.getAll({ category, limit, status, trending })
articlesAPI.getById(id)
articlesAPI.create(articleData)
articlesAPI.update(id, articleData)
articlesAPI.delete(id)

// Celebrities API
celebritiesAPI.getAll(params)
celebritiesAPI.getById(id)
celebritiesAPI.create(data)
celebritiesAPI.update(id, data)
celebritiesAPI.delete(id)

// Reports API
reportsAPI.getAll({ page, limit, status })
reportsAPI.getById(id)
reportsAPI.create(data)
reportsAPI.update(id, data)

// Trending API
trendingAPI.getTopics(weekOf)
trendingAPI.createTopic(data)

// News Sources API
newsSourcesAPI.getAll()
newsSourcesAPI.getRankings()
```

## Technology Stack
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Internationalization**: next-i18next
- **Authentication**: Custom auth hooks
- **API Client**: Axios with interceptors
- **State Management**: React hooks (useState, useEffect)

## Development Guidelines

### Code Structure
- Components are organized in the `components/` directory
- Pages are in the `pages/` directory following Next.js file-based routing
- Utilities and API functions are in the `utils/` directory
- Types and interfaces are defined in `src/types/`

### Navigation Implementation
- Navigation items are defined in `components/Layout/Header.tsx`
- Each navigation item has a name, href, and optional properties
- Links use Next.js `Link` component for client-side navigation
- External links open in new tabs when appropriate

### API Integration Pattern
```typescript
// Example of how pages fetch data from API
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getAll({
        category: 'sports',
        limit: 6,
        status: 'published'
      });
      setData(response.data.articles || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('فشل في تحميل البيانات');
      // Fallback to mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Responsive Design
- Desktop navigation with hover effects
- Mobile navigation with collapsible menu
- RTL (Right-to-Left) support for Arabic content
- Loading states and error handling for all pages

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment
- Configured for Railway deployment
- Docker support included
- Environment variables should be configured for production
- API endpoints automatically detect Railway vs localhost

## Recent Updates

### ✅ Navigation Menu Fixed
- All navigation items now link to working pages
- Removed broken `.html` links
- Added proper Next.js routing

### ✅ New Pages Created
- Sports page with API integration
- Blog page with category filtering
- Contact page with form
- Sites directory page
- Government institutions page
- Regional information page

### ✅ API Integration
- Sport and Blog pages fetch real data from backend
- Proper error handling and loading states
- Fallback to mock data if API fails
- Ready for full API integration

## Contributing
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain RTL support for Arabic content
- Test navigation links thoroughly
- Update this README when adding new features
- Use the established API integration pattern for new pages
