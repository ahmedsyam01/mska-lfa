import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Camera, Sparkles } from 'lucide-react';
import { uploadAPI } from '../../utils/api';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  className = '',
  accept = 'image/*',
  maxSize = 5,
  label = 'Upload Image',
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const response = await uploadAPI.uploadImage(file);
      let imageUrl = response.data.url;
      // Always use full URL - use Railway URL when on Railway
      if (imageUrl && !imageUrl.startsWith('http')) {
        const isRailway = typeof window !== 'undefined' && window.location.hostname.includes('railway.app');
        const baseUrl = isRailway ? 'https://rimna-backend-production.up.railway.app' : 'http://localhost:3001';
        imageUrl = `${baseUrl}${imageUrl}`;
      }
      onImageChange(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {label && (
        <label className="block text-lg font-bold text-mauritania-green-dark mb-2">
          {label}
        </label>
      )}

      {currentImageUrl ? (
        <div className="relative">
          <div className="modern-card overflow-hidden">
            <div className="relative w-full h-64 bg-gradient-to-br from-mauritania-green-light/10 to-mauritania-gold-light/10 overflow-hidden">
              <img
                src={currentImageUrl && !currentImageUrl.startsWith('http') ? `http://localhost:3001${currentImageUrl}` : currentImageUrl}
                alt="Current image"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 bg-gradient-to-r from-mauritania-red to-mauritania-red-dark text-white rounded-xl hover:from-mauritania-red-dark hover:to-mauritania-red transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {!disabled && (
              <div className="p-4 bg-white">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="w-full bg-gradient-to-r from-mauritania-green to-mauritania-green-dark text-white py-3 px-6 rounded-xl hover:from-mauritania-green-dark hover:to-mauritania-green transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  تغيير الصورة
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`
            modern-card p-8 text-center transition-all duration-300
            ${dragOver 
              ? 'border-2 border-dashed border-mauritania-gold bg-gradient-to-r from-mauritania-gold/5 to-mauritania-red/5 scale-105' 
              : 'hover:scale-[1.02] hover:shadow-2xl'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full flex items-center justify-center animate-spin mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-mauritania-green to-mauritania-gold rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-lg font-semibold text-mauritania-green-dark mb-2">جاري الرفع...</p>
              <p className="text-sm text-gray-500">يرجى الانتظار</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-mauritania-green via-mauritania-gold to-mauritania-red rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Camera className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-mauritania-green-dark mb-3">
                رفع صورة جديدة
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                <span className="font-semibold">انقر للرفع</span> أو اسحب وأفلت الصورة هنا
              </p>
              <div className="flex items-center gap-2 text-sm text-mauritania-gold-dark">
                <Sparkles className="w-4 h-4" />
                <span>PNG, JPG, GIF حتى {maxSize}MB</span>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-mauritania-red/10 to-mauritania-red/20 border border-mauritania-red/30 rounded-xl p-4">
          <p className="text-sm text-mauritania-red-dark font-medium text-center">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ImageUpload; 