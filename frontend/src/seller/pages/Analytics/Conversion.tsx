import React, { useState, useMemo } from 'react';
import { Chart } from '../../components/ui/Chart';
import {
  FunnelIcon,
  ChartBarIcon,
  ArrowArrowTrendingUpIcon,
  ArrowArrowTrendingDownIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  EyeIcon,
  ChartPieIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  value: number;
  conversionRate: number;
  avgTimeToNext: number; // in hours
  dropOffReasons?: string[];
  color: string;
}

interface ConversionSegment {
  name: string;
  visitors: number;
  leads: number;
  qualified: number;
  customers: number;
  color: string;
}

const mockFunnelData: FunnelStage[] = [
  {
    id: 'visitors',
    name: 'Website Visitors',
    count: 10000,
    value: 0,
    conversionRate: 100,
    avgTimeToNext: 0,
    color: '#3B82F6'
  },
  {
    id: 'inquiries',
    name: 'Inquiries Generated',
    count: 500,
    value: 0,
    conversionRate: 5.0,
    avgTimeToNext: 2,
    dropOffReasons: ['Not ready to buy', 'Price concerns', 'Looking for different product'],
    color: '#10B981'
  },
  {
    id: 'qualified',
    name: 'Qualified Leads',
    count: 200,
    value: 0,
    conversionRate: 40.0,
    avgTimeToNext: 24,
    dropOffReasons: ['Budget not approved', 'Wrong decision maker', 'Timeline mismatch'],
    color: '#F59E0B'
  },
  {
    id: 'proposals',
    name: 'Proposals Sent',
    count: 80,
    value: 320000,
    conversionRate: 40.0,
    avgTimeToNext: 120,
    dropOffReasons: ['Price too high', 'Went with competitor', 'Project cancelled'],
    color: '#8B5CF6'
  },
  {
    id: 'negotiations',
    name: 'In Negotiation',
    count: 35,
    value: 175000,
    conversionRate: 43.75,
    avgTimeToNext: 72,
    dropOffReasons: ['Terms not agreed', 'Payment terms', 'Delivery timeline'],
    color: '#EF4444'
  },
  {
    id: 'customers',
    name: 'Closed Won',
    count: 15,
    value: 90000,
    conversionRate: 42.86,
    avgTimeToNext: 0,
    color: '#10D6A3'
  }
];

const mockSegmentData: ConversionSegment[] = [
  { name: 'Organic Search', visitors: 4000, leads: 220, qualified: 90, customers: 8, color: '#3B82F6' },
  { name: 'Direct Traffic', visitors: 2500, leads: 125, qualified: 55, customers: 4, color: '#10B981' },
  { name: 'Social Media', visitors: 2000, leads: 80, qualified: 30, customers: 2, color: '#F59E0B' },
  { name: 'Referrals', visitors: 1000, leads: 55, qualified: 20, customers: 1, color: '#8B5CF6' },
  { name: 'Email Marketing', visitors: 500, leads: 20, qualified: 5, customers: 0, color: '#EF4444' }
];

const mockTimeSeriesData = [
  { name: 'Week 1', visitors: 2400, leads: 120, qualified: 48, customers: 3 },
  { name: 'Week 2', visitors: 2100, leads: 105, qualified: 42, customers: 2 },
  { name: 'Week 3', visitors: 2800, leads: 140, qualified: 56, customers: 4 },
  { name: 'Week 4', visitors: 2700, leads: 135, qualified: 54, customers: 6 },
];

interface FunnelVisualizationProps {
  stages: FunnelStage[];
  onStageClick: (stage: FunnelStage) => void;
}

