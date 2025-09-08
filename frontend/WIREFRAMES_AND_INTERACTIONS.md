# Saudi Admin Dashboard - Detailed Wireframes and Interactions

## WIREFRAME 1: Enhanced Settings Page (RTL Layout)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⚙️ إعدادات النظام                                    [إعادة تعيين] [حفظ الإعدادات] │
│  Configure system preferences and administration settings                  │
└─────────────────────────────────────────────────────────────────────────────┘
│                                                                           │
│  💚 Settings saved successfully! - تم حفظ الإعدادات بنجاح!                   │
│                                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  [System Health KPI Cards - 4 columns]                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │   💾 45%     │ │   📊 67%     │ │   🗂️ 23%     │ │ System Health    │ │
│  │ CPU Usage    │ │ Memory Usage │ │ Disk Usage   │ │ صحة النظام        │ │
│  │ استخدام المعالج│ │ استخدام الذاكرة│ │ استخدام القرص│ │                  │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [إعدادات سعودية] [النظام] [الأمان والامتثال] [الإشعارات] [التوطين] [الإعدادات العامة] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ TAB: الإعدادات العامة (General Settings) ─────────────────────────────────┐ │
│ │                                                                         │ │
│ │ ┌─ Site Information - معلومات الموقع ────────────────────────────────────┐ │ │
│ │ │ ┌─────────────────────┐  ┌─────────────────────────────────────────┐  │ │ │
│ │ │ │ Site Name (English) │  │ Site Name (Arabic) - اسم الموقع         │  │ │ │
│ │ │ │ [________________]  │  │ [منصة التجارة الإلكترونية السعودية]      │  │ │ │
│ │ │ └─────────────────────┘  └─────────────────────────────────────────┘  │ │ │
│ │ │                                                                     │ │ │
│ │ │ ┌──────────────────────────────┐  ┌─────────────────────────────────┐ │ │ │
│ │ │ │ Description (English)        │  │ Description (Arabic) - الوصف    │ │ │ │
│ │ │ │ [Leading e-commerce platform│  │ │ [منصة التجارة الإلكترونية      │ │ │ │
│ │ │ │  in Saudi Arabia            │  │ │  الرائدة في المملكة العربية   │ │ │ │
│ │ │ │  ______________________]    │  │ │  السعودية                     │ │ │ │
│ │ │ └──────────────────────────────┘  └─────────────────────────────────┘ │ │ │
│ │ │                                                                     │ │ │
│ │ │ ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │ │ │
│ │ │ │ Admin Email                 │  │ Support Email                   │  │ │ │
│ │ │ │ [admin@platform.sa]         │  │ [support@platform.sa]           │  │ │ │
│ │ │ └─────────────────────────────┘  └─────────────────────────────────┘  │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ ┌─ Prayer Time Integration - تكامل أوقات الصلاة ─────────────────────────┐ │ │
│ │ │ ┌─ Current Prayer Times - أوقات الصلاة اليوم ────────────────────────┐ │ │ │
│ │ │ │ 🕌 الفجر: 05:30  📿 الظهر: 12:15  🌅 العصر: 15:45               │ │ │ │
│ │ │ │ 🌆 المغرب: 18:30  🌙 العشاء: 20:00                              │ │ │ │
│ │ │ └───────────────────────────────────────────────────────────────────┘ │ │ │
│ │ │                                                                     │ │ │
│ │ │ ┌─ Settings ─────────────────────────────────┐                      │ │ │
│ │ │ │ [🔘] Display Prayer Times in Dashboard     │                      │ │ │
│ │ │ │ [🔘] Block Operations During Prayer (15min)│                      │ │ │
│ │ │ │ [🔘] Adjust Notification Timing            │                      │ │ │
│ │ │ │ [🔘] Friday Afternoon Restrictions         │                      │ │ │
│ │ │ └─────────────────────────────────────────────┘                      │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ ┌─ Appearance - المظهر ───────────────────────────────────────────────────┐ │ │
│ │ │ ┌────────────┐  ┌─────────────────────┐  ┌──────────────────────────┐ │ │ │
│ │ │ │ Theme-السمة │  │ Animations-الحركات    │  │ Compact Mode-الوضع المضغوط│ │ │ │
│ │ │ │ [System ▼] │  │ [Enabled    🔘]     │  │ [Disabled      ⚪]      │ │ │ │
│ │ │ │ النظام      │  │ تفعيل              │  │ إيقاف                   │ │ │ │
│ │ │ └────────────┘  └─────────────────────┘  └──────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ TAB: إدارة المستخدمين (User Management) ─────────────────────────────────┐ │
│ │                                                                         │ │
│ │ ┌─ Role & Permission Matrix - مصفوفة الأدوار والصلاحيات ──────────────────┐ │ │
│ │ │                                                                       │ │ │
│ │ │ ┌─────────────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ │            │ Users │Analytics│Products│Settings│Compliance│Reports │ │ │ │
│ │ │ │            │مستخدمين│ تحليلات │ منتجات  │إعدادات │ امتثال    │ تقارير │ │ │ │
│ │ │ ├────────────┼───────┼─────────┼────────┼────────┼──────────┼────────┤ │ │ │
│ │ │ │Admin       │  ✅   │   ✅    │   ✅   │   ✅   │    ✅    │   ✅   │ │ │ │
│ │ │ │مدير النظام  │       │         │        │        │          │        │ │ │ │
│ │ │ ├────────────┼───────┼─────────┼────────┼────────┼──────────┼────────┤ │ │ │
│ │ │ │Moderator   │  ✅   │   ⚪    │   ✅   │   ⚪   │    ⚪    │   ✅   │ │ │ │
│ │ │ │مشرف        │       │         │        │        │          │        │ │ │ │
│ │ │ ├────────────┼───────┼─────────┼────────┼────────┼──────────┼────────┤ │ │ │
│ │ │ │Support     │  ✅   │   ⚪    │   ⚪   │   ⚪   │    ⚪    │   ✅   │ │ │ │
│ │ │ │مندوب دعم    │       │         │        │        │          │        │ │ │ │
│ │ │ ├────────────┼───────┼─────────┼────────┼────────┼──────────┼────────┤ │ │ │
│ │ │ │Analyst     │  ⚪   │   ✅    │   ⚪   │   ⚪   │    ⚪    │   ✅   │ │ │ │
│ │ │ │محلل بيانات  │       │         │        │        │          │        │ │ │ │
│ │ │ └─────────────────────────────────────────────────────────────────────┘ │ │ │
│ │ │                                                                       │ │ │
│ │ │ [+ إضافة دور جديد] [تعديل الصلاحيات] [حفظ التغييرات]                       │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ ┌─ Saudi ID Validation Settings - إعدادات التحقق من الهوية السعودية ──────┐ │ │
│ │ │ [🔘] Require Saudi ID/Iqama verification                               │ │ │
│ │ │ [🔘] Auto-validate against Absher system                              │ │ │
│ │ │ [🔘] Store encrypted ID numbers                                        │ │ │
│ │ │                                                                       │ │ │
│ │ │ ID Format Validation:                                                 │ │ │
│ │ │ • Saudi National ID: [1-2]XXXXXXXXX (10 digits)                      │ │ │
│ │ │ • Iqama: [3-9]XXXXXXXXX (10 digits)                                  │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## WIREFRAME 2: Lead Management Dashboard (RTL Layout)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  👥 إدارة العملاء المحتملين                                    [+ إضافة عميل محتمل] │
│  Lead Management - متابعة وإدارة العملاء المحتملين وحالة المبيعات              │
└─────────────────────────────────────────────────────────────────────────────┘
│                                                                           │
│ ┌─ Prayer Time Status ─────────────────────────────────────────────────────┐ │
│ │ 🕌 الصلاة الحالية: العصر | القادمة: المغرب بعد 1:23 ساعة                    │ │
│ │ ⚠️ تجنب الاتصالات خلال فترة الصلاة (15 دقيقة قبل وبعد)                    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ [KPI Dashboard - 5 Cards]                                                │
│ ┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐ │
│ │   👥 1,247  ││   ⭐ 89     ││   💬 156    ││   ✅ 78     ││   📈 6.3%   │ │
│ │ إجمالي       ││ عملاء جدد    ││ تم التواصل   ││ مؤهلون      ││ معدل التحويل │ │
│ │ العملاء      ││ اليوم        ││             ││             ││ 78 صفقة    │ │
│ └─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘ │
│                                                                           │
│ [Today's Follow-ups & Team Status]                                       │
│ ┌─────────────────────────────────────────────┐ ┌─────────────────────────┐ │
│ │ 📅 المتابعة اليوم                             │ │ 🎯 متوسط النقاط        │ │
│ │ 🔥 23 عميل يحتاج متابعة اليوم                │ │ 73/100                 │ │
│ │ ⏰ 8 مواعيد مجدولة (مع مراعاة أوقات الصلاة)   │ │ ████████████░░░░        │ │
│ │ 👤 أحمد: 8 عملاء | فاطمة: 6 | خالد: 9       │ │                       │ │
│ └─────────────────────────────────────────────┘ └─────────────────────────┘ │
│                                                                           │
│ ┌─ Smart Search & Cultural Filters - البحث والفلترة الذكية ───────────────────┐ │
│ │ ┌─────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 🔍 [البحث بالاسم، الهاتف، المنتج، الملاحظات الثقافية...]              │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                       │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐     │ │
│ │ │ الحالة ▼    │ │ الأولوية ▼   │ │ المصدر ▼    │ │ المنطقة ▼       │     │ │
│ │ │ [جميع الحالات]│ │ [كل الأولويات]│ │ [كل المصادر] │ │ [كل المناطق]    │     │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘     │ │
│ │                                                                       │ │
│ │ ┌─ Cultural Context Filters ──────────────────────────────────────────┐ │ │
│ │ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────────┐   │ │ │
│ │ │ │ يفضل العربية  │ │ قرار عائلي    │ │ يحترم أوقات الصلاة             │   │ │ │
│ │ │ │ [  ✅  ]     │ │ [  ⚪  ]     │ │ [  ✅  ]                    │   │ │ │
│ │ │ └──────────────┘ └──────────────┘ └──────────────────────────────┘   │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                       │ │
│ │ Score Range: [40] ──────●────── [100] | Family Decision: [نعم ▼]       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Lead List with Cultural Scoring ────────────────────────────────────────┐ │
│ │ ┌───────────────────────────────────────────────────────────────────────┐ │ │
│ │ │العميل   │المنتج المطلوب│الحالة │الأولوية│النقاط│المصدر│المسؤول│آخر تواصل│📋│ │ │
│ │ ├─────────┼──────────────┼──────┼────────┼─────┼─────┼──────┼────────┼──┤ │ │
│ │ │👤 أحمد   │🏠 شقة سكنية   │ جديد │ عاجل   │ 92   │ 🌐  │ فاطمة │ 3 ساعات │⋮│ │ │
│ │ │محمد علي  │فيلا - حي النخيل│ 🔵  │ 🔴     │ ████ │ موقع│       │        │ │ │ │
│ │ │الرياض    │2-4 مليون ر.س  │      │        │      │     │       │        │ │ │
│ │ │🏆 Cultural Score: عالي (يحترم الصلاة، قرار عائلي، يفضل العربية)           │ │ │
│ │ ├─────────┼──────────────┼──────┼────────┼─────┼─────┼──────┼────────┼──┤ │ │
│ │ │👤 فاطمة  │💍 خاتم ذهب     │تم    │ متوسط  │ 78   │ 📞  │ أحمد  │ يوم واحد│⋮│ │ │
│ │ │الزهراء   │مجوهرات للخطوبة │التواصل│       │ ███░ │ هاتف│       │        │ │ │ │
│ │ │جدة      │50-100 ألف ر.س │ 🟡  │ 🟠     │      │     │       │        │ │ │
│ │ │🎭 Cultural: قرار مشترك مع العائلة، تفضل التواصل المسائي                   │ │ │
│ │ ├─────────┼──────────────┼──────┼────────┼─────┼─────┼──────┼────────┼──┤ │ │
│ │ │👤 خالد   │🚗 سيارة جديدة  │مؤهل │ عالي   │ 85   │ 📱  │ ---   │ 3 أيام │⋮│ │ │
│ │ │الدوسري   │تويوتا كامري    │ ✅   │ 🟠     │ ████ │ واتس│ غير مسند│        │ │ │
│ │ │الدمام     │120-150 ألف ر.س│      │        │      │ آب  │       │        │ │ │
│ │ │⏰ Timing: يفضل الاتصال بعد العصر، متاح نهايات الأسبوع                   │ │ │
│ │ └───────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ [Previous السابق] [1] [2] [3] ... [12] [Next التالي]                    │ │
│ │ عرض 1-10 من إجمالي 247 عميل محتمل                                      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## WIREFRAME 3: Lead Detail View (Cultural Context)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Leads    أحمد محمد العلي - Lead Details    [Actions ⋮]             │
│                   Score: 92/100 🏆 | Status: جديد | Priority: عاجل            │
└─────────────────────────────────────────────────────────────────────────────┘
│                                                                           │
│ ┌─ Quick Actions Bar ───────────────────────────────────────────────────────┐ │
│ │ [📞 Call Now] [💬 WhatsApp] [📧 Email] [📅 Schedule] [✏️ Add Note] [⚡ Quick Update] │
│ │ ⚠️ Prayer Time: Maghrib in 45 min - Avoid calling after 18:15            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ┌─ معلومات شخصية ────┐ ┌─ تاريخ التواصل ──────┐ ┌─ المحادثات والملاحظات ──┐ │ │
│ │ │ 👤 الاسم: أحمد محمد │ │ 📅 First Contact:    │ │ 💬 Latest Notes:      │ │ │
│ │ │    العلي            │ │    2024-09-01        │ │    "يفضل المكالمات    │ │ │
│ │ │                   │ │                      │ │     بعد العصر.        │ │ │
│ │ │ 📱 الهاتف:         │ │ 📞 Last Contact:     │ │     العائلة مهتمة     │ │ │
│ │ │    +966 50 123 456│ │    3 hours ago       │ │     بالموضوع."        │ │ │
│ │ │                   │ │                      │ │                      │ │ │
│ │ │ 📍 الموقع:         │ │ 🔄 Total Interactions│ │ 📝 Follow-up Notes:   │ │ │
│ │ │    الرياض - حي النخيل│ │    8 calls, 12 msgs  │ │    "Schedule family   │ │ │
│ │ │                   │ │                      │ │     consultation"     │ │ │
│ │ │ 💼 العمل:           │ │ ⭐ Response Rate:     │ │                      │ │ │
│ │ │    موظف حكومي      │ │    95% (Excellent)   │ │ [Add Note +]         │ │ │
│ │ └─────────────────────┘ └──────────────────────┘ └──────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Cultural Preferences & Islamic Context ──────────────────────────────────┐ │
│ │ ┌─ Communication Preferences ─────────────────────────────────────────────┐ │ │
│ │ │ 🗣️  Preferred Language: العربية (Arabic Primary)                        │ │ │
│ │ │ 📞 Best Contact Times: 10:00-12:00, 14:30-17:30 (Prayer-aware)        │ │ │
│ │ │ 🚫 Avoid: Friday 11:30-14:00 (Jumu'ah), Prayer times ±15min            │ │ │
│ │ │ 🎯 Communication Style: Formal, respectful approach                     │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ ┌─ Family & Decision Context ─────────────────────────────────────────────┐ │ │
│ │ │ 👨‍👩‍👧‍👦 Family Status: Married, 2 children                                │ │ │
│ │ │ 🤝 Decision Maker: Joint with spouse                                   │ │ │
│ │ │ 💡 Key Motivators: Family security, halal investment                   │ │ │
│ │ │ ⏰ Decision Timeline: Not rushed, prefers consultation                  │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ ┌─ Product Interest Details ──────────────────────────────────────────────┐ │ │
│ │ │ 🏠 Product: شقة سكنية (Residential Apartment)                           │ │ │
│ │ │ 📊 Category: Real Estate - عقارات                                      │ │ │
│ │ │ 💰 Budget: 2-4 million SAR                                             │ │ │
│ │ │ 📍 Preferred Areas: حي النخيل، حي الملقا، حي العليا                       │ │ │
│ │ │ 🔧 Requirements: 3BR, family-friendly, near mosque & schools           │ │ │
│ │ │ ⚡ Urgency: Medium - looking within 6 months                           │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Cultural Scoring Breakdown ──────────────────────────────────────────────┐ │
│ │ ┌─ Score Wheel ──────────────────┐ ┌─ Cultural Factors ──────────────────┐ │ │
│ │ │        92/100                  │ │ ✅ Prayer Time Respect      95/100 │ │ │
│ │ │         🏆                     │ │ ✅ Arabic Communication    90/100 │ │ │
│ │ │    ████████████████            │ │ ✅ Family Decision Input   85/100 │ │ │
│ │ │   ████ Excellent ████           │ │ ✅ Local Business Hours    88/100 │ │ │
│ │ │  ████ Cultural ████            │ │ ✅ Halal Investment Pref   98/100 │ │ │
│ │ │   ████ Match ████              │ │ ⚠️  Budget Verification    75/100 │ │ │
│ │ │    ████████████████            │ │ ✅ Location Preference     94/100 │ │ │
│ │ └────────────────────────────────┘ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Next Best Actions (AI-Powered Recommendations) ─────────────────────────┐ │
│ │ 🎯 High Priority Actions:                                               │ │
│ │                                                                         │ │
│ │ ┌─ 1. Schedule Family Consultation ──────────────────────────────────────┐ │ │
│ │ │ 📅 Best Time: Tomorrow 15:00-17:00 (After Asr, before Maghrib)       │ │ │
│ │ │ 👨‍👩‍👧‍👦 Include spouse in discussion                                     │ │ │
│ │ │ 📋 Prepare family-focused presentation                                 │ │ │
│ │ │ [Schedule Meeting] [Use Arabic Template]                              │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ ┌─ 2. Send Islamic-Compliant Property Options ──────────────────────────┐ │ │
│ │ │ 🏠 Focus on halal-financed properties                                 │ │ │
│ │ │ 🕌 Highlight proximity to mosques                                      │ │ │
│ │ │ 🎓 Include nearby Islamic schools                                      │ │ │
│ │ │ [Send Property List] [Islamic Finance Options]                        │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ ┌─ 3. Cultural Touch Points ─────────────────────────────────────────────┐ │ │
│ │ │ 📞 Call after Maghrib prayer (post 19:00)                             │ │ │
│ │ │ 🎭 Use formal Arabic greetings                                         │ │ │
│ │ │ 💰 Discuss Islamic financing benefits                                  │ │ │
│ │ │ [Use Cultural Script] [Schedule Culturally Appropriate Time]          │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Activity Timeline (Prayer-Time Aware) ───────────────────────────────────┐ │
│ │ Today - اليوم                                                            │ │
│ │ 10:30 📞 Attempted call (No answer - likely in meeting)                │ │
│ │ 12:00 🕌 [Prayer Gap - Dhuhr] ⏸️ No activity scheduled                   │ │
│ │ 14:00 💬 WhatsApp message sent (Property brochures)                    │ │
│ │ 15:30 📞 Successful call (15min) - discussed family needs              │ │
│ │ 18:30 🕌 [Prayer Gap - Maghrib] ⏸️ Respected prayer time                │ │
│ │                                                                         │ │
│ │ Yesterday - أمس                                                          │ │
│ │ 11:00 📧 Email sent (Initial property options)                         │ │
│ │ 16:00 📞 First contact call (30min) - qualification                    │ │
│ │                                                                         │ │
│ │ [Show More Activity] [Export Timeline]                                  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## WIREFRAME 4: Template Management (Bilingual)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📝 Templates Management - إدارة القوالب              [+ New Template إضافة قالب] │
│ Manage bilingual message templates for lead communication                   │
└─────────────────────────────────────────────────────────────────────────────┘
│                                                                           │
│ ┌─ Template Categories ─────────────────────────────────────────────────────┐ │
│ │ [📞 Initial Contact] [📅 Appointments] [🏠 Property Info] [💰 Financial]    │ │
│ │ [🎉 Seasonal Greetings] [📋 Follow-ups] [✅ Closing] [🤝 Cultural Scripts] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Template Editor (Split View) ────────────────────────────────────────────┐ │
│ │ Template Name: "Family Property Consultation" - "استشارة عقارية عائلية"    │ │
│ │ Category: Property Info | Usage: High Priority Leads                     │ │
│ │                                                                         │ │
│ │ ┌─ Arabic Version (Primary) ──────┐ ┌─ English Version (Secondary) ──────┐ │ │
│ │ │ السلام عليكم أخي الكريم {name}    │ │ Dear Mr./Mrs. {name},             │ │ │
│ │ │                               │ │                                  │ │ │
│ │ │ أتمنى أن تكون بخير وعافية.       │ │ I hope this message finds you     │ │ │
│ │ │                               │ │ and your family in good health.   │ │ │
│ │ │ بعد محادثتنا الهاتفية، أود أن    │ │                                  │ │ │
│ │ │ أشارككم بعض الخيارات العقارية    │ │ Following our phone conversation, │ │ │
│ │ │ التي تناسب احتياجاتكم العائلية.   │ │ I'd like to share some property   │ │ │
│ │ │                               │ │ options that suit your family     │ │ │
│ │ │ المشاريع المقترحة:              │ │ needs.                           │ │ │
│ │ │ • حي {neighborhood} - قريب من   │ │                                  │ │ │
│ │ │   المساجد والمدارس              │ │ Suggested properties:            │ │ │
│ │ │ • تمويل إسلامي متاح             │ │ • {neighborhood} area - close    │ │ │
│ │ │ • أسعار تبدأ من {price_range}  │ │   to mosques and schools         │ │ │
│ │ │                               │ │ • Islamic financing available     │ │ │
│ │ │ هل يمكن ترتيب زيارة عائلية؟     │ │ • Prices starting from           │ │ │
│ │ │ أقترح وقتاً بعد صلاة العصر      │ │   {price_range}                  │ │ │
│ │ │ ليناسب الجميع.                  │ │                                  │ │ │
│ │ │                               │ │ Can we arrange a family visit?    │ │ │
│ │ │ في انتظار ردكم الكريم           │ │ I suggest timing after Asr       │ │ │
│ │ │                               │ │ prayer to suit everyone.         │ │ │
│ │ │ مع فائق الاحترام والتقدير       │ │                                  │ │ │
│ │ │ {agent_name}                  │ │ Looking forward to your reply.   │ │ │
│ │ │                               │ │                                  │ │ │
│ │ │ [Preview Arabic]              │ │ Best regards,                    │ │ │
│ │ │                               │ │ {agent_name}                     │ │ │
│ │ │                               │ │                                  │ │ │
│ │ │                               │ │ [Preview English]                │ │ │
│ │ └─────────────────────────────────┘ └──────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ ┌─ Template Variables ───────────────────────────────────────────────────┐ │ │
│ │ │ Available Variables:                                                  │ │ │
│ │ │ {name} - Customer name | {phone} - Phone number | {city} - Location  │ │ │
│ │ │ {product} - Product interest | {price_range} - Budget                │ │ │
│ │ │ {agent_name} - Agent name | {prayer_time} - Next prayer time         │ │ │
│ │ │ {cultural_greeting} - Culturally appropriate greeting                │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ ┌─ Cultural Adaptations ─────────────────────────────────────────────────┐ │ │
│ │ │ [🔘] Use Islamic greetings (السلام عليكم)                                │ │ │
│ │ │ [🔘] Include prayer time considerations                                │ │ │
│ │ │ [🔘] Formal Arabic tone                                               │ │ │
│ │ │ [🔘] Family-inclusive language                                        │ │ │
│ │ │ [🔘] Halal/Islamic compliance mentions                                │ │ │
│ │ └─────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                         │ │
│ │ [Test Template] [Save] [Send Sample] [Cancel]                           │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ┌─ Template Library ────────────────────────────────────────────────────────┐ │
│ │ ┌────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │Template                     │Category        │Usage │Last Updated │Actions│ │ │
│ │ ├─────────────────────────────┼────────────────┼──────┼─────────────┼───────┤ │ │
│ │ │🕌 Ramadan Greetings         │Seasonal        │ 24   │ 2 days ago  │ ⋮     │ │ │
│ │ │ تهنئة رمضانية               │موسمية          │      │             │       │ │ │
│ │ ├─────────────────────────────┼────────────────┼──────┼─────────────┼───────┤ │ │
│ │ │📞 First Contact - Formal    │Initial Contact │ 156  │ 1 week ago  │ ⋮     │ │ │
│ │ │ الاتصال الأول - رسمي         │اتصال أولي       │      │             │       │ │ │
│ │ ├─────────────────────────────┼────────────────┼──────┼─────────────┼───────┤ │ │
│ │ │🏠 Property Viewing Invite   │Appointments    │ 89   │ 3 days ago  │ ⋮     │ │ │
│ │ │ دعوة لمعاينة العقار          │مواعيد          │      │             │       │ │ │
│ │ ├─────────────────────────────┼────────────────┼──────┼─────────────┼───────┤ │ │
│ │ │💰 Islamic Finance Options   │Financial       │ 67   │ 1 week ago  │ ⋮     │ │ │
│ │ │ خيارات التمويل الإسلامي      │مالية           │      │             │       │ │ │
│ │ └────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## INTERACTION FLOWS

### Flow 1: Cultural Lead Scoring Process

```
1. Lead enters system → 
2. Cultural data collection → 
3. AI analysis of cultural factors → 
4. Score calculation with weights → 
5. Recommendation generation → 
6. Agent receives contextualized lead

Cultural Factors Analysis:
- Language preference detection
- Prayer time communication patterns
- Family decision-making indicators
- Formal vs informal communication style
- Economic context (government vs private sector)
- Regional cultural variations
```

### Flow 2: Prayer-Aware Scheduling

```
1. Agent attempts to schedule → 
2. System checks current prayer times → 
3. Blocks ±15 min around each prayer → 
4. Suggests optimal contact windows → 
5. Validates against lead's cultural profile → 
6. Confirms with Islamic calendar considerations

Prayer Time Integration:
- Real-time prayer time API
- Location-based calculations
- Seasonal adjustments
- Ramadan/Eid considerations
- Friday Jumu'ah restrictions
```

### Flow 3: Bilingual Template Application

```
1. Agent selects lead → 
2. System detects preferred language → 
3. Suggests culturally appropriate template → 
4. Auto-populates with lead data → 
5. Cultural adaptations applied → 
6. Preview both Arabic and English versions → 
7. Send via preferred channel (WhatsApp/Email/SMS)

Template Selection Logic:
- Lead cultural score
- Communication history
- Time of day/week
- Product category
- Family vs individual decision
- Urgency level
```

This comprehensive wireframe and interaction design provides the fullstack developer with detailed specifications for implementing a culturally-aware Saudi admin dashboard that respects Islamic values, prayer times, and Arabic-first design principles.