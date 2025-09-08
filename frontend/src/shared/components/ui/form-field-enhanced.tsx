import React from 'react'
import { Input } from './input'
import { Badge } from './badge'
import { cn } from '@/shared/utils/cn'

interface FormFieldProps {
  label: string
  labelAr?: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  placeholderAr?: string
  value?: string | number
  onChange?: (value: string) => void
  onBlur?: () => void
  error?: string
  errorAr?: string
  helperText?: string
  helperTextAr?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  locale?: 'en' | 'ar'
  dir?: 'ltr' | 'rtl'
  className?: string
  inputClassName?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  suffix?: string
  prefix?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  autoComplete?: string
  autoFocus?: boolean
}

export const FormFieldEnhanced: React.FC<FormFieldProps> = ({
  label,
  labelAr,
  name,
  type = 'text',
  placeholder,
  placeholderAr,
  value = '',
  onChange,
  onBlur,
  error,
  errorAr,
  helperText,
  helperTextAr,
  required = false,
  disabled = false,
  readOnly = false,
  locale = 'en',
  dir,
  className,
  inputClassName,
  leftIcon,
  rightIcon,
  suffix,
  prefix,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  autoFocus = false
}) => {
  const isRtl = dir === 'rtl' || locale === 'ar'
  const displayLabel = locale === 'ar' && labelAr ? labelAr : label
  const displayPlaceholder = locale === 'ar' && placeholderAr ? placeholderAr : placeholder
  const displayError = locale === 'ar' && errorAr ? errorAr : error
  const displayHelperText = locale === 'ar' && helperTextAr ? helperTextAr : helperText
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className={cn("space-y-2", className)} dir={dir}>
      {/* Label */}
      <label
        htmlFor={name}
        className={cn(
          "block text-sm font-medium text-foreground",
          disabled && "text-muted-foreground",
          isRtl && "text-right"
        )}
      >
        {displayLabel}
        {required && (
          <span className="text-destructive ml-1 rtl:mr-1 rtl:ml-0">*</span>
        )}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Left/Start Icon */}
        {leftIcon && (
          <div className={cn(
            "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10",
            isRtl ? "right-3" : "left-3"
          )}>
            {leftIcon}
          </div>
        )}

        {/* Prefix */}
        {prefix && (
          <div className={cn(
            "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm pointer-events-none z-10",
            isRtl ? "right-3" : "left-3",
            leftIcon && (isRtl ? "right-10" : "left-10")
          )}>
            {prefix}
          </div>
        )}

        {/* Input */}
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={displayPlaceholder}
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={cn(
            "w-full",
            leftIcon && (isRtl ? "pr-10" : "pl-10"),
            prefix && (isRtl ? "pr-16" : "pl-16"),
            rightIcon && (isRtl ? "pl-10" : "pr-10"),
            suffix && (isRtl ? "pl-16" : "pr-16"),
            error && "border-destructive focus:border-destructive focus:ring-destructive",
            isRtl && "text-right",
            locale === 'ar' && "font-arabic",
            inputClassName
          )}
          dir={dir}
        />

        {/* Right/End Icon */}
        {rightIcon && (
          <div className={cn(
            "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10",
            isRtl ? "left-3" : "right-3"
          )}>
            {rightIcon}
          </div>
        )}

        {/* Suffix */}
        {suffix && (
          <div className={cn(
            "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm pointer-events-none z-10",
            isRtl ? "left-3" : "right-3",
            rightIcon && (isRtl ? "left-10" : "right-10")
          )}>
            {suffix}
          </div>
        )}

        {/* Character Count */}
        {maxLength && (
          <div className={cn(
            "absolute bottom-0 transform translate-y-full text-xs text-muted-foreground mt-1",
            isRtl ? "left-0" : "right-0"
          )}>
            {String(value).length}/{maxLength}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {displayHelperText && !error && (
        <p className={cn(
          "text-xs text-muted-foreground",
          isRtl && "text-right"
        )}>
          {displayHelperText}
        </p>
      )}

      {/* Error Message */}
      {displayError && (
        <p className={cn(
          "text-xs text-destructive flex items-center space-x-1 rtl:space-x-reverse",
          isRtl && "flex-row-reverse"
        )}>
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span>{displayError}</span>
        </p>
      )}
    </div>
  )
}

