# Saudi Admin Dashboard - Comprehensive Design Specifications

## Overview
This document provides detailed wireframes and component specifications for the Saudi admin dashboard pages, focusing on cultural considerations, RTL design, and Saudi-specific business requirements.

---

## 1. ENHANCED SETTINGS PAGE DESIGN

### 1.1 Layout Structure
The Settings page follows a tabbed interface optimized for Saudi admin workflows:

#### Tab Navigation (RTL Layout)
```
[الأمان والامتثال] [إدارة المستخدمين] [التوطين] [الإعدادات العامة] [إعدادات سعودية] [النظام]
```

### 1.2 New Components Required

#### A. Prayer Time Configuration Component
```typescript
interface PrayerTimeSettings {
  enablePrayerTimeBlocking: boolean;
  notificationGracePeriod: number; // minutes before/after prayer
  blockCriticalOperations: boolean;
  displayPrayerTimes: boolean;
  location: {
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    }
  };
  prayerTimeSource: 'ISLAMIC_FINDER' | 'PRAYER_TIMES_API' | 'LOCAL_CALCULATION';
}
```

#### B. Saudi Compliance Panel
```typescript
interface SaudiComplianceSettings {
  samaCompliance: {
    enabled: boolean;
    bankingLicenseNumber?: string;
    complianceOfficer: string;
    reportingSchedule: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  };
  zakatCalculation: {
    enabled: boolean;
    rate: number;
    exemptCategories: string[];
  };
  halalCertification: {
    required: boolean;
    certifyingBodies: string[];
    renewalReminders: boolean;
  };
}
```

#### C. Role Matrix Component
```typescript
interface RolePermissionMatrix {
  role: UserRole;
  permissions: {
    [module: string]: {
      [action: string]: boolean; // create, read, update, delete, approve
    }
  };
}
```

### 1.3 Enhanced Tab Content

#### Tab 1: الإعدادات العامة (General Settings)
**Layout:** Two-column grid with Arabic-first content

**Components:**
- Bilingual site information (Arabic primary, English secondary)
- Prayer time integration toggle
- Business hours with prayer time awareness
- Saudi-specific date formats (Hijri + Gregorian)

#### Tab 2: التوطين (Localization)
**Layout:** Progressive disclosure with cultural context

**Components:**
- Arabic typography settings (font size multiplier: 1.2x)
- Number formatting (Arabic-Indic vs Western)
- Calendar preferences (Hijri primary/secondary)
- Cultural color preferences
- Address format configuration (Saudi address standards)

#### Tab 3: إدارة المستخدمين (User Management)
**Layout:** Master-detail with permission matrix

**Components:**
- Role hierarchy visualization
- Permission matrix table
- Saudi ID (Iqama/National ID) validation settings
- Multi-language user interface preferences

#### Tab 4: الإشعارات (Notifications)
**Layout:** Three-column notification types with prayer time considerations

**Components:**
- Prayer-time aware scheduling
- WhatsApp integration settings
- SMS gateway configuration (Saudi telecom providers)
- Email templates in Arabic/English

#### Tab 5: الأمان والامتثال (Security & Compliance)
**Layout:** Accordion-style sections for different compliance areas

**Components:**
- SAMA compliance settings
- Saudi PCI DSS requirements
- Data localization settings
- Cybersecurity framework alignment

---

## 2. LEAD MANAGEMENT SYSTEM DESIGN

### 2.1 Lead Inbox Dashboard

#### Layout Structure (RTL)
```
┌─────────────────────────────────────────────────────────┐
│  [إدارة العملاء المحتملين] [+ عميل جديد]                    │
├─────────────────────────────────────────────────────────┤
│  [KPI Cards - 5 columns]                               │
│  [العملاء الجدد] [المتابعة اليوم] [تحت المراجعة] [معدل التحويل] │
├─────────────────────────────────────────────────────────┤
│  [Prayer Time Status] [Business Hours] [Team Status]   │
├─────────────────────────────────────────────────────────┤
│  [Search & Filters Bar - Arabic Placeholders]          │
├─────────────────────────────────────────────────────────┤
│  [Lead List Table with Cultural Scoring]               │
└─────────────────────────────────────────────────────────┘
```

#### Cultural Scoring Components
```typescript
interface SaudiLeadScoring {
  demographicScore: {
    ageGroup: number; // Higher score for 25-45 demographic
    maritalStatus: number; // Family-oriented scoring
    location: number; // Major cities get higher scores
    nationality: number; // Saudi nationals vs expats
  };
  behavioralScore: {
    prayerTimeRespect: number; // Responds during appropriate hours
    languagePreference: number; // Arabic vs English communication
    communicationStyle: number; // Formal vs informal
    decisionMaking: number; // Individual vs family/group decisions
  };
  economicScore: {
    incomeLevel: number;
    employmentSector: number; // Government vs private vs business owner
    spendingPower: number;
    paymentPreference: number; // Cash vs card vs installments
  };
}
```

