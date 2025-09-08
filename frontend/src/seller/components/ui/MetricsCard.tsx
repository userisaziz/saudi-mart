import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/shared/contexts/LanguageContext';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  format?: 'currency' | 'percentage' | 'number';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-blue-600',
  format = 'number'
}) => {
  const { isRTL } = useLanguage();
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        if (isRTL) {
          return `${new Intl.NumberFormat('ar-SA').format(val)} ر.س`;
        }
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US').format(val);
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return '↗';
    if (changeType === 'decrease') return '↘';
    return '→';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
            <Icon size={20} />
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatValue(value)}
            </p>
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'} text-sm ${getChangeColor()}`}>
            <span>{getChangeIcon()}</span>
            <span className="font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};