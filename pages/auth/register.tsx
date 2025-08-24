import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, UserPlus, Phone, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { RegisterRequest } from '../../src/types';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    phoneNumber: '',
    location: '',
    bio: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<RegisterRequest & { confirmPassword: string }>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name as keyof (RegisterRequest & { confirmPassword: string })]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<RegisterRequest & { confirmPassword: string }> = {};
    
    // Required fields
    if (!formData.email) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
    
    if (!formData.username) {
      errors.username = 'اسم المستخدم مطلوب';
    } else if (formData.username.length < 3) {
      errors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
    }
    
    if (!formData.password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    if (!formData.firstName) {
      errors.firstName = 'الاسم الأول مطلوب';
    }
    
    if (!formData.lastName) {
      errors.lastName = 'اسم العائلة مطلوب';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register(formData);
      // Redirect to dashboard since registration automatically logs the user in
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauritania-green/5 via-white to-mauritania-gold/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-3xl shadow-2xl mb-6">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-mauritania-green to-mauritania-gold bg-clip-text text-transparent mb-2">
            ريمنا
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            إنشاء حساب جديد
          </h2>
          <p className="text-gray-600">
            انضم إلينا واحصل على تجربة رائعة
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-right flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}
            
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 text-right">
                  الاسم الأول
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-mauritania-green" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="الاسم الأول"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pr-12 pl-4 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg ${
                      formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-mauritania-green/50'
                    }`}
                  />
                </div>
                {formErrors.firstName && (
                  <p className="text-sm text-red-600 text-right flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {formErrors.firstName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 text-right">
                  اسم العائلة
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-mauritania-green" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="اسم العائلة"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full pr-12 pl-4 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg ${
                      formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-mauritania-green/50'
                    }`}
                  />
                </div>
                {formErrors.lastName && (
                  <p className="text-sm text-red-600 text-right flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>
            
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-right">
                نوع الحساب
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'USER' }))}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-right ${
                    formData.role === 'USER'
                      ? 'border-mauritania-green bg-gradient-to-r from-mauritania-green/10 to-mauritania-green/20 shadow-lg'
                      : 'border-gray-200 hover:border-mauritania-green/30 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      formData.role === 'USER'
                        ? 'bg-mauritania-green text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-right">
                      <h3 className={`font-bold text-lg ${
                        formData.role === 'USER' ? 'text-mauritania-green' : 'text-gray-700'
                      }`}>
                        مواطن
                      </h3>
                      <p className="text-sm text-gray-600">
                        مشاهدة المحتوى والتعليق
                      </p>
                    </div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'REPORTER' }))}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-right ${
                    formData.role === 'REPORTER'
                      ? 'border-mauritania-gold bg-gradient-to-r from-mauritania-gold/10 to-mauritania-gold/20 shadow-lg'
                      : 'border-gray-200 hover:border-mauritania-gold/30 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      formData.role === 'REPORTER'
                        ? 'bg-mauritania-gold text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="text-right">
                      <h3 className={`font-bold text-lg ${
                        formData.role === 'REPORTER' ? 'text-mauritania-gold' : 'text-gray-700'
                      }`}>
                        صحفي
                      </h3>
                      <p className="text-sm text-gray-600">
                        نشر المقالات والتقارير
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                يمكنك تغيير نوع الحساب لاحقاً من إعدادات الملف الشخصي
              </p>
            </div>
            
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 text-right">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-mauritania-green" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="اسم المستخدم"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pr-12 pl-4 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg ${
                    formErrors.username ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-mauritania-green/50'
                  }`}
                />
              </div>
              {formErrors.username && (
                <p className="text-sm text-red-600 text-right flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {formErrors.username}
                </p>
              )}
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-mauritania-green" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pr-12 pl-4 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg ${
                    formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-mauritania-green/50'
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="text-sm text-red-600 text-right flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {formErrors.email}
                </p>
              )}
            </div>
            
            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 text-right">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-mauritania-green" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pr-12 pl-4 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg ${
                      formErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-mauritania-green/50'
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-mauritania-green transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-600 text-right flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {formErrors.password}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 text-right">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-mauritania-green" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="تأكيد كلمة المرور"
                    value={confirmPassword}
                    onChange={handleChange}
                    className={`w-full pr-12 pl-4 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg ${
                      formErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-mauritania-green/50'
                    }`}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-600 text-right flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            
            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 text-right">
                  رقم الهاتف (اختياري)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-mauritania-green" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg hover:border-mauritania-green/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 text-right">
                  الموقع (اختياري)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-mauritania-green" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="الموقع"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg hover:border-mauritania-green/50"
                  />
                </div>
              </div>
            </div>
            
            {/* Bio Field */}
            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 text-right">
                نبذة شخصية (اختياري)
              </label>
              <div className="relative">
                <div className="absolute top-4 right-4 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-mauritania-green" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  placeholder="اكتب نبذة عن نفسك..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-mauritania-green/20 focus:border-mauritania-green transition-all duration-300 text-right text-lg hover:border-mauritania-green/50 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري إنشاء الحساب...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>إنشاء الحساب</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 shadow-lg">
            <Shield className="w-4 h-4 text-mauritania-green" />
            <span className="text-gray-700">
              لديك حساب بالفعل؟{' '}
              <Link 
                href="/auth/login"
                className="font-semibold text-mauritania-green hover:text-mauritania-green-dark transition-colors hover:underline"
              >
                تسجيل الدخول
              </Link>
            </span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-mauritania-gold/20 to-mauritania-red/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-mauritania-green/20 to-mauritania-gold/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default RegisterPage; 