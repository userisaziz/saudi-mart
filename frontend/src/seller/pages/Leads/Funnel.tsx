import React from 'react';
import { SellerLayout } from '../../layout/SellerLayout';
import { Chart } from '../../components/ui/Chart';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { mockLeads, mockAnalyticsData } from '../../data/mockData';

export const LeadsFunnel: React.FC = () => {
  const funnelData = mockAnalyticsData.conversionFunnel;
  
  const leadsByStatus = mockLeads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const funnelStages = [
    {
      id: 'visitors',
      name: 'Website Visitors',
      count: funnelData[0].value,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'leads',
      name: 'Generated Leads',
      count: funnelData[1].value,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'qualified',
      name: 'Qualified Leads',
      count: funnelData[2].value,
      icon: StarIcon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'proposals',
      name: 'Proposals Sent',
      count: funnelData[3].value,
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'customers',
      name: 'Converted Customers',
      count: funnelData[4].value,
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  const calculateConversionRate = (current: number, previous: number) => {
    return ((current / previous) * 100).toFixed(1);
  };

  const getConversionTrend = (rate: number) => {
    // Mock trend data - in real app this would compare to previous period
    const mockPreviousRate = rate * (0.85 + Math.random() * 0.3); // Random previous rate
    const trend = rate - mockPreviousRate;
    return {
      value: Math.abs(trend).toFixed(1),
      isUp: trend > 0
    };
  };

  return (
    <SellerLayout currentPage="/seller/leads/funnel">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Conversion Funnel</h1>
            <p className="text-gray-600">Track your leads through the sales process</p>
          </div>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
        </div>

        {/* Funnel Visualization */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Conversion Funnel</h2>
          
          <div className="space-y-6">
            {funnelStages.map((stage, index) => {
              const nextStage = funnelStages[index + 1];
              const conversionRate = nextStage 
                ? calculateConversionRate(nextStage.count, stage.count)
                : '100.0';
              const trend = getConversionTrend(parseFloat(conversionRate));

              return (
                <div key={stage.id}>
                  <div className="flex items-center justify-between p-6 border-2 border-dashed rounded-xl transition-all hover:shadow-md"
                       style={{
                         borderColor: stage.color.replace('bg-', '').includes('blue') ? '#3B82F6' :
                                    stage.color.replace('bg-', '').includes('green') ? '#10B981' :
                                    stage.color.replace('bg-', '').includes('yellow') ? '#F59E0B' :
                                    stage.color.replace('bg-', '').includes('purple') ? '#8B5CF6' :
                                    '#10D6A3'
                       }}>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${stage.bgColor}`}>
                        <stage.icon className={`w-8 h-8 text-${stage.color.replace('bg-', '')}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
                        <p className="text-3xl font-bold text-gray-900">{stage.count.toLocaleString()}</p>
                        {index > 0 && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-600">Conversion: {conversionRate}%</span>
                            <div className={`flex items-center space-x-1 text-xs ${
                              trend.isUp ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {trend.isUp ? (
                                <ArrowTrendingUpIcon className="w-3 h-3" />
                              ) : (
                                <ArrowTrendingDownIcon className="w-3 h-3" />
                              )}
                              <span>{trend.value}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">
                        {index === 0 && 'Starting point'}
                        {index > 0 && `${((stage.count / funnelStages[0].count) * 100).toFixed(1)}% of total`}
                      </div>
                    </div>
                  </div>
                  
                  {nextStage && (
                    <div className="flex justify-center my-4">
                      <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                        <ArrowRightIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-600">
                          {conversionRate}% convert
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Rate Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Conversion Trends</h3>
            <Chart
              data={[
                { name: 'Jan', value: 4.2 },
                { name: 'Feb', value: 3.8 },
                { name: 'Mar', value: 4.5 },
                { name: 'Apr', value: 5.1 },
                { name: 'May', value: 4.8 },
                { name: 'Jun', value: 5.3 },
              ]}
              type="line"
              xKey="name"
              yKey="value"
              color="#10B981"
              height={250}
            />
          </div>

          {/* Lead Source Performance */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion by Lead Source</h3>
            <div className="space-y-4">
              {[
                { source: 'Website', leads: 45, converted: 8, rate: 17.8 },
                { source: 'Referral', leads: 32, converted: 12, rate: 37.5 },
                { source: 'LinkedIn', leads: 28, converted: 6, rate: 21.4 },
                { source: 'Cold Email', leads: 19, converted: 2, rate: 10.5 },
                { source: 'Trade Shows', leads: 15, converted: 4, rate: 26.7 },
              ].map((item) => (
                <div key={item.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.source}</div>
                    <div className="text-sm text-gray-500">
                      {item.converted}/{item.leads} leads converted
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{item.rate}%</div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Funnel Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {calculateConversionRate(funnelData[1].value, funnelData[0].value)}%
              </div>
              <div className="text-sm text-gray-600">Visitor to Lead Rate</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {calculateConversionRate(funnelData[2].value, funnelData[1].value)}%
              </div>
              <div className="text-sm text-gray-600">Lead Qualification Rate</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {calculateConversionRate(funnelData[4].value, funnelData[3].value)}%
              </div>
              <div className="text-sm text-gray-600">Proposal to Close Rate</div>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};