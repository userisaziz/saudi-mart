import { useState, useCallback, useEffect } from 'react';
import { RTLConfig } from '../types/product';

const defaultRTLConfig: RTLConfig = {
  isRTL: false,
  locale: 'en',
  direction: 'ltr',
  numberFormat: 'western',
  currency: {
    code: 'SAR',
    symbol: 'ر.س',
    position: 'after'
  }
};

export const useRTL = () => {
  const [config, setConfig] = useState<RTLConfig>(() => {
    // Load from localStorage or use default
    const saved = localStorage.getItem('rtl-config');
    if (saved) {
      try {
        return { ...defaultRTLConfig, ...JSON.parse(saved) };
      } catch {
        return defaultRTLConfig;
      }
    }
    return defaultRTLConfig;
  });

  // Toggle RTL/LTR
  const toggleDirection = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      isRTL: !prev.isRTL,
      direction: prev.isRTL ? 'ltr' : 'rtl',
      locale: prev.isRTL ? 'en' : 'ar'
    }));
  }, []);

  // Set specific locale
  const setLocale = useCallback((locale: 'en' | 'ar') => {
    setConfig(prev => ({
      ...prev,
      locale,
      isRTL: locale === 'ar',
      direction: locale === 'ar' ? 'rtl' : 'ltr'
    }));
  }, []);

  // Format numbers based on current locale
  const formatNumber = useCallback((
    value: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    const locale = config.locale === 'ar' ? 'ar-SA' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(value);
  }, [config.locale]);

  // Format currency
  const formatCurrency = useCallback((
    value: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    const locale = config.locale === 'ar' ? 'ar-SA' : 'en-US';
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    }).format(value);

    if (config.currency.position === 'before') {
      return `${config.currency.symbol} ${formattedNumber}`;
    } else {
      return `${formattedNumber} ${config.currency.symbol}`;
    }
  }, [config]);

  // Get CSS direction classes
  const getDirectionClasses = useCallback((baseClasses = '') => {
    const directionClasses = config.isRTL
      ? 'rtl:text-right rtl:flex-row-reverse'
      : 'ltr:text-left';
    
    return `${baseClasses} ${directionClasses}`.trim();
  }, [config.isRTL]);

  // Get flex direction classes for RTL
  const getFlexClasses = useCallback((baseClasses = '') => {
    const flexClasses = config.isRTL
      ? 'rtl:flex-row-reverse rtl:space-x-reverse'
      : '';
    
    return `${baseClasses} ${flexClasses}`.trim();
  }, [config.isRTL]);

  // Get text alignment classes
  const getTextAlignClasses = useCallback(() => {
    return config.isRTL ? 'text-right' : 'text-left';
  }, [config.isRTL]);

  // Get margin/padding classes for RTL
  const getSpacingClasses = useCallback((spacing: string) => {
    if (!config.isRTL) return spacing;
    
    // Convert left/right spacing for RTL
    return spacing
      .replace(/ml-/g, 'temp-ml-')
      .replace(/mr-/g, 'ml-')
      .replace(/temp-ml-/g, 'mr-')
      .replace(/pl-/g, 'temp-pl-')
      .replace(/pr-/g, 'pl-')
      .replace(/temp-pl-/g, 'pr-');
  }, [config.isRTL]);

  // Apply RTL to document
  useEffect(() => {
    document.documentElement.dir = config.direction;
    document.documentElement.lang = config.locale;
    
    // Save to localStorage
    localStorage.setItem('rtl-config', JSON.stringify(config));
  }, [config]);

  // Text input placeholder alignment
  const getInputClasses = useCallback((baseClasses = '') => {
    const rtlClasses = config.isRTL
      ? 'text-right placeholder:text-right'
      : 'text-left placeholder:text-left';
    
    return `${baseClasses} ${rtlClasses}`.trim();
  }, [config.isRTL]);

  // Get icon rotation for RTL (for arrows, chevrons, etc.)
  const getIconRotation = useCallback((baseClasses = '') => {
    const rotationClasses = config.isRTL ? 'rotate-180' : '';
    return `${baseClasses} ${rotationClasses}`.trim();
  }, [config.isRTL]);

  // Format date for current locale
  const formatDate = useCallback((
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = config.locale === 'ar' ? 'ar-SA' : 'en-US';
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    }).format(dateObj);
  }, [config.locale]);

  // Get Arabic/English text based on current locale
  const getLocalizedText = useCallback((
    englishText: string,
    arabicText?: string
  ): string => {
    if (config.locale === 'ar' && arabicText) {
      return arabicText;
    }
    return englishText;
  }, [config.locale]);

  return {
    config,
    isRTL: config.isRTL,
    locale: config.locale,
    direction: config.direction,
    
    // Actions
    toggleDirection,
    setLocale,
    
    // Formatters
    formatNumber,
    formatCurrency,
    formatDate,
    getLocalizedText,
    
    // CSS utilities
    getDirectionClasses,
    getFlexClasses,
    getTextAlignClasses,
    getSpacingClasses,
    getInputClasses,
    getIconRotation
  };
};