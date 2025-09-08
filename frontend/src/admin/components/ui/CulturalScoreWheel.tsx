import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, MessageCircle, Clock, DollarSign, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';

interface CulturalFactor {
  factor: string;
  factorAr: string;
  score: number;
  weight: number;
  icon: React.ElementType;
  description: string;
  descriptionAr: string;
}

interface CulturalScoreWheelProps {
  leadId: string;
  overallScore: number;
  culturalFactors: CulturalFactor[];
  onScoreUpdate?: (leadId: string, newScore: number) => void;
  showDetailed?: boolean;
}

const defaultCulturalFactors: CulturalFactor[] = [
  {
    factor: 'Prayer Time Respect',
    factorAr: 'احترام أوقات الصلاة',
    score: 95,
    weight: 0.25,
    icon: Clock,
    description: 'Responds during appropriate business hours, avoids prayer times',
    descriptionAr: 'يتجاوب في ساعات العمل المناسبة، يتجنب أوقات الصلاة'
  },
  {
    factor: 'Arabic Communication',
    factorAr: 'التواصل باللغة العربية',
    score: 90,
    weight: 0.20,
    icon: MessageCircle,
    description: 'Prefers Arabic language in communication',
    descriptionAr: 'يفضل التواصل باللغة العربية'
  },
  {
    factor: 'Family Decision Input',
    factorAr: 'مشاركة العائلة في القرار',
    score: 85,
    weight: 0.20,
    icon: Users,
    description: 'Includes family members in decision making process',
    descriptionAr: 'يشارك أفراد العائلة في اتخاذ القرار'
  },
  {
    factor: 'Economic Context',
    factorAr: 'السياق الاقتصادي',
    score: 88,
    weight: 0.15,
    icon: DollarSign,
    description: 'Government employee with stable income',
    descriptionAr: 'موظف حكومي بدخل مستقر'
  },
  {
    factor: 'Local Preference',
    factorAr: 'التفضيل المحلي',
    score: 92,
    weight: 0.20,
    icon: MapPin,
    description: 'Prefers local businesses and Saudi-compliant services',
    descriptionAr: 'يفضل الشركات المحلية والخدمات المتوافقة مع الأنظمة السعودية'
  }
];

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-emerald-600';
  if (score >= 80) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number): string => {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 80) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  if (score >= 60) return 'bg-orange-500';
  return 'bg-red-500';
};

const getScoreLabel = (score: number): { en: string; ar: string } => {
  if (score >= 90) return { en: 'Excellent', ar: 'ممتاز' };
  if (score >= 80) return { en: 'Good', ar: 'جيد' };
  if (score >= 70) return { en: 'Fair', ar: 'مقبول' };
  if (score >= 60) return { en: 'Needs Attention', ar: 'يحتاج انتباه' };
  return { en: 'Poor', ar: 'ضعيف' };
};

const ScoreWheel: React.FC<{ score: number; size?: number }> = ({ score, size = 120 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);
  
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  
  const scoreLabel = getScoreLabel(score);
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted"
          opacity="0.2"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
        />
      </svg>
      
      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {scoreLabel.ar}
        </span>
      </div>
    </div>
  );
};

export const CulturalScoreWheel: React.FC<CulturalScoreWheelProps> = ({
  leadId,
  overallScore,
  culturalFactors = defaultCulturalFactors,
  onScoreUpdate,
  showDetailed = true
}) => {
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);
  const scoreLabel = getScoreLabel(overallScore);
  
  // Calculate weighted average if factors are provided
  const calculatedScore = culturalFactors.reduce((acc, factor) => {
    return acc + (factor.score * factor.weight);
  }, 0);
  
  const displayScore = overallScore || Math.round(calculatedScore);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">النقاط الثقافية</span>
          </div>
          <Badge variant="outline" className={`${getScoreColor(displayScore)} border-current`}>
            {scoreLabel.ar}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score Wheel */}
        <div className="flex justify-center">
          <ScoreWheel score={displayScore} size={140} />
        </div>
        
        {/* Cultural Factors Breakdown */}
        {showDetailed && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground" dir="rtl">
              تفاصيل العوامل الثقافية
            </h4>
            
            <div className="space-y-3">
              {culturalFactors.map((factor, index) => {
                const IconComponent = factor.icon;
                const isExpanded = expandedFactor === factor.factor;
                
                return (
                  <div 
                    key={factor.factor}
                    className="group"
                  >
                    <div 
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isExpanded 
                          ? 'bg-accent border-accent-foreground/20' 
                          : 'border-border hover:bg-accent/50'
                      }`}
                      onClick={() => setExpandedFactor(isExpanded ? null : factor.factor)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2 rounded-full ${getScoreBgColor(factor.score)}/10`}>
                            <IconComponent className={`h-4 w-4 ${getScoreColor(factor.score)}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium" dir="rtl">
                                {factor.factorAr}
                              </span>
                              <span className={`text-sm font-bold ${getScoreColor(factor.score)}`}>
                                {factor.score}%
                              </span>
                            </div>
                            <Progress 
                              value={factor.score} 
                              className="h-2 mt-2" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Weight indicator */}
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span dir="rtl">الوزن النسبي: {Math.round(factor.weight * 100)}%</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(factor.score)}/20 ${getScoreColor(factor.score)}`}>
                          {factor.score >= 90 ? 'ممتاز' : 
                           factor.score >= 80 ? 'جيد' : 
                           factor.score >= 70 ? 'مقبول' : 
                           factor.score >= 60 ? 'يحتاج تحسين' : 'ضعيف'}
                        </span>
                      </div>
                      
                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                          <p className="text-xs text-muted-foreground" dir="rtl">
                            {factor.descriptionAr}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {factor.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Score Insights */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-blue-800 mb-1" dir="rtl">
                نصائح للتحسين
              </h5>
              <ul className="text-sm text-blue-700 space-y-1" dir="rtl">
                {displayScore >= 90 ? (
                  <li>• عميل ممتاز - حافظ على نفس أسلوب التواصل الحالي</li>
                ) : displayScore >= 80 ? (
                  <>
                    <li>• عميل جيد - يمكن تحسين بعض الجوانب</li>
                    <li>• ركز على العوامل ذات النقاط الأقل</li>
                  </>
                ) : (
                  <>
                    <li>• يحتاج اهتمام خاص بالجوانب الثقافية</li>
                    <li>• استخدم القوالب المخصصة للسياق الثقافي</li>
                    <li>• اعتمد على التواصل الرسمي باللغة العربية</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CulturalScoreWheel;