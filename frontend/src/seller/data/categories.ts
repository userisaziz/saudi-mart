import { Category } from '../types/category';

export const categoryTree: Category[] = [
  {
    id: 'industrial_equipment',
    value: 'industrial_equipment',
    label: 'Industrial Equipment',
    labelAr: 'معدات صناعية',
    level: 0,
    isActive: true,
    icon: '🏭',
    children: [
      {
        id: 'manufacturing_machinery',
        value: 'manufacturing_machinery',
        label: 'Manufacturing Machinery',
        labelAr: 'آلات التصنيع',
        parent: 'industrial_equipment',
        level: 1,
        isActive: true,
        icon: '⚙️',
        children: [
          {
            id: 'cnc_machines',
            value: 'cnc_machines',
            label: 'CNC Machines',
            labelAr: 'آلات CNC',
            parent: 'manufacturing_machinery',
            level: 2,
            isActive: true,
            specifications: [
              {
                id: 'axis_count',
                key: 'axis_count',
                keyAr: 'عدد المحاور',
                type: 'select',
                required: true,
                options: [
                  { value: '3_axis', label: '3-Axis', labelAr: '3 محاور' },
                  { value: '4_axis', label: '4-Axis', labelAr: '4 محاور' },
                  { value: '5_axis', label: '5-Axis', labelAr: '5 محاور' }
                ]
              },
              {
                id: 'spindle_power',
                key: 'spindle_power',
                keyAr: 'قوة المغزل',
                type: 'number',
                required: true
              }
            ]
          },
          {
            id: 'lathes',
            value: 'lathes',
            label: 'Lathes',
            labelAr: 'مخارط',
            parent: 'manufacturing_machinery',
            level: 2,
            isActive: true
          },
          {
            id: 'milling_machines',
            value: 'milling_machines',
            label: 'Milling Machines',
            labelAr: 'آلات الفرز',
            parent: 'manufacturing_machinery',
            level: 2,
            isActive: true
          }
        ]
      },
      {
        id: 'material_handling',
        value: 'material_handling',
        label: 'Material Handling Equipment',
        labelAr: 'معدات مناولة المواد',
        parent: 'industrial_equipment',
        level: 1,
        isActive: true,
        icon: '📦',
        children: [
          {
            id: 'forklifts',
            value: 'forklifts',
            label: 'Forklifts',
            labelAr: 'رافعات شوكية',
            parent: 'material_handling',
            level: 2,
            isActive: true,
            specifications: [
              {
                id: 'lift_capacity',
                key: 'lift_capacity',
                keyAr: 'قدرة الرفع',
                type: 'number',
                required: true
              },
              {
                id: 'fuel_type',
                key: 'fuel_type',
                keyAr: 'نوع الوقود',
                type: 'select',
                required: true,
                options: [
                  { value: 'electric', label: 'Electric', labelAr: 'كهربائي' },
                  { value: 'diesel', label: 'Diesel', labelAr: 'ديزل' },
                  { value: 'lpg', label: 'LPG', labelAr: 'غاز البترول المسال' }
                ]
              }
            ]
          },
          {
            id: 'conveyor_systems',
            value: 'conveyor_systems',
            label: 'Conveyor Systems',
            labelAr: 'أنظمة النقل',
            parent: 'material_handling',
            level: 2,
            isActive: true
          }
        ]
      }
    ]
  },
  {
    id: 'electrical_equipment',
    value: 'electrical_equipment',
    label: 'Electrical Equipment',
    labelAr: 'معدات كهربائية',
    level: 0,
    isActive: true,
    icon: '⚡',
    children: [
      {
        id: 'motors_drives',
        value: 'motors_drives',
        label: 'Motors & Drives',
        labelAr: 'محركات ومحركات',
        parent: 'electrical_equipment',
        level: 1,
        isActive: true,
        icon: '🔌',
        children: [
          {
            id: 'ac_motors',
            value: 'ac_motors',
            label: 'AC Motors',
            labelAr: 'محركات تيار متردد',
            parent: 'motors_drives',
            level: 2,
            isActive: true,
            specifications: [
              {
                id: 'power_rating',
                key: 'power_rating',
                keyAr: 'تقييم الطاقة',
                type: 'number',
                required: true
              },
              {
                id: 'voltage',
                key: 'voltage',
                keyAr: 'الجهد',
                type: 'select',
                required: true,
                options: [
                  { value: '220v', label: '220V', labelAr: '220 فولت' },
                  { value: '380v', label: '380V', labelAr: '380 فولت' },
                  { value: '440v', label: '440V', labelAr: '440 فولت' }
                ]
              }
            ]
          },
          {
            id: 'dc_motors',
            value: 'dc_motors',
            label: 'DC Motors',
            labelAr: 'محركات تيار مستمر',
            parent: 'motors_drives',
            level: 2,
            isActive: true
          }
        ]
      },
      {
        id: 'control_systems',
        value: 'control_systems',
        label: 'Control Systems',
        labelAr: 'أنظمة التحكم',
        parent: 'electrical_equipment',
        level: 1,
        isActive: true,
        icon: '🎛️',
        children: [
          {
            id: 'plc_systems',
            value: 'plc_systems',
            label: 'PLC Systems',
            labelAr: 'أنظمة PLC',
            parent: 'control_systems',
            level: 2,
            isActive: true
          },
          {
            id: 'hmi_panels',
            value: 'hmi_panels',
            label: 'HMI Panels',
            labelAr: 'لوحات HMI',
            parent: 'control_systems',
            level: 2,
            isActive: true
          }
        ]
      }
    ]
  },
  {
    id: 'hydraulic_pneumatic',
    value: 'hydraulic_pneumatic',
    label: 'Hydraulic & Pneumatic',
    labelAr: 'هيدروليكي وهوائي',
    level: 0,
    isActive: true,
    icon: '💨',
    children: [
      {
        id: 'hydraulic_systems',
        value: 'hydraulic_systems',
        label: 'Hydraulic Systems',
        labelAr: 'أنظمة هيدروليكية',
        parent: 'hydraulic_pneumatic',
        level: 1,
        isActive: true,
        children: [
          {
            id: 'hydraulic_pumps',
            value: 'hydraulic_pumps',
            label: 'Hydraulic Pumps',
            labelAr: 'مضخات هيدروليكية',
            parent: 'hydraulic_systems',
            level: 2,
            isActive: true
          },
          {
            id: 'hydraulic_cylinders',
            value: 'hydraulic_cylinders',
            label: 'Hydraulic Cylinders',
            labelAr: 'أسطوانات هيدروليكية',
            parent: 'hydraulic_systems',
            level: 2,
            isActive: true
          }
        ]
      },
      {
        id: 'pneumatic_systems',
        value: 'pneumatic_systems',
        label: 'Pneumatic Systems',
        labelAr: 'أنظمة هوائية',
        parent: 'hydraulic_pneumatic',
        level: 1,
        isActive: true,
        children: [
          {
            id: 'air_compressors',
            value: 'air_compressors',
            label: 'Air Compressors',
            labelAr: 'ضواغط الهواء',
            parent: 'pneumatic_systems',
            level: 2,
            isActive: true
          },
          {
            id: 'pneumatic_valves',
            value: 'pneumatic_valves',
            label: 'Pneumatic Valves',
            labelAr: 'صمامات هوائية',
            parent: 'pneumatic_systems',
            level: 2,
            isActive: true
          }
        ]
      }
    ]
  },
  {
    id: 'safety_equipment',
    value: 'safety_equipment',
    label: 'Safety Equipment',
    labelAr: 'معدات السلامة',
    level: 0,
    isActive: true,
    icon: '🛡️',
    children: [
      {
        id: 'personal_protective',
        value: 'personal_protective',
        label: 'Personal Protective Equipment',
        labelAr: 'معدات الحماية الشخصية',
        parent: 'safety_equipment',
        level: 1,
        isActive: true,
        children: [
          {
            id: 'safety_helmets',
            value: 'safety_helmets',
            label: 'Safety Helmets',
            labelAr: 'خوذات الأمان',
            parent: 'personal_protective',
            level: 2,
            isActive: true
          },
          {
            id: 'safety_gloves',
            value: 'safety_gloves',
            label: 'Safety Gloves',
            labelAr: 'قفازات الأمان',
            parent: 'personal_protective',
            level: 2,
            isActive: true
          }
        ]
      },
      {
        id: 'fire_safety',
        value: 'fire_safety',
        label: 'Fire Safety Equipment',
        labelAr: 'معدات مكافحة الحرائق',
        parent: 'safety_equipment',
        level: 1,
        isActive: true,
        children: [
          {
            id: 'fire_extinguishers',
            value: 'fire_extinguishers',
            label: 'Fire Extinguishers',
            labelAr: 'طفايات الحريق',
            parent: 'fire_safety',
            level: 2,
            isActive: true
          }
        ]
      }
    ]
  }
];

// Helper functions for working with the category tree
export const flattenCategories = (categories: Category[]): Category[] => {
  const flatten = (cats: Category[]): Category[] => {
    return cats.reduce((acc: Category[], cat) => {
      acc.push(cat);
      if (cat.children) {
        acc.push(...flatten(cat.children));
      }
      return acc;
    }, []);
  };
  return flatten(categories);
};

export const findCategoryById = (categories: Category[], id: string): Category | undefined => {
  const flattened = flattenCategories(categories);
  return flattened.find(cat => cat.id === id);
};

export const getCategoryPath = (categories: Category[], categoryId: string): Category[] => {
  const category = findCategoryById(categories, categoryId);
  if (!category) return [];
  
  const path: Category[] = [category];
  let current = category;
  
  while (current.parent) {
    const parent = findCategoryById(categories, current.parent);
    if (parent) {
      path.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }
  
  return path;
};

export const getLeafCategories = (categories: Category[]): Category[] => {
  const flattened = flattenCategories(categories);
  return flattened.filter(cat => !cat.children || cat.children.length === 0);
};