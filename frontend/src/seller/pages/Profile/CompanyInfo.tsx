import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  CalendarIcon,
  InformationCircleIcon,
  PhotoIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { mockCompanyInfo, type CompanyInfo } from '../../data/mockData';

export const ProfileCompanyInfo: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CompanyInfo>(mockCompanyInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('validation.companyNameRequired', 'Company name is required');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail', 'Invalid email format');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.phoneRequired', 'Phone number is required');
    }
    if (!formData.address.trim()) {
      newErrors.address = t('validation.addressRequired', 'Address is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      console.log('Company info updated:', formData);
    }, 1500);
  };

  const handleCancel = () => {
    setFormData(mockCompanyInfo);
    setErrors({});
    setIsEditing(false);
  };

  const InfoField: React.FC<{
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    field: keyof CompanyInfo;
    type?: 'text' | 'email' | 'url' | 'textarea';
  }> = ({ label, value, icon: Icon, field, type = 'text' }) => (
    <div className="space-y-2">
      <label className={`flex items-center text-sm font-medium text-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Icon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        {label}
      </label>
      {isEditing ? (
        <div>
          {type === 'textarea' ? (
            <textarea
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors[field] ? 'border-red-300' : 'border-gray-300'
              }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          ) : (
            <input
              type={type}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors[field] ? 'border-red-300' : 'border-gray-300'
              }`}
              dir={type === 'email' || type === 'url' ? 'ltr' : isRTL ? 'rtl' : 'ltr'}
            />
          )}
          {errors[field] && <p className="text-red-600 text-sm mt-1">{errors[field]}</p>}
        </div>
      ) : (
        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
          {value || t('profile.notProvided', 'Not provided')}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('profile.companyInfoTitle', 'Company Information')}</h1>
          <p className="text-gray-600 mt-1">{t('profile.companyInfoSubtitle', 'Manage your company profile and business details')}</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <XMarkIcon className="w-5 h-5" />
                <span>{t('profile.cancel', 'Cancel')}</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                <CheckIcon className="w-5 h-5" />
                <span>{saving ? t('profile.saving', 'Saving...') : t('profile.saveChanges', 'Save Changes')}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PencilIcon className="w-5 h-5" />
              <span>{t('profile.editProfile', 'Edit Profile')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Logo and Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                {formData.logo ? (
                  <img src={formData.logo} alt="Company Logo" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {formData.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center space-x-1 mx-auto">
                  <PhotoIcon className="w-4 h-4" />
                  <span>{t('profile.changeLogo', 'Change Logo')}</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-center border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
                <p className="text-gray-600">{formData.industry}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{t('profile.founded', 'Founded')}:</span>
                  <span className="text-gray-900 font-medium">{formData.founded}</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <UserGroupIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{t('profile.employees', 'Employees')}:</span>
                  <span className="text-gray-900 font-medium">{formData.employees}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className={`text-lg font-semibold text-gray-900 mb-6 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <BuildingOfficeIcon className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('profile.basicInformation', 'Basic Information')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                label={t('profile.companyName', 'Company Name')}
                value={formData.name}
                icon={BuildingOfficeIcon}
                field="name"
              />
              <InfoField
                label={t('profile.industry', 'Industry')}
                value={formData.industry}
                icon={InformationCircleIcon}
                field="industry"
              />
              <InfoField
                label={t('profile.founded', 'Founded')}
                value={formData.founded}
                icon={CalendarIcon}
                field="founded"
              />
              <InfoField
                label={t('profile.employees', 'Number of Employees')}
                value={formData.employees}
                icon={UserGroupIcon}
                field="employees"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('profile.contactInformation', 'Contact Information')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                label={t('profile.email', 'Email Address')}
                value={formData.email}
                icon={EnvelopeIcon}
                field="email"
                type="email"
              />
              <InfoField
                label={t('profile.phone', 'Phone Number')}
                value={formData.phone}
                icon={PhoneIcon}
                field="phone"
              />
              <InfoField
                label={t('profile.website', 'Website')}
                value={formData.website}
                icon={GlobeAltIcon}
                field="website"
                type="url"
              />
              <InfoField
                label={t('profile.address', 'Address')}
                value={formData.address}
                icon={MapPinIcon}
                field="address"
              />
            </div>
          </div>

          {/* Company Description */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('profile.companyDescription', 'Company Description')}</h3>
            <InfoField
              label={t('profile.aboutCompany', 'About Your Company')}
              value={formData.description}
              icon={InformationCircleIcon}
              field="description"
              type="textarea"
            />
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('profile.accountStatus', 'Account Status')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-sm font-medium text-green-800">{t('profile.accountVerified', 'Account Verified')}</div>
                <div className="text-xs text-green-600 mt-1">{t('profile.documentsApproved', 'All documents approved')}</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UserGroupIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-blue-800">{t('profile.premiumMember', 'Premium Member')}</div>
                <div className="text-xs text-blue-600 mt-1">{t('profile.fullAccess', 'Full platform access')}</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-purple-800">{t('profile.kycCompleted', 'KYC Completed')}</div>
                <div className="text-xs text-purple-600 mt-1">{t('profile.identityVerified', 'Identity verified')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompanyInfo;