import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, MapPin, Phone, User, Calendar } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';

// Saudi-specific data
const SAUDI_REGIONS = [
  { value: 'riyadh', label: 'Riyadh', labelAr: 'Riyadh' },
  { value: 'makkah', label: 'Makkah', labelAr: 'Makkah' },
  { value: 'eastern', label: 'Eastern Province', labelAr: 'Eastern Province' },
  { value: 'medina', label: 'Medina', labelAr: 'Medina' },
  { value: 'qassim', label: 'Qassim', labelAr: 'Qassim' },
  { value: 'hail', label: 'Hail', labelAr: 'Hail' },
  { value: 'northern', label: 'Northern Borders', labelAr: 'Northern Borders' },
  { value: 'jazan', label: 'Jazan', labelAr: 'Jazan' },
  { value: 'najran', label: 'Najran', labelAr: 'Najran' },
  { value: 'bahah', label: 'Al Bahah', labelAr: 'Al Bahah' },
  { value: 'tabuk', label: 'Tabuk', labelAr: 'Tabuk' },
  { value: 'asir', label: 'Asir', labelAr: 'Asir' },
  { value: 'jouf', label: 'Al-Jouf', labelAr: 'Al-Jouf' }
];

const SAUDI_CITIES = {
  riyadh: ['Riyadh', 'Al-Kharj', 'Al-Dawadmi', 'Al-Majma\'ah', 'Al-Quwayiyah'],
  makkah: ['Makkah', 'Jeddah', 'Taif', 'Al-Qunfudhah', 'Al-Lith'],
  eastern: ['Dammam', 'Khobar', 'Dhahran', 'Al-Ahsa', 'Jubail'],
  medina: ['Medina', 'Yanbu', 'Al-Ula', 'Badr', 'Khaybar'],
  // Add more cities as needed
};

interface SaudiNameInputProps {
  value?: string;
  onChange?: (value: string) => void;
  labelAr: string;
  labelEn: string;
  required?: boolean;
  className?: string;
}

export const SaudiNameInput: React.FC<SaudiNameInputProps> = ({
  value = '',
  onChange,
  labelAr,
  labelEn,
  required = false,
  className
}) => {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  // Basic Arabic name validation
  const validateArabicName = (name: string): boolean => {
    const arabicNameRegex = /^[\u0600-\u06FF\s]+$/;
    return arabicNameRegex.test(name) && name.length >= 2;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (newValue) {
      const valid = validateArabicName(newValue);
      setIsValid(valid);
      setError(valid ? '' : 'يرجى إدخال اسم صحيح باللغة العربية');
    } else {
      setIsValid(!required);
      setError(required ? 'هذا الحقل مطلوب' : '');
    }
    
    onChange?.(newValue);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span dir="rtl">{labelAr}</span>
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          value={value}
          onChange={handleChange}
          placeholder="أدخل الاسم باللغة العربية"
          dir="rtl"
          className={cn(
            'text-right',
            !isValid && 'border-red-500 focus:border-red-500'
          )}
        />
        {value && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500" dir="rtl">{error}</p>
      )}
      <p className="text-xs text-muted-foreground" dir="rtl">
        مثال: أحمد محمد العلي
      </p>
    </div>
  );
};

interface SaudiPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  className?: string;
}