const FunnelVisualization: React.FC<FunnelVisualizationProps> = ({ stages, onStageClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const nextStage = stages[index + 1];
          const dropOffCount = nextStage ? stage.count - nextStage.count : 0;
          const dropOffRate = nextStage ? ((dropOffCount / stage.count) * 100) : 0;
          const stageWidth = Math.max(20, (stage.count / stages[0].count) * 100);

          return (
            <div key={stage.id}>
              {/* Stage Bar */}
              <div 
                className="relative cursor-pointer group"
                onClick={() => onStageClick(stage)}
              >
                <div
                  className="h-16 rounded-lg flex items-center justify-between px-6 text-white font-medium transition-all duration-300 group-hover:shadow-lg"
                  style={{ 
                    backgroundColor: stage.color,
                    width: `${stageWidth}%`,
                    minWidth: '200px'
                  }}
                >
                  <div>
                    <div className="text-lg font-semibold">{stage.name}</div>
                    <div className="text-sm opacity-90">
                      {stage.count.toLocaleString()} {index === 0 ? 'visitors' : 'conversions'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{stage.conversionRate.toFixed(1)}%</div>
                    {stage.value > 0 && (
                      <div className="text-sm opacity-90">
                        ${(stage.value / 1000).toFixed(0)}k value
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Details */}
                <div className="absolute left-full top-0 ml-4 bg-gray-800 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                  <div className="text-sm">
                    <div>Count: {stage.count.toLocaleString()}</div>
                    <div>Conversion Rate: {stage.conversionRate.toFixed(2)}%</div>
                    {stage.value > 0 && <div>Total Value: ${stage.value.toLocaleString()}</div>}
                    {stage.avgTimeToNext > 0 && <div>Avg. Time to Next: {stage.avgTimeToNext}h</div>}
                  </div>
                </div>
              </div>

              {/* Drop-off Arrow and Stats */}
              {nextStage && (
                <div className="flex items-center my-3 ml-6">
                  <ArrowDownIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-red-600">
                      -{dropOffCount.toLocaleString()} ({dropOffRate.toFixed(1)}% drop-off)
                    </span>
                    {stage.dropOffReasons && (
                      <span className="ml-2 text-gray-500">
                        • Top reasons: {stage.dropOffReasons.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ConversionMetricsProps {
  stages: FunnelStage[];
}

const ConversionMetrics: React.FC<ConversionMetricsProps> = ({ stages }) => {
  const overallConversion = ((stages[stages.length - 1].count / stages[0].count) * 100).toFixed(2);
  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0);
  const avgDealSize = totalValue / stages[stages.length - 1].count;
  const totalLeads = stages[1].count;

  const metrics = [
    {
      label: 'Overall Conversion',
      value: `${overallConversion}%`,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Pipeline Value',
      value: `$${(totalValue / 1000).toFixed(0)}k`,
      icon: CurrencyDollarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Average Deal Size',
      value: `$${avgDealSize.toLocaleString()}`,
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Leads',
      value: totalLeads.toLocaleString(),
      icon: UserGroupIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{metric.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface SegmentAnalysisProps {
  segments: ConversionSegment[];
}

const SegmentAnalysis: React.FC<SegmentAnalysisProps> = ({ segments }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion by Traffic Source</h3>
      
      <div className="space-y-4">
        {segments.map((segment, index) => {
          const conversionRate = (segment.customers / segment.visitors * 100).toFixed(2);
          const leadConversionRate = (segment.leads / segment.visitors * 100).toFixed(2);
          const qualificationRate = (segment.qualified / segment.leads * 100).toFixed(2);
          const closeRate = (segment.customers / segment.qualified * 100).toFixed(2);

          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{conversionRate}%</div>
                  <div className="text-sm text-gray-500">Overall Conversion</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{segment.visitors.toLocaleString()}</div>
                  <div className="text-gray-500">Visitors</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">{segment.leads}</div>
                  <div className="text-gray-500">{leadConversionRate}% Leads</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{segment.qualified}</div>
                  <div className="text-gray-500">{qualificationRate}% Qualified</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">{segment.customers}</div>
                  <div className="text-gray-500">{closeRate}% Closed</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    backgroundColor: segment.color,
                    width: `${Math.max(2, parseFloat(conversionRate))}%` 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AnalyticsConversion: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<FunnelStage | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  const handleStageClick = (stage: FunnelStage) => {
    setSelectedStage(stage);
  };

  const conversionTrendData = mockTimeSeriesData.map(item => ({
    name: item.name,
    'Visitor to Lead': (item.leads / item.visitors * 100),
    'Lead to Qualified': (item.qualified / item.leads * 100),
    'Qualified to Customer': (item.customers / item.qualified * 100)
  }));

  const funnelEfficiencyScore = useMemo(() => {
    const stages = mockFunnelData;
    let totalEfficiency = 0;
    let validStages = 0;

    for (let i = 1; i < stages.length; i++) {
      if (stages[i-1].count > 0) {
        const stageConversion = stages[i].count / stages[i-1].count;
        totalEfficiency += stageConversion;
        validStages++;
      }
    }

    return validStages > 0 ? (totalEfficiency / validStages * 100).toFixed(1) : '0';
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conversion Analytics</h1>
          <p className="text-gray-600">Track your sales funnel performance and conversion rates</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Traffic</option>
            <option value="organic">Organic Search</option>
            <option value="direct">Direct Traffic</option>
            <option value="social">Social Media</option>
            <option value="referral">Referrals</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <ConversionMetrics stages={mockFunnelData} />

      {/* Funnel Efficiency Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Funnel Efficiency Score</h3>
            <p className="text-gray-600">Average conversion rate across all funnel stages</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{funnelEfficiencyScore}%</div>
            <div className="text-sm text-gray-500">
              {parseFloat(funnelEfficiencyScore) > 35 ? 'Excellent' : 
               parseFloat(funnelEfficiencyScore) > 25 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Funnel */}
        <div className="lg:col-span-1">
          <FunnelVisualization 
            stages={mockFunnelData}
            onStageClick={handleStageClick}
          />
        </div>

        {/* Stage Details */}
        <div className="lg:col-span-1">
          {selectedStage ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedStage.name} Details
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedStage.count.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Count</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedStage.conversionRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>

                {selectedStage.value > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${selectedStage.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Pipeline Value</div>
                  </div>
                )}

                {selectedStage.avgTimeToNext > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedStage.avgTimeToNext}h
                    </div>
                    <div className="text-sm text-gray-600">Average Time to Next Stage</div>
                  </div>
                )}

                {selectedStage.dropOffReasons && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Top Drop-off Reasons:</h4>
                    <ul className="space-y-1">
                      {selectedStage.dropOffReasons.map((reason, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="text-center text-gray-500">
                <FunnelIcon className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Funnel Stage</h3>
                <p>Click on any stage in the funnel to see detailed analytics</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conversion Trends Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate Trends</h3>
        <Chart
          data={conversionTrendData}
          type="line"
          xKey="name"
          yKey="Visitor to Lead"
          secondaryYKey="Lead to Qualified"
          color="#3B82F6"
          secondaryColor="#10B981"
          height={300}
        />
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Visitor to Lead</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Lead to Qualified</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Qualified to Customer</span>
          </div>
        </div>
      </div>

      {/* Segment Analysis */}
      <SegmentAnalysis segments={mockSegmentData} />

      {/* Optimization Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-800">Improve Lead Quality</span>
            </div>
            <p className="text-sm text-blue-700">
              Only 40% of inquiries become qualified leads. Consider adding qualification questions to your forms.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ClockIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-800">Faster Follow-up</span>
            </div>
            <p className="text-sm text-green-700">
              Reduce response time from 24h to 4h to improve qualification rates by ~15%.
            </p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CurrencyDollarIcon className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-semibold text-orange-800">Price Strategy</span>
            </div>
            <p className="text-sm text-orange-700">
              56% of proposals are lost due to pricing. Consider value-based pricing strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};