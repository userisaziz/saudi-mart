import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Bell, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface PrayerTime {
  name: string;
  nameAr: string;
  time: string;
  passed: boolean;
}

interface PrayerTimeWidgetProps {
  location?: string;
  locationAr?: string;
  showNotifications?: boolean;
  onPrayerTimeUpdate?: (currentPrayer: string, nextPrayer: string, timeToNext: string) => void;
}

const PRAYER_NAMES = {
  fajr: { en: 'Fajr', ar: 'Fajr' },
  dhuhr: { en: 'Dhuhr', ar: 'Dhuhr' },
  asr: { en: 'Asr', ar: 'Asr' },
  maghrib: { en: 'Maghrib', ar: 'Maghrib' },
  isha: { en: 'Isha', ar: 'Isha' }
};

// Mock prayer times - In production, this would come from an Islamic prayer time API
const getMockPrayerTimes = (): PrayerTime[] => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  return [
    {
      name: 'Fajr',
      nameAr: 'Fajr',
      time: '05:30',
      passed: currentHour > 5 || (currentHour === 5 && currentMinute > 30)
    },
    {
      name: 'Dhuhr',
      nameAr: 'Dhuhr',
      time: '12:15',
      passed: currentHour > 12 || (currentHour === 12 && currentMinute > 15)
    },
    {
      name: 'Asr',
      nameAr: 'Asr',
      time: '15:45',
      passed: currentHour > 15 || (currentHour === 15 && currentMinute > 45)
    },
    {
      name: 'Maghrib',
      nameAr: 'Maghrib',
      time: '18:30',
      passed: currentHour > 18 || (currentHour === 18 && currentMinute > 30)
    },
    {
      name: 'Isha',
      nameAr: 'Isha',
      time: '20:00',
      passed: currentHour > 20 || (currentHour === 20 && currentMinute > 0)
    }
  ];
};

const calculateTimeToNext = (nextPrayerTime: string): string => {
  const now = new Date();
  const [hours, minutes] = nextPrayerTime.split(':').map(Number);
  
  let nextPrayer = new Date();
  nextPrayer.setHours(hours, minutes, 0, 0);
  
  // If prayer time has passed today, set for tomorrow
  if (nextPrayer <= now) {
    nextPrayer.setDate(nextPrayer.getDate() + 1);
  }
  
  const diffMs = nextPrayer.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}:${diffMinutes.toString().padStart(2, '0')}`;
  }
  return `${diffMinutes} دقيقة`;
};

const getCurrentPrayerPeriod = (prayerTimes: PrayerTime[]) => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  for (let i = 0; i < prayerTimes.length; i++) {
    const prayer = prayerTimes[i];
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTimeMinutes = hours * 60 + minutes;
    
    // Check if we're within 15 minutes of prayer time
    if (Math.abs(currentTime - prayerTimeMinutes) <= 15) {
      return {
        isNearPrayer: true,
        currentPrayer: prayer.nameAr,
        status: 'prayer_time'
      };
    }
  }
  
  // Find current period between prayers
  const nextPrayer = prayerTimes.find(p => !p.passed);
  const lastPassedPrayer = prayerTimes.slice().reverse().find(p => p.passed);
  
  return {
    isNearPrayer: false,
    currentPrayer: lastPassedPrayer?.nameAr || 'بين الصلوات',
    nextPrayer: nextPrayer?.nameAr || 'الفجر',
    status: 'normal'
  };
};

export const PrayerTimeWidget: React.FC<PrayerTimeWidgetProps> = ({
  location = 'الرياض',
  locationAr = 'Riyadh',
  showNotifications = true,
  onPrayerTimeUpdate
}) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentStatus, setCurrentStatus] = useState<any>({});
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const updatePrayerTimes = () => {
      const times = getMockPrayerTimes();
      setPrayerTimes(times);
      
      const status = getCurrentPrayerPeriod(times);
      setCurrentStatus(status);
      
      if (onPrayerTimeUpdate && status.nextPrayer) {
        const nextPrayer = times.find(p => !p.passed);
        if (nextPrayer) {
          const timeToNext = calculateTimeToNext(nextPrayer.time);
          onPrayerTimeUpdate(status.currentPrayer, status.nextPrayer, timeToNext);
        }
      }
      
      setLastUpdated(new Date());
    };

    // Update immediately
    updatePrayerTimes();
    
    // Update every minute
    const interval = setInterval(updatePrayerTimes, 60000);
    
    return () => clearInterval(interval);
  }, [onPrayerTimeUpdate]);

  const getStatusColor = () => {
    if (currentStatus.isNearPrayer) return 'text-purple-600 bg-purple-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusIcon = () => {
    if (currentStatus.isNearPrayer) return <Bell className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm">
              🕌
            </div>
            <div>
              <span className="text-sm font-medium">أوقات الصلاة</span>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {location}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${getStatusColor()} border-0 gap-1`}>
            {getStatusIcon()}
            <span className="text-xs">
              {currentStatus.isNearPrayer ? 'وقت الصلاة' : 'عادي'}
            </span>
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Current Status */}
        {currentStatus.isNearPrayer && (
          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <AlertTriangle className="h-4 w-4 text-purple-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-800" dir="rtl">
                وقت صلاة {currentStatus.currentPrayer}
              </p>
              <p className="text-xs text-purple-600" dir="rtl">
                تجنب المكالمات والإجراءات الحرجة
              </p>
            </div>
          </div>
        )}

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-5 gap-2">
          {prayerTimes.map((prayer, index) => (
            <div 
              key={prayer.name}
              className={`text-center p-2 rounded-lg border transition-all ${
                prayer.passed 
                  ? 'bg-muted/50 text-muted-foreground border-muted' 
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              <div className={`text-xs font-medium ${
                currentStatus.currentPrayer === prayer.nameAr && currentStatus.isNearPrayer
                  ? 'text-purple-600' 
                  : prayer.passed 
                    ? 'text-muted-foreground' 
                    : 'text-foreground'
              }`}>
                {prayer.nameAr}
              </div>
              <div className={`text-sm font-mono mt-1 ${
                prayer.passed ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {prayer.time}
              </div>
              {!prayer.passed && (
                <div className="w-1 h-1 bg-primary rounded-full mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Next Prayer Info */}
        {!currentStatus.isNearPrayer && currentStatus.nextPrayer && (
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground" dir="rtl">
                الصلاة القادمة: {currentStatus.nextPrayer}
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {(() => {
                const nextPrayer = prayerTimes.find(p => !p.passed);
                return nextPrayer ? calculateTimeToNext(nextPrayer.time) : '';
              })()}
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            آخر تحديث: {lastUpdated.toLocaleTimeString('ar-SA')}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={() => {
              const times = getMockPrayerTimes();
              setPrayerTimes(times);
              setLastUpdated(new Date());
            }}
          >
            <Clock className="h-3 w-3 mr-1" />
            تحديث
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerTimeWidget;