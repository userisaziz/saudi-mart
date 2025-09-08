import React, { useState } from 'react'
import { Clock, Save, RotateCcw, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface BusinessHour {
  day: string
  dayAr: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface Holiday {
  id: string
  name: string
  nameAr: string
  date: string
  isRecurring: boolean
}

const initialHours: BusinessHour[] = [
  { day: 'sunday', dayAr: 'الأحد', isOpen: true, openTime: '08:00', closeTime: '17:00' },
  { day: 'monday', dayAr: 'الإثنين', isOpen: true, openTime: '08:00', closeTime: '17:00' },
  { day: 'tuesday', dayAr: 'الثلاثاء', isOpen: true, openTime: '08:00', closeTime: '17:00' },
  { day: 'wednesday', dayAr: 'الأربعاء', isOpen: true, openTime: '08:00', closeTime: '17:00' },
  { day: 'thursday', dayAr: 'الخميس', isOpen: true, openTime: '08:00', closeTime: '17:00' },
  { day: 'friday', dayAr: 'الجمعة', isOpen: false, openTime: '13:00', closeTime: '17:00' },
  { day: 'saturday', dayAr: 'السبت', isOpen: false, openTime: '09:00', closeTime: '16:00' }
]

const mockHolidays: Holiday[] = [
  {
    id: 'H001',
    name: 'Saudi National Day',
    nameAr: 'اليوم الوطني السعودي',
    date: '2024-09-23',
    isRecurring: true
  },
  {
    id: 'H002',
    name: 'Eid Al-Fitr',
    nameAr: 'عيد الفطر',
    date: '2024-04-10',
    isRecurring: true
  },
  {
    id: 'H003',
    name: 'Eid Al-Adha',
    nameAr: 'عيد الأضحى',
    date: '2024-06-17',
    isRecurring: true
  }
]

export default function BusinessHoursPage() {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(initialHours)
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays)
  const [timezone, setTimezone] = useState('Asia/Riyadh')
  const [autoReply, setAutoReply] = useState({
    enabled: true,
    message: 'شكراً لتواصلك معنا. ساعات العمل من الأحد إلى الخميس 8 صباحاً - 5 مساءً',
    messageEn: 'Thank you for contacting us. Business hours are Sunday to Thursday 8 AM - 5 PM'
  })

  const handleHourChange = (dayIndex: number, field: keyof BusinessHour, value: any) => {
    const newHours = [...businessHours]
    newHours[dayIndex] = { ...newHours[dayIndex], [field]: value }
    setBusinessHours(newHours)
  }

  const resetToDefault = () => {
    setBusinessHours(initialHours)
  }

  const saveSettings = () => {
    // Handle save logic here
    console.log('Saving business hours:', businessHours)
    alert('تم حفظ ساعات العمل بنجاح!')
  }

  const totalWorkingHours = businessHours.reduce((total, hour) => {
    if (!hour.isOpen) return total
    const start = new Date(`2024-01-01T${hour.openTime}:00`)
    const end = new Date(`2024-01-01T${hour.closeTime}:00`)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return total + diff
  }, 0)

  const workingDays = businessHours.filter(hour => hour.isOpen).length

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ساعات العمل</h1>
          <p className="text-gray-600">تحديد ساعات العمل والأجازات الرسمية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">ساعات العمل الأسبوعية</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{totalWorkingHours}</div>
            <p className="text-xs text-muted-foreground text-right">ساعة في الأسبوع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">أيام العمل</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{workingDays}</div>
            <p className="text-xs text-muted-foreground text-right">يوم في الأسبوع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">المنطقة الزمنية</CardTitle>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-right">GMT+3</div>
            <p className="text-xs text-muted-foreground text-right">توقيت الرياض</p>
          </CardContent>
        </Card>
      </div>

      {/* Business Hours Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">ساعات العمل الأسبوعية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessHours.map((hour, index) => (
              <div key={hour.day} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={hour.isOpen}
                    onChange={(e) => handleHourChange(index, 'isOpen', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-lg w-20">{hour.dayAr}</span>
                  <span className="text-gray-600 text-sm w-16">{hour.day}</span>
                </div>
                
                {hour.isOpen ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">من</span>
                      <Input
                        type="time"
                        value={hour.openTime}
                        onChange={(e) => handleHourChange(index, 'openTime', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">إلى</span>
                      <Input
                        type="time"
                        value={hour.closeTime}
                        onChange={(e) => handleHourChange(index, 'closeTime', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[60px]">
                      {(() => {
                        const start = new Date(`2024-01-01T${hour.openTime}:00`)
                        const end = new Date(`2024-01-01T${hour.closeTime}:00`)
                        const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60) * 10) / 10
                        return `${diff} ساعة`
                      })()}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500 px-4 py-2">مغلق</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timezone Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">إعدادات المنطقة الزمنية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">المنطقة الزمنية</label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                  <SelectItem value="Asia/Kuwait">Asia/Kuwait (GMT+3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Reply Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">الرد التلقائي خارج ساعات العمل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoReply"
                checked={autoReply.enabled}
                onChange={(e) => setAutoReply({...autoReply, enabled: e.target.checked})}
                className="w-4 h-4"
              />
              <label htmlFor="autoReply" className="text-sm font-medium">
                تفعيل الرد التلقائي
              </label>
            </div>

            {autoReply.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">الرسالة (عربي)</label>
                  <Textarea
                    value={autoReply.message}
                    onChange={(e) => setAutoReply({...autoReply, message: e.target.value})}
                    className="text-right"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">الرسالة (إنجليزي)</label>
                  <Textarea
                    value={autoReply.messageEn}
                    onChange={(e) => setAutoReply({...autoReply, messageEn: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Holidays */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-right">الأجازات والعطل الرسمية</CardTitle>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Calendar className="w-4 h-4 ml-2" />
              إضافة عطلة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{holiday.nameAr}</h4>
                  <p className="text-sm text-gray-600">{holiday.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(holiday.date).toLocaleDateString('ar-SA')}
                    {holiday.isRecurring && ' (سنوي)'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">تعديل</Button>
                  <Button size="sm" variant="outline">حذف</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}