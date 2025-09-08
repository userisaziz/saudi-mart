import React, { useState, useMemo } from 'react'
import { Calendar, Clock, ChevronLeft, ChevronRight, Globe } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Badge } from './badge'
import { Card, CardContent } from './card'
import { cn } from '@/shared/utils/cn'

interface DatePickerProps {
  label?: string
  labelAr?: string
  value?: Date
  onChange?: (date: Date | null) => void
  placeholder?: string
  placeholderAr?: string
  error?: string
  errorAr?: string
  disabled?: boolean
  required?: boolean
  locale?: 'en' | 'ar'
  calendar?: 'gregorian' | 'hijri' | 'both'
  format?: string
  minDate?: Date
  maxDate?: Date
  className?: string
  showTime?: boolean
}

// Simplified Hijri conversion (in production, use a proper library like moment-hijri)
const hijriMonths = {
  en: [
    'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
    'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ],
  ar: [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ]
}

const gregorianMonths = {
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  ar: [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ]
}

const dayNames = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
}

// Simple Hijri conversion approximation
const gregorianToHijri = (date: Date): { year: number; month: number; day: number } => {
  // This is a simplified conversion. In production, use a proper library.
  const greg = date.getTime()
  const hijriEpoch = new Date(622, 6, 16).getTime() // Approximate Hijri epoch
  const hijriYearLength = 354.367 * 24 * 60 * 60 * 1000 // Average Hijri year in ms
  
  const yearsSinceEpoch = (greg - hijriEpoch) / hijriYearLength
  const hijriYear = Math.floor(yearsSinceEpoch) + 1
  
  const yearStart = new Date(date.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((greg - yearStart.getTime()) / (24 * 60 * 60 * 1000))
  
  // Approximate month and day calculation
  const avgDaysPerMonth = 29.53
  const hijriMonth = Math.floor(dayOfYear / avgDaysPerMonth) % 12
  const hijriDay = (dayOfYear % Math.floor(avgDaysPerMonth)) + 1
  
  return { year: hijriYear, month: hijriMonth, day: Math.min(hijriDay, 30) }
}

const formatDate = (
  date: Date,
  locale: 'en' | 'ar',
  calendar: 'gregorian' | 'hijri',
  includeTime = false
): string => {
  if (calendar === 'gregorian') {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options)
  } else {
    const hijri = gregorianToHijri(date)
    const monthName = hijriMonths[locale][hijri.month]
    const formattedDay = locale === 'ar' ? hijri.day.toString() : hijri.day.toString()
    const formattedYear = locale === 'ar' ? hijri.year.toString() : hijri.year.toString()
    
    return `${formattedDay} ${monthName} ${formattedYear}${includeTime ? ` ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}` : ''}`
  }
}