### 2.2 Lead Detail View

#### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  [Lead Header - Name, Score, Status] [Actions Dropdown] │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ معلومات     │  │ تاريخ       │  │ المحادثات    │      │
│  │ شخصية       │  │ التواصل     │  │ والملاحظات   │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
├─────────────────────────────────────────────────────────┤
│  [Cultural Preferences & Prayer Schedule]              │
├─────────────────────────────────────────────────────────┤
│  [Next Best Action Recommendations]                    │
└─────────────────────────────────────────────────────────┘
```

#### Cultural Data Components
```typescript
interface CulturalProfile {
  communicationPreferences: {
    preferredLanguage: 'ar' | 'en';
    formalityLevel: 'high' | 'medium' | 'low';
    communicationTiming: {
      respectsPrayerTimes: boolean;
      preferredHours: string; // e.g., "10:00-12:00,14:00-17:00"
      avoidFriday: boolean;
    };
  };
  familyContext: {
    decisionMaker: 'self' | 'spouse' | 'family' | 'patriarch';
    familySize: number;
    dependents: number;
  };
  businessContext: {
    sector: 'government' | 'private' | 'business' | 'retired';
    decisionInfluencers: string[];
    budgetApprovalProcess: string;
  };
}
```

### 2.3 Templates Management

#### Template Categories
```typescript
interface SaudiMessageTemplates {
  greeting: {
    formal_arabic: string;
    casual_arabic: string;
    english_backup: string;
  };
  appointment: {
    meeting_request: string;
    prayer_aware_scheduling: string;
    family_consultation_time: string;
  };
  product_presentation: {
    family_benefits: string;
    religious_compliance: string;
    economic_value: string;
  };
  follow_up: {
    respectful_reminder: string;
    seasonal_greetings: string; // Ramadan, Eid, etc.
    decision_timeline_respect: string;
  };
}
```

### 2.4 Follow-up Calendar with Prayer Times

#### Calendar Layout
```
┌─────────────────────────────────────────────────────────┐
│  [Calendar View Toggle] [Prayer Times Today] [Team Availability] │
├─────────────────────────────────────────────────────────┤
│  ┌─ الفجر ──┬─ الظهر ──┬─ العصر ──┬─ المغرب ──┬─ العشاء ─┐ │
│  │ 05:30   │ 12:15   │ 15:45   │ 18:30   │ 20:00   │ │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘ │
├─────────────────────────────────────────────────────────┤
│  [Smart Scheduling - Avoids Prayer Times]              │
│  [Family Time Consideration - Evenings & Weekends]     │
│  [Business Hours Integration]                          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 Prayer-Aware Scheduler Component

```typescript
interface PrayerAwareScheduler {
  currentLocation: SaudiCity;
  prayerTimes: PrayerSchedule;
  businessHours: BusinessHours;
  culturalAvoidance: {
    fridayAfternoon: boolean; // Jumu'ah prayer
    ramadanAdjustments: boolean;
    eidHolidays: boolean;
  };
}

// Usage in components
<PrayerAwareScheduler
  onTimeSelect={(time) => handleScheduling(time)}
  leadProfile={lead.culturalProfile}
  respectPrayerTimes={true}
  suggestAlternatives={true}
/>
```

### 3.2 Cultural Score Visualization

```typescript
// Circular progress with cultural context
<CulturalScoreWheel
  score={lead.culturalScore}
  breakdown={{
    communication: 85,
    timing: 92,
    family_context: 78,
    economic: 81
  }}
  culturalFactors={[
    { factor: 'Prayer Time Respect', score: 95, weight: 0.3 },
    { factor: 'Family Decision Input', score: 85, weight: 0.25 },
    { factor: 'Arabic Communication', score: 90, weight: 0.2 },
    { factor: 'Local Business Hours', score: 88, weight: 0.25 }
  ]}
/>
```

### 3.3 Bilingual Form Components

```typescript
// Automatically validates and formats Saudi-specific data
<SaudiForm>
  <BilingualInput
    labelAr="الاسم الكامل"
    labelEn="Full Name"
    validation="saudi_name"
    dir="rtl"
  />
  <SaudiPhoneInput
    format="saudi_mobile"
    validation="saudi_telecom"
  />
  <SaudiAddressInput
    includeDistrict={true}
    includePOBox={true}
    validation="saudi_postal"
  />
</SaudiForm>
```

### 3.4 Prayer Time Integration Components

```typescript
// Dashboard widget showing current prayer time status
<PrayerTimeStatus
  currentPrayer="العصر"
  nextPrayer="المغرب"
  timeToNext="1:23"
  location="الرياض"
  affectsScheduling={true}
/>

// Lead activity timeline with prayer time awareness
<ActivityTimeline
  activities={lead.activities}
  showPrayerGaps={true}
  culturalContext={true}
/>
```

