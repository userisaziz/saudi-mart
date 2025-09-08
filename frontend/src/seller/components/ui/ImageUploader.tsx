import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
  accept?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  maxSize = 5,
  accept = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      onImagesChange(updatedImages);
      setUploading(false);
    }, 1000);
  }, [images, onImagesChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages || uploading
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const reorderImages = (dragIndex: number, dropIndex: number) => {
    const draggedImage = images[dragIndex];
    const newImages = [...images];
    newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              {uploading ? 'Uploading...' : 'Upload product images'}
            </p>
            <p className="text-sm text-gray-600">
              Drag & drop images here, or click to select files
            </p>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, WEBP up to {maxSize}MB ({maxImages - images.length} remaining)
            </p>
          </div>
        </div>
      )}

      {/* File Rejection Errors */}
      {fileRejections.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Upload errors:</h4>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="text-sm text-red-700">
              <span className="font-medium">{file.name}:</span>
              {errors.map(error => (
                <span key={error.code} className="ml-2">{error.message}</span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => removeImage(index)}
                  className="bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reorder Instructions */}
      {images.length > 1 && (
        <p className="text-xs text-gray-500 text-center">
          The first image will be used as the main product image
        </p>
      )}
    </div>
  );
};