export const SaudiPhoneInput: React.FC<SaudiPhoneInputProps> = ({
  value = '',
  onChange,
  required = false,
  className
}) => {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [formattedValue, setFormattedValue] = useState(value);

  const validateSaudiPhone = (phone: string): boolean => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Saudi phone number patterns:
    // Mobile: 05XXXXXXXX (10 digits) or +966 5XXXXXXX (with country code)
    // Landline: 01XXXXXXX (9 digits) or +966 1XXXXXX
    
    if (digits.startsWith('966')) {
      // International format
      const localNumber = digits.substring(3);
      return /^[0-9]{8,9}$/.test(localNumber) && 
             (localNumber.startsWith('5') || localNumber.startsWith('1'));
    } else {
      // Local format
      return /^05[0-9]{8}$/.test(digits) || /^01[1-9][0-9]{6}$/.test(digits);
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.startsWith('966')) {
      // International format: +966 5X XXX XXXX
      const countryCode = digits.substring(0, 3);
      const localNumber = digits.substring(3);
      if (localNumber.length >= 4) {
        return `+${countryCode} ${localNumber.substring(0, 1)} ${localNumber.substring(1, 4)} ${localNumber.substring(4)}`;
      }
      return `+${countryCode} ${localNumber}`;
    } else if (digits.startsWith('05')) {
      // Mobile: 05X XXX XXXX
      if (digits.length >= 6) {
        return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
      }
      return digits;
    } else if (digits.startsWith('01')) {
      // Landline: 01X XXX XXXX
      if (digits.length >= 6) {
        return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
      }
      return digits;
    }
    
    return phone;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const formatted = formatPhoneNumber(newValue);
    
    setFormattedValue(formatted);
    
    if (newValue) {
      const valid = validateSaudiPhone(newValue);
      setIsValid(valid);
      setError(valid ? '' : 'يرجى إدخال رقم هاتف سعودي صحيح');
    } else {
      setIsValid(!required);
      setError(required ? 'هذا الحقل مطلوب' : '');
    }
    
    onChange?.(newValue.replace(/\D/g, '')); // Return only digits
  };

  useEffect(() => {
    if (value) {
      setFormattedValue(formatPhoneNumber(value));
    }
  }, [value]);

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="flex items-center gap-2">
        <Phone className="h-4 w-4" />
        <span dir="rtl">رقم الهاتف</span>
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          value={formattedValue}
          onChange={handleChange}
          placeholder="05X XXX XXXX"
          className={cn(
            'text-left font-mono',
            !isValid && 'border-red-500 focus:border-red-500'
          )}
        />
        {formattedValue && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500" dir="rtl">{error}</p>
      )}
      <div className="flex gap-2 text-xs text-muted-foreground" dir="rtl">
        <Badge variant="outline">موبايل: 05X XXX XXXX</Badge>
        <Badge variant="outline">أرضي: 01X XXX XXXX</Badge>
      </div>
    </div>
  );
};

interface SaudiIDInputProps {
  value?: string;
  onChange?: (value: string, type: 'national' | 'iqama') => void;
  required?: boolean;
  className?: string;
}