---

## 4. STYLING GUIDELINES

### 4.1 Saudi Cultural Colors

```css
:root {
  /* Primary Colors - Trust and Authority */
  --saudi-green: #006C35;        /* Saudi flag green */
  --saudi-gold: #D4AF37;         /* Premium/luxury accent */
  --saudi-blue: #1E40AF;         /* Trust and reliability */
  
  /* Cultural Context Colors */
  --islamic-green: #16A34A;      /* Success and Islamic context */
  --desert-sand: #F5E6D3;        /* Warm background */
  --arabic-calligraphy: #2D1B0F; /* Dark text for Arabic */
  
  /* Status Colors */
  --halal-approved: #059669;     /* Green for compliant */
  --prayer-time: #7C3AED;        /* Purple for religious timing */
  --family-context: #EA580C;     /* Orange for family decisions */
}
```

### 4.2 Typography Scale for Arabic

```css
/* Arabic-first typography with proper scaling */
.text-arabic {
  font-family: 'Noto Sans Arabic', 'IBM Plex Sans Arabic', sans-serif;
  font-size: 1.2em; /* 20% larger than English */
  line-height: 1.6;
  letter-spacing: 0.02em;
}

.text-arabic-heading {
  font-weight: 600;
  font-size: 1.4em;
  line-height: 1.4;
}

/* Responsive Arabic typography */
@media (max-width: 768px) {
  .text-arabic {
    font-size: 1.1em;
  }
}
```

### 4.3 RTL Layout Patterns

```css
/* RTL-first layout utilities */
.rtl-grid {
  direction: rtl;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.rtl-flex-between {
  display: flex;
  justify-content: space-between;
  direction: rtl;
}

/* Arabic form inputs */
.input-arabic {
  text-align: right;
  direction: rtl;
  padding-right: 0.75rem;
  padding-left: 2.5rem; /* Space for icons on the left in RTL */
}

/* Cultural spacing adjustments */
.cultural-spacing {
  margin-right: 1rem; /* Equivalent to ml-4 in LTR */
  margin-left: 0;
}
```

---

## 5. ACCESSIBILITY CONSIDERATIONS

### 5.1 Arabic Screen Reader Support

```typescript
// ARIA labels in Arabic with English fallbacks
<Button
  aria-label="حفظ الإعدادات"
  aria-describedby="save-settings-help"
>
  <span>حفظ</span>
  <span className="sr-only" lang="en">Save Settings</span>
</Button>

// Cultural context in announcements
<div
  role="status"
  aria-live="polite"
  aria-label="تحديث حالة أوقات الصلاة"
>
  Prayer time status updated
</div>
```

### 5.2 Cultural Keyboard Navigation

```typescript
// RTL keyboard navigation patterns
const handleRTLNavigation = (e: KeyboardEvent) => {
  switch(e.key) {
    case 'ArrowRight':
      // Move to previous item in RTL
      moveToPrevious();
      break;
    case 'ArrowLeft':
      // Move to next item in RTL
      moveToNext();
      break;
  }
};
```

---

## 6. IMPLEMENTATION PRIORITY

### Phase 1 (High Priority)
1. Enhanced Settings tabs with Saudi compliance
2. Prayer time integration components
3. RTL layout corrections
4. Arabic typography improvements

### Phase 2 (Medium Priority)
1. Cultural lead scoring system
2. Prayer-aware scheduling
3. Bilingual template system
4. Saudi-specific form validations

### Phase 3 (Nice to Have)
1. Advanced cultural analytics
2. AI-powered cultural recommendations
3. Integration with Saudi government APIs
4. Advanced prayer time calculations

---

## 7. DEVELOPMENT GUIDELINES

### 7.1 Component Development Standards

```typescript
// All components should support RTL and Arabic content
interface SaudiComponentProps {
  dir?: 'rtl' | 'ltr';
  lang?: 'ar' | 'en';
  culturalContext?: CulturalContext;
  prayerTimeAware?: boolean;
}

// Example component structure
const SaudiAdminComponent: React.FC<SaudiComponentProps> = ({
  dir = 'rtl',
  lang = 'ar',
  culturalContext,
  prayerTimeAware = true,
  ...props
}) => {
  // Component implementation
};
```

### 7.2 Testing Requirements

```typescript
// Cultural testing scenarios
describe('Saudi Cultural Components', () => {
  it('should render Arabic text correctly', () => {
    // Test Arabic text rendering
  });
  
  it('should respect prayer time constraints', () => {
    // Test prayer time integration
  });
  
  it('should handle RTL layout properly', () => {
    // Test RTL layout behavior
  });
  
  it('should validate Saudi-specific data formats', () => {
    // Test Saudi ID, phone, address validation
  });
});
```

This comprehensive design specification provides a detailed roadmap for implementing Saudi-specific admin dashboard features with proper cultural considerations, RTL support, and business context awareness.