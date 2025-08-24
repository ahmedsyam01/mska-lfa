import React from 'react';

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isVerified: boolean;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: 'ar' | 'en';
  notifications: boolean;
  theme: 'light' | 'dark';
}

// Article types
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  author: User;
  authorId: string;
  sourceUrl?: string;
  imageUrl?: string;
  isBreaking: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  likes: number;
  comments: Comment[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  author: User;
  authorId: string;
  article: Article;
  articleId: string;
  parentComment?: Comment;
  parentId?: string;
  replies: Comment[];
  likes: number;
  isModerated: boolean;
  createdAt: string;
  updatedAt: string;
}

// Celebrity types
export interface Celebrity {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  location?: CelebrityLocation;
  socialLinks?: SocialLinks;
  category: string;
  verified: boolean;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CelebrityLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

// Report types
export interface Report {
  id: string;
  title: string;
  content: string;
  location: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  tags: string[];
  mediaUrls: string[];
  coordinates?: Coordinates;
  isAnonymous: boolean;
  reporter: User;
  reporterId: string;
  moderator?: User;
  moderatorId?: string;
  moderationNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Trending types
export interface TrendingTopic {
  id: string;
  hashtag: string;
  category: string;
  weeklyStats: WeeklyStats[];
  totalMentions: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyStats {
  id: string;
  week: string;
  mentions: number;
  topicId: string;
}

// News Source types
export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl: string;
  category: string;
  language: 'ar' | 'en';
  country: string;
  reliability: number;
  lastSync?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'REPORTER';
  phoneNumber?: string;
  location?: string;
  bio?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Form types
export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface FilterOptions {
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: string;
  search?: string;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// Upload types
export interface UploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  path: string;
  url: string;
}

// Map types
export interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'celebrity' | 'report' | 'news';
  category?: string;
  verified?: boolean;
  description?: string;
  imageUrl?: string;
}

// Dashboard types
export interface DashboardStats {
  totalArticles: number;
  totalReports: number;
  totalUsers: number;
  totalCelebrities: number;
  recentActivity: ActivityItem[];
  trending: TrendingTopic[];
  popularArticles: Article[];
}

export interface ActivityItem {
  id: string;
  type: 'article' | 'report' | 'comment' | 'user';
  title: string;
  description: string;
  timestamp: string;
  user?: User;
  url?: string;
}

// Component props types
export interface NewsCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  showActions?: boolean;
  onLike?: (articleId: string) => void;
  onShare?: (article: Article) => void;
}

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
} 