// SAR Currency Input Component
interface CurrencyInputProps extends Omit<FormFieldProps, 'type' | 'prefix' | 'suffix'> {
  currency?: 'SAR' | 'USD' | 'EUR'
  allowNegative?: boolean
  precision?: number
  thousandSeparator?: string
  decimalSeparator?: string
  onValueChange?: (value: number | null) => void
}

export const CurrencyInputEnhanced: React.FC<CurrencyInputProps> = ({
  currency = 'SAR',
  allowNegative = false,
  precision = 2,
  thousandSeparator,
  decimalSeparator,
  onValueChange,
  locale = 'en',
  ...props
}) => {
  const isArabic = locale === 'ar'
  
  // Default separators based on locale
  const defaultThousandSeparator = isArabic ? ',' : ','
  const defaultDecimalSeparator = isArabic ? '.' : '.'
  
  const currencySymbol = {
    SAR: isArabic ? 'ر.س' : 'SAR',
    USD: '$',
    EUR: '€'
  }[currency]

  const formatCurrency = (value: string | number): string => {
    if (!value) return ''
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return ''
    
    const formatted = new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(Math.abs(numValue))
    
    return allowNegative && numValue < 0 ? `-${formatted}` : formatted
  }

  const handleChange = (value: string) => {
    // Remove currency symbols and formatting
    const cleanValue = value.replace(/[^\d.-]/g, '')
    const numValue = parseFloat(cleanValue)
    
    if (isNaN(numValue)) {
      onValueChange?.(null)
      props.onChange?.('')
    } else {
      onValueChange?.(numValue)
      props.onChange?.(formatCurrency(numValue))
    }
  }

  return (
    <FormFieldEnhanced
      {...props}
      type="text"
      onChange={handleChange}
      prefix={!isArabic ? currencySymbol : undefined}
      suffix={isArabic ? currencySymbol : undefined}
      locale={locale}
    />
  )
}

// Phone Number Input with Saudi format
interface PhoneInputProps extends Omit<FormFieldProps, 'type'> {
  countryCode?: string
  format?: 'saudi' | 'international'
}

export const PhoneInputEnhanced: React.FC<PhoneInputProps> = ({
  countryCode = '+966',
  format = 'saudi',
  ...props
}) => {
  const formatSaudiPhone = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Saudi phone number format: 05X XXX XXXX
    if (digits.startsWith('966')) {
      const withoutCode = digits.slice(3)
      if (withoutCode.length >= 9) {
        return `${countryCode} ${withoutCode.slice(0, 2)} ${withoutCode.slice(2, 5)} ${withoutCode.slice(5, 9)}`
      }
    } else if (digits.startsWith('05') || digits.startsWith('5')) {
      const normalizedDigits = digits.startsWith('05') ? digits.slice(1) : digits
      if (normalizedDigits.length >= 9) {
        return `${countryCode} ${normalizedDigits.slice(0, 2)} ${normalizedDigits.slice(2, 5)} ${normalizedDigits.slice(5, 9)}`
      }
    }
    
    return value
  }

  const handleChange = (value: string) => {
    if (format === 'saudi') {
      const formatted = formatSaudiPhone(value)
      props.onChange?.(formatted)
    } else {
      props.onChange?.(value)
    }
  }

  return (
    <FormFieldEnhanced
      {...props}
      type="tel"
      onChange={handleChange}
      placeholder={props.locale === 'ar' ? '+966 5X XXX XXXX' : '+966 5X XXX XXXX'}
    />
  )
}