'use client';

import { useState } from 'react';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedClose: string;
  contact: string;
  company: string;
  tags: string[];
  assignedTo: string;
  createdAt: string;
  lastActivity: string;
}

const SalesPipeline = () => {
  // Sales pipeline stages
  const stages = [
    { id: 'lead', name: 'Lead Generation', color: 'bg-slate-500', value: 0 },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-500', value: 0 },
    { id: 'proposal', name: 'Proposal', color: 'bg-purple-500', value: 0 },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-amber-500', value: 0 },
    { id: 'closed-won', name: 'Closed Won', color: 'bg-green-500', value: 0 },
    { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-500', value: 0 }
  ];

  // Mock deals data
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 'deal-1',
      title: 'E-commerce Website Redesign',
      value: 15000,
      stage: 'proposal',
      probability: 65,
      expectedClose: '2024-03-15',
      contact: 'John Smith',
      company: 'Retail Innovations Inc',
      tags: ['Web Development', 'E-commerce'],
      assignedTo: 'Sales Team A',
      createdAt: '2024-02-20',
      lastActivity: '2024-03-04'
    },
    {
      id: 'deal-2',
      title: 'Mobile App Development',
      value: 25000,
      stage: 'negotiation',
      probability: 80,
      expectedClose: '2024-03-20',
      contact: 'Sarah Johnson',
      company: 'TechStart Solutions',
      tags: ['Mobile', 'iOS', 'Android'],
      assignedTo: 'Sales Team B',
      createdAt: '2024-02-15',
      lastActivity: '2024-03-03'
    },
    {
      id: 'deal-3',
      title: 'SEO Optimization Package',
      value: 8000,
      stage: 'qualified',
      probability: 40,
      expectedClose: '2024-03-25',
      contact: 'Mike Davis',
      company: 'Growth Marketing Co',
      tags: ['SEO', 'Marketing'],
      assignedTo: 'Sales Team A',
      createdAt: '2024-02-28',
      lastActivity: '2024-03-04'
    },
    {
      id: 'deal-4',
      title: 'Custom CRM System',
      value: 35000,
      stage: 'lead',
      probability: 20,
      expectedClose: '2024-04-01',
      contact: 'Emily Chen',
      company: 'Enterprise Corp',
      tags: ['CRM', 'Custom Development'],
      assignedTo: 'Sales Team C',
      createdAt: '2024-03-01',
      lastActivity: '2024-03-02'
    },
    {
      id: 'deal-5',
      title: 'Marketing Automation Setup',
      value: 12000,
      stage: 'closed-won',
      probability: 100,
      expectedClose: '2024-02-28',
      contact: 'David Wilson',
      company: 'Digital Marketing Pro',
      tags: ['Marketing', 'Automation'],
      assignedTo: 'Sales Team A',
      createdAt: '2024-02-10',
      lastActivity: '2024-02-28'
    }
  ]);

  // Calculate pipeline values by stage
  const pipelineData = stages.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage.id);
    const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedValue = stageDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
    
    return {
      ...stage,
      totalValue,
      weightedValue,
      dealCount: stageDeals.length
    };
  });

  const getStageColor = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    return stage?.color || 'bg-slate-500';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600 bg-green-100';
    if (probability >= 60) return 'text-blue-600 bg-blue-100';
    if (probability >= 40) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedPipelineValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  return (
    <div className="space-y-8">
      {/* Sales Pipeline Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Sales Pipeline</h2>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Deal
          </button>
          <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
            Export Pipeline
          </button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Total Pipeline Value</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalPipelineValue)}</p>
          <p className="text-sm text-slate-500 mt-1">
            {deals.length} active deals
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Weighted Value</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(weightedPipelineValue)}</p>
          <p className="text-sm text-green-600 mt-1">
            {Math.round((weightedPipelineValue / totalPipelineValue) * 100)}% confidence
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Avg Deal Size</h3>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {formatCurrency(totalPipelineValue / deals.length)}
          </p>
          <p className="text-sm text-slate-500 mt-1">per deal</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Win Rate</h3>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {Math.round((deals.filter(d => d.stage === 'closed-won').length / deals.filter(d => d.stage === 'closed-won' || d.stage === 'closed-lost').length) * 100)}%
          </p>
          <p className="text-sm text-slate-500 mt-1">closing rate</p>
        </div>
      </div>

      {/* Pipeline Visual */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Pipeline Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {pipelineData.map((stage) => (
            <div key={stage.id} className="relative">
              <div className={`${stage.color} text-white p-4 rounded-lg mb-4`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{stage.name}</h4>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {stage.dealCount}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm opacity-90">{formatCurrency(stage.totalValue)}</p>
                  <p className="text-xs opacity-75">Weighted: {formatCurrency(stage.weightedValue)}</p>
                </div>
              </div>
              
              {/* Deals in this stage */}
              <div className="space-y-2">
                {deals
                  .filter(deal => deal.stage === stage.id)
                  .map((deal) => (
                    <div key={deal.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm text-slate-900 line-clamp-1">
                          {deal.title}
                        </h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${getProbabilityColor(deal.probability)}`}>
                          {deal.probability}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <p>{deal.company}</p>
                        <p>{formatCurrency(deal.value)}</p>
                        <p className="text-slate-400">Due: {deal.expectedClose}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">All Deals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Deal</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Company</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Value</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Stage</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Probability</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Expected Close</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">{deal.title}</p>
                      <p className="text-sm text-slate-500">{deal.contact}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-slate-900">{deal.company}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {deal.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{formatCurrency(deal.value)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(deal.stage)} text-white`}>
                      {stages.find(s => s.id === deal.stage)?.name}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProbabilityColor(deal.probability)}`}>
                      {deal.probability}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-slate-900">{deal.expectedClose}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-slate-900">{deal.assignedTo}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <div className="text-sm text-slate-600">
          <strong>Total Deals:</strong> {deals.length} | 
          <strong> Total Value:</strong> {formatCurrency(totalPipelineValue)}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-blue-600 hover:text-blue-700">Add Deal</button>
          <span className="text-slate-400">•</span>
          <button className="text-sm text-blue-600 hover:text-blue-700">Import Leads</button>
          <span className="text-slate-400">•</span>
          <button className="text-sm text-blue-600 hover:text-blue-700">Export Data</button>
        </div>
      </div>
    </div>
  );
};

export default SalesPipeline;