export const SaudiIDInput: React.FC<SaudiIDInputProps> = ({
  value = '',
  onChange,
  required = false,
  className
}) => {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [idType, setIdType] = useState<'national' | 'iqama' | null>(null);

  const validateSaudiID = (id: string): { valid: boolean; type: 'national' | 'iqama' | null } => {
    const digits = id.replace(/\D/g, '');
    
    if (digits.length !== 10) {
      return { valid: false, type: null };
    }
    
    // Saudi National ID: starts with 1 or 2
    if (digits.startsWith('1') || digits.startsWith('2')) {
      return { valid: true, type: 'national' };
    }
    
    // Iqama: starts with 3-9
    if (/^[3-9]/.test(digits)) {
      return { valid: true, type: 'iqama' };
    }
    
    return { valid: false, type: null };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const digits = newValue.replace(/\D/g, '');
    
    if (digits.length <= 10) {
      const validation = validateSaudiID(digits);
      
      setIsValid(validation.valid);
      setIdType(validation.type);
      
      if (digits.length === 10) {
        if (validation.valid) {
          setError('');
          onChange?.(digits, validation.type!);
        } else {
          setError('رقم الهوية غير صحيح');
        }
      } else if (digits.length > 0) {
        setError('');
      } else {
        setError(required ? 'هذا الحقل مطلوب' : '');
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span dir="rtl">رقم الهوية / الإقامة</span>
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          value={value}
          onChange={handleChange}
          placeholder="1XXXXXXXXX"
          maxLength={10}
          className={cn(
            'font-mono text-left',
            !isValid && value.length === 10 && 'border-red-500 focus:border-red-500'
          )}
        />
        {value && value.length === 10 && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {idType && (
        <div className="flex items-center gap-2">
          <Badge variant={idType === 'national' ? 'default' : 'secondary'}>
            {idType === 'national' ? '🇸🇦 هوية وطنية' : '📋 إقامة'}
          </Badge>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500" dir="rtl">{error}</p>
      )}
      <div className="text-xs text-muted-foreground space-y-1" dir="rtl">
        <p>• هوية وطنية: تبدأ بـ 1 أو 2</p>
        <p>• إقامة: تبدأ بـ 3-9</p>
      </div>
    </div>
  );
};

interface SaudiAddressInputProps {
  value?: {
    region: string;
    city: string;
    district: string;
    street: string;
    buildingNumber: string;
    postalCode: string;
  };
  onChange?: (address: any) => void;
  required?: boolean;
  className?: string;
}

export const SaudiAddressInput: React.FC<SaudiAddressInputProps> = ({
  value = {
    region: '',
    city: '',
    district: '',
    street: '',
    buildingNumber: '',
    postalCode: ''
  },
  onChange,
  required = false,
  className
}) => {
  const [selectedRegion, setSelectedRegion] = useState(value.region);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (selectedRegion && SAUDI_CITIES[selectedRegion as keyof typeof SAUDI_CITIES]) {
      setAvailableCities(SAUDI_CITIES[selectedRegion as keyof typeof SAUDI_CITIES]);
    } else {
      setAvailableCities([]);
    }
  }, [selectedRegion]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const updatedAddress = { ...value, region, city: '' };
    onChange?.(updatedAddress);
  };

  const handleFieldChange = (field: string, fieldValue: string) => {
    const updatedAddress = { ...value, [field]: fieldValue };
    onChange?.(updatedAddress);
  };

  const validatePostalCode = (code: string): boolean => {
    return /^\d{5}$/.test(code);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Label className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span dir="rtl">العنوان</span>
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Region */}
        <div className="space-y-2">
          <Label className="text-sm" dir="rtl">المنطقة</Label>
          <Select value={value.region} onValueChange={handleRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder="اختر المنطقة" />
            </SelectTrigger>
            <SelectContent>
              {SAUDI_REGIONS.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  <div className="flex items-center gap-2">
                    <span dir="rtl">{region.labelAr}</span>
                    <span className="text-muted-foreground">({region.label})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label className="text-sm" dir="rtl">المدينة</Label>
          <Select 
            value={value.city} 
            onValueChange={(city) => handleFieldChange('city', city)}
            disabled={!selectedRegion}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  <span dir="rtl">{city}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        <div className="space-y-2">
          <Label className="text-sm" dir="rtl">الحي</Label>
          <Input
            value={value.district}
            onChange={(e) => handleFieldChange('district', e.target.value)}
            placeholder="مثال: النخيل"
            dir="rtl"
            className="text-right"
          />
        </div>

        {/* Street */}
        <div className="space-y-2">
          <Label className="text-sm" dir="rtl">الشارع</Label>
          <Input
            value={value.street}
            onChange={(e) => handleFieldChange('street', e.target.value)}
            placeholder="مثال: شارع الملك فهد"
            dir="rtl"
            className="text-right"
          />
        </div>

        {/* Building Number */}
        <div className="space-y-2">
          <Label className="text-sm" dir="rtl">رقم المبنى</Label>
          <Input
            value={value.buildingNumber}
            onChange={(e) => handleFieldChange('buildingNumber', e.target.value)}
            placeholder="1234"
            className="font-mono"
          />
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <Label className="text-sm" dir="rtl">الرمز البريدي</Label>
          <div className="relative">
            <Input
              value={value.postalCode}
              onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              placeholder="12345"
              maxLength={5}
              className="font-mono"
            />
            {value.postalCode && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                {validatePostalCode(value.postalCode) ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-muted/30 rounded-lg">
        <p className="text-sm font-medium mb-1" dir="rtl">عنوان مختصر:</p>
        <p className="text-sm text-muted-foreground" dir="rtl">
          {[value.buildingNumber, value.street, value.district, value.city].filter(Boolean).join('، ') || 'لم يتم إدخال العنوان بعد'}
        </p>
      </div>
    </div>
  );
};

interface HijriDateInputProps {
  value?: string;
  onChange?: (date: string, gregorianEquivalent: string) => void;
  labelAr: string;
  required?: boolean;
  className?: string;
}

export const HijriDateInput: React.FC<HijriDateInputProps> = ({
  value = '',
  onChange,
  labelAr,
  required = false,
  className
}) => {
  const [gregorianDate, setGregorianDate] = useState('');

  // Simplified Hijri to Gregorian conversion (approximation)
  const convertHijriToGregorian = (hijriDate: string): string => {
    // This is a basic approximation - in production, use a proper Islamic calendar library
    const hijriStart = new Date('622-07-16'); // Approximate start of Hijri calendar
    const [year, month, day] = hijriDate.split('-').map(Number);
    
    if (year && month && day) {
      // Approximate conversion (Islamic year ≈ 354.37 days)
      const hijriDays = (year - 1) * 354.37 + (month - 1) * 29.53 + day;
      const gregorianDate = new Date(hijriStart.getTime() + hijriDays * 24 * 60 * 60 * 1000);
      return gregorianDate.toISOString().split('T')[0];
    }
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const gregorian = convertHijriToGregorian(newValue);
    
    setGregorianDate(gregorian);
    onChange?.(newValue, gregorian);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span dir="rtl">{labelAr}</span>
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="space-y-2">
        <Input
          type="date"
          value={value}
          onChange={handleChange}
          className="font-mono"
        />
        {gregorianDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              الميلادي: {new Date(gregorianDate).toLocaleDateString('ar-SA')}
            </Badge>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground" dir="rtl">
        التاريخ الهجري (تقريبي)
      </p>
    </div>
  );
};