export const DatePickerHijri: React.FC<DatePickerProps> = ({
  label,
  labelAr,
  value,
  onChange,
  placeholder,
  placeholderAr,
  error,
  errorAr,
  disabled = false,
  required = false,
  locale = 'en',
  calendar = 'gregorian',
  format,
  minDate,
  maxDate,
  className,
  showTime = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date())
  const [viewDate, setViewDate] = useState<Date>(value || new Date())
  const [currentCalendar, setCurrentCalendar] = useState<'gregorian' | 'hijri'>(
    calendar === 'both' ? 'gregorian' : calendar
  )
  const [timeValue, setTimeValue] = useState({
    hours: value?.getHours() || 12,
    minutes: value?.getMinutes() || 0
  })

  const isRtl = locale === 'ar'
  const displayLabel = locale === 'ar' && labelAr ? labelAr : label
  const displayPlaceholder = locale === 'ar' && placeholderAr ? placeholderAr : placeholder
  const displayError = locale === 'ar' && errorAr ? errorAr : error

  const formattedValue = useMemo(() => {
    if (!value) return ''
    return formatDate(value, locale, currentCalendar, showTime)
  }, [value, locale, currentCalendar, showTime])

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: Date[] = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    return days
  }, [viewDate])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setViewDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const handleDateSelect = (date: Date) => {
    if (showTime) {
      date.setHours(timeValue.hours, timeValue.minutes)
    }
    setSelectedDate(date)
    onChange?.(date)
    if (!showTime) {
      setIsOpen(false)
    }
  }

  const handleTimeChange = (type: 'hours' | 'minutes', value: number) => {
    setTimeValue(prev => ({ ...prev, [type]: value }))
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      newDate.setHours(type === 'hours' ? value : timeValue.hours)
      newDate.setMinutes(type === 'minutes' ? value : timeValue.minutes)
      onChange?.(newDate)
    }
  }

  const monthNames = currentCalendar === 'hijri' ? hijriMonths[locale] : gregorianMonths[locale]
  const currentMonth = currentCalendar === 'hijri' 
    ? gregorianToHijri(viewDate).month 
    : viewDate.getMonth()

  return (
    <div className={cn("relative", className)}>
      {/* Label */}
      {displayLabel && (
        <label className={cn(
          "block text-sm font-medium text-foreground mb-2",
          disabled && "text-muted-foreground",
          isRtl && "text-right"
        )}>
          {displayLabel}
          {required && (
            <span className="text-destructive ml-1 rtl:mr-1 rtl:ml-0">*</span>
          )}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <Input
          value={formattedValue}
          placeholder={displayPlaceholder || (locale === 'ar' ? 'اختر التاريخ' : 'Select date')}
          disabled={disabled}
          readOnly
          onClick={() => !disabled && setIsOpen(true)}
          className={cn(
            "cursor-pointer",
            isRtl && "text-right",
            locale === 'ar' && "font-arabic",
            error && "border-destructive"
          )}
          dir={isRtl ? 'rtl' : 'ltr'}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2",
            isRtl ? "left-2" : "right-2"
          )}
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar */}
          <Card className={cn(
            "absolute z-50 mt-2 w-80",
            isRtl ? "right-0" : "left-0"
          )}>
            <CardContent className="p-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  {calendar === 'both' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentCalendar(
                        currentCalendar === 'gregorian' ? 'hijri' : 'gregorian'
                      )}
                    >
                      <Globe className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                      {currentCalendar === 'gregorian' 
                        ? (locale === 'ar' ? 'ميلادي' : 'Gregorian')
                        : (locale === 'ar' ? 'هجري' : 'Hijri')
                      }
                    </Button>
                  )}
                  <Badge variant="outline">
                    {monthNames[currentMonth]} {currentCalendar === 'hijri' 
                      ? gregorianToHijri(viewDate).year 
                      : viewDate.getFullYear()
                    }
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigateMonth('prev')}
                  >
                    {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigateMonth('next')}
                  >
                    {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Day Headers */}
              <div className={cn(
                "grid grid-cols-7 gap-1 mb-2",
                isRtl && "grid-flow-col-dense"
              )}>
                {dayNames[locale].map((day, index) => (
                  <div
                    key={index}
                    className="text-center text-xs font-medium text-muted-foreground p-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === viewDate.getMonth()
                  const isSelected = value && day.toDateString() === value.toDateString()
                  const isToday = day.toDateString() === new Date().toDateString()
                  const isDisabled = (minDate && day < minDate) || (maxDate && day > maxDate)

                  return (
                    <Button
                      key={index}
                      size="sm"
                      variant={isSelected ? "default" : "ghost"}
                      className={cn(
                        "h-8 p-0 text-sm",
                        !isCurrentMonth && "text-muted-foreground opacity-50",
                        isToday && !isSelected && "bg-accent",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                      disabled={isDisabled || disabled}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day.getDate()}
                    </Button>
                  )
                })}
              </div>

              {/* Time Picker */}
              {showTime && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={timeValue.hours}
                        onChange={(e) => handleTimeChange('hours', parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                      <span className="text-muted-foreground">:</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={timeValue.minutes}
                        onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onChange?.(null)
                    setIsOpen(false)
                  }}
                >
                  {locale === 'ar' ? 'مسح' : 'Clear'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  {locale === 'ar' ? 'موافق' : 'Done'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Error Message */}
      {displayError && (
        <p className={cn(
          "text-xs text-destructive mt-1 flex items-center space-x-1 rtl:space-x-reverse",
          isRtl && "flex-row-reverse"
        )}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>{displayError}</span>
        </p>
      )}

      {/* Calendar Type Badge */}
      {calendar === 'both' && (
        <div className={cn("absolute top-0 text-xs", isRtl ? "left-0" : "right-0")}>
          <Badge variant="secondary" className="text-xs">
            {currentCalendar === 'hijri' ? (locale === 'ar' ? 'هجري' : 'Hijri') : (locale === 'ar' ? 'ميلادي' : 'Gregorian')}
          </Badge>
        </div>
      )}
    </div>
  )
}