'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, Users, Home, TrendingUp, Key, Tag, Calculator, PhoneCall, Plus, 
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, Sparkles, Filter, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | '12m'>('30d');

  const kpis = [
    { title: 'Total Properties', value: '128', change: '+12 this month', icon: Building, trend: 'up' },
    { title: 'Active Rentals', value: '42', change: '85% occupancy', icon: Key, trend: 'neutral' },
    { title: 'Active Sales', value: '31', change: 'Avg €5.2k/m²', icon: Tag, trend: 'up' },
    { title: 'New Leads', value: '86', change: '+18% vs last month', icon: Users, trend: 'up' },
    { title: 'Owner Enquiries', value: '24', change: 'High intent', icon: Calculator, trend: 'up' },
    { title: 'Tenant Requests', value: '39', change: '12 scheduled', icon: Home, trend: 'neutral' },
    { title: 'Valuation Requests', value: '17', change: '48h SLA', icon: TrendingUp, trend: 'up' },
    { title: 'Callback Requests', value: '14', change: '2 pending', icon: PhoneCall, trend: 'warning' }
  ];

  const recentActivities = [
    { user: 'Sarah Martin', action: 'submitted a tenant rental request for Chartrons T3', time: '10 mins ago', type: 'lead' },
    { user: 'Jean Dupont', action: 'requested a property valuation for 15 Rue Notre-Dame', time: '25 mins ago', type: 'valuation' },
    { user: 'Alexandre', action: 'published new property listing MM-33001', time: '1 hour ago', type: 'property' },
    { user: 'Valérie Morel', action: 'updated lead status to QUALIFIED for Claire Fontaine', time: '2 hours ago', type: 'crm' },
    { user: 'System', action: 'published blog article "Encadrement des loyers à Bordeaux"', time: '3 hours ago', type: 'blog' }
  ];

  const tasks = [
    { title: 'Call Marc Dubois regarding valuation report', due: 'Today, 16:00', priority: 'High', assigned: 'Alexandre' },
    { title: 'Schedule viewing for Claire Fontaine (Chartrons T3)', due: 'Tomorrow, 11:00', priority: 'Medium', assigned: 'Valérie' },
    { title: 'Review owner submission for Caudéran Échoppe', due: 'Aug 21', priority: 'Low', assigned: 'Alexandre' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            GOIZET GESTION SAAS OS
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Real Estate Operations Overview
          </h1>
        </div>

        {/* Quick Actions & Filter */}
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1 bg-white p-1 rounded-xl border border-[#171717]/10 text-xs font-semibold">
            {(['7d', '30d', '90d', '12m'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeFilter === period ? 'bg-brand-gradient text-white shadow-brand' : 'text-[#6B6B6B] hover:text-[#171717]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <Link
            href="/admin/properties/new"
            className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-brand flex items-center space-x-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white p-5 rounded-2xl border border-[#171717]/10 shadow-xs space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">{kpi.title}</span>
                <div className="w-8 h-8 rounded-lg bg-[#748C8C]/10 text-[#748C8C] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="font-serif-display text-3xl font-bold text-[#171717]">{kpi.value}</span>
                <span className={`text-[10px] font-semibold ${
                  kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'warning' ? 'text-amber-600' : 'text-[#6B6B6B]'
                }`}>
                  {kpi.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Charts & Pipeline Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Lead Generation Performance Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#171717]/10 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-xl font-medium text-[#171717]">Leads & Enquiries Over Time</h2>
              <p className="text-xs text-[#6B6B6B]">Performance trend across all owner and tenant conversion touchpoints.</p>
            </div>
            <span className="text-xs font-mono bg-[#F7F7F5] px-2.5 py-1 rounded-md border text-[#171717]">
              +18% Growth
            </span>
          </div>

          {/* Simulated High-Precision Metric Bar Visual */}
          <div className="h-48 flex items-end justify-between gap-3 pt-4 border-b border-[#171717]/10 px-4">
            {[45, 60, 52, 78, 85, 92, 110, 95, 120, 108, 128, 142].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-[#171717] group-hover:bg-[#748C8C] rounded-t-lg transition-all duration-300 relative"
                  style={{ height: `${(val / 150) * 100}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#171717] text-white text-[10px] px-1.5 py-0.5 rounded font-mono transition-opacity whitespace-nowrap">
                    {val} leads
                  </span>
                </div>
                <span className="text-[9px] text-[#6B6B6B] font-mono">W{idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-xs pt-2">
            <div>
              <span className="text-[10px] text-[#6B6B6B] uppercase block">Owner Enquiries</span>
              <span className="font-semibold text-[#171717]">24 (28%)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B6B6B] uppercase block">Tenant Requests</span>
              <span className="font-semibold text-[#171717]">39 (45%)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B6B6B] uppercase block">Valuations</span>
              <span className="font-semibold text-[#171717]">23 (27%)</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions & Lead Source Breakdowns */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-[#171717]/10 shadow-xs space-y-4">
            <h2 className="font-serif-display text-xl font-medium text-[#171717]">Quick SaaS Actions</h2>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link href="/admin/properties/new" className="p-3 bg-[#F7F7F5] hover:bg-[#748C8C] hover:text-white rounded-xl transition-colors text-center block">
                + Property
              </Link>
              <Link href="/admin/blog/new" className="p-3 bg-[#F7F7F5] hover:bg-[#748C8C] hover:text-white rounded-xl transition-colors text-center block">
                + Blog Article
              </Link>
              <Link href="/admin/owners" className="p-3 bg-[#F7F7F5] hover:bg-[#748C8C] hover:text-white rounded-xl transition-colors text-center block">
                + Owner CRM
              </Link>
              <Link href="/admin/cms/homepage" className="p-3 bg-[#F7F7F5] hover:bg-[#748C8C] hover:text-white rounded-xl transition-colors text-center block">
                CMS Editor
              </Link>
            </div>
          </div>

          {/* Pending Tasks Panel */}
          <div className="bg-white p-6 rounded-3xl border border-[#171717]/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-display text-lg font-medium text-[#171717]">Follow-up Tasks</h2>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                {tasks.length} Pending
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {tasks.map((t, idx) => (
                <div key={idx} className="p-3 bg-[#F7F7F5] rounded-xl border border-[#171717]/5 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-[#171717]">{t.title}</span>
                    <span className="text-[10px] font-bold text-[#748C8C]">{t.priority}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#6B6B6B]">
                    <span>Due: {t.due}</span>
                    <span>Assignee: {t.assigned}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Recent Activity Timeline Stream */}
      <div className="bg-white p-6 rounded-3xl border border-[#171717]/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-display text-xl font-medium text-[#171717]">Recent Business Activity</h2>
          <Link href="/admin/crm" className="text-xs font-semibold text-[#748C8C] hover:underline flex items-center space-x-1">
            <span>View All CRM Activities</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-[#171717]/5 text-xs">
          {recentActivities.map((act, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#748C8C]" />
                <span>
                  <strong className="text-[#171717] font-semibold">{act.user}</strong> {act.action}
                </span>
              </div>
              <span className="text-[#6B6B6B] text-[11px] font-mono whitespace-nowrap">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
