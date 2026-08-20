'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Filter, Phone, Mail, Clock, Calendar, CheckCircle2, MessageSquare, 
  ArrowRight, Search, Plus, UserCheck, AlertCircle, FileText, ChevronRight, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCRMPage() {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [newNote, setNewNote] = useState('');

  const [leads, setLeads] = useState([
    {
      id: 'lead_1',
      name: 'Marc Dubois',
      email: 'marc.dubois@exemple.fr',
      phone: '06 12 34 56 78',
      leadType: 'Owner Enquiry',
      status: 'NEW',
      propertyAddress: '15 Rue Notre-Dame, 33000 Bordeaux',
      budget: '2 200 € / mo',
      surface: '85 m²',
      source: 'Online Valuation Form',
      createdAt: '2026-08-19 11:20',
      assignedTo: 'Alexandre',
      notes: [{ author: 'Alexandre', text: 'Owner requested 48h valuation report.', date: '11:30' }]
    },
    {
      id: 'lead_2',
      name: 'Claire Fontaine',
      email: 'claire.fontaine@domaine.fr',
      phone: '06 98 76 54 32',
      leadType: 'Tenant Request',
      status: 'CONTACTED',
      subject: 'Recherche T3 Chartrons',
      message: 'Looking for furnished 2-bed apartment.',
      budget: '2 000 € / mo',
      source: 'Property Page',
      createdAt: '2026-08-18 15:45',
      assignedTo: 'Valérie Morel',
      notes: [{ author: 'Valérie', text: 'Sent 2 matching Chartrons properties.', date: '16:00' }]
    },
    {
      id: 'lead_3',
      name: 'Henri Lemaire',
      email: 'h.lemaire@exemple.fr',
      phone: '06 55 44 33 22',
      leadType: 'Valuation Request',
      status: 'QUALIFIED',
      propertyAddress: '38 Cours de l\'Intendance',
      budget: 'Est. 950 000 €',
      source: 'Valuation Calculator',
      createdAt: '2026-08-17 09:15',
      assignedTo: 'Alexandre',
      notes: []
    },
    {
      id: 'lead_4',
      name: 'Sophie Bernard',
      email: 'sophie.b@exemple.fr',
      phone: '06 77 88 99 00',
      leadType: 'Seller Request',
      status: 'APPOINTMENT',
      propertyAddress: '12 Avenue Bel Air',
      budget: '890 000 €',
      source: 'Contact Form',
      createdAt: '2026-08-16 14:00',
      assignedTo: 'Alexandre',
      notes: [{ author: 'Alexandre', text: 'Meeting scheduled at property on Aug 22.', date: 'Aug 17' }]
    }
  ]);

  const stages = [
    { id: 'NEW', title: 'New Enquiries', color: 'bg-[#748C8C]' },
    { id: 'CONTACTED', title: 'Contacted', color: 'bg-amber-600' },
    { id: 'QUALIFIED', title: 'Qualified', color: 'bg-blue-600' },
    { id: 'APPOINTMENT', title: 'Appointment', color: 'bg-purple-600' },
    { id: 'CONVERTED', title: 'Converted', color: 'bg-emerald-600' },
    { id: 'LOST', title: 'Closed / Lost', color: 'bg-gray-400' }
  ];

  const handleStatusChange = (leadId: string, newStatus: string) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus as any } : l));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;

    const noteObj = {
      author: 'Admin',
      text: newNote.trim(),
      date: 'Just now'
    };

    const updated = leads.map(l => {
      if (l.id === selectedLead.id) {
        return { ...l, notes: [...l.notes, noteObj] };
      }
      return l;
    });

    setLeads(updated);
    setSelectedLead({ ...selectedLead, notes: [...selectedLead.notes, noteObj] });
    setNewNote('');
  };

  const filteredLeads = leads.filter(l => {
    if (filterType === 'ALL') return true;
    return l.leadType.toUpperCase().includes(filterType);
  });

  return (
    <div className="space-y-8">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C]">
            GOIZET GESTION CRM PIPELINE
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Lead Management & Sales Funnel
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Leads' },
            { id: 'OWNER', label: 'Owners' },
            { id: 'TENANT', label: 'Tenants' },
            { id: 'VALUATION', label: 'Valuations' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === f.id ? 'bg-brand-gradient text-white shadow-brand' : 'bg-white border text-[#6B6B6B] hover:text-[#171717]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.status === stage.id);
          return (
            <div key={stage.id} className="bg-[#F7F7F5] p-3 rounded-2xl border border-[#171717]/10 space-y-3 min-w-[220px]">
              
              {/* Stage Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">{stage.title}</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white text-[#171717] px-2 py-0.5 rounded-full border">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards in Stage */}
              <div className="space-y-3">
                {stageLeads.map(lead => (
                  <motion.div
                    key={lead.id}
                    layout
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white p-4 rounded-xl border border-[#171717]/10 shadow-xs hover:shadow-md cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-xs text-[#171717]">{lead.name}</span>
                      <span className="text-[9px] font-bold uppercase text-[#748C8C] bg-[#748C8C]/10 px-1.5 py-0.5 rounded">
                        {lead.leadType}
                      </span>
                    </div>

                    {lead.propertyAddress && (
                      <p className="text-[11px] text-[#6B6B6B] truncate">{lead.propertyAddress}</p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-[#6B6B6B] pt-2 border-t border-[#171717]/5">
                      <span>{lead.phone}</span>
                      <span>{lead.createdAt.split(' ')[0]}</span>
                    </div>

                    {/* Quick Move Select */}
                    <select
                      value={lead.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="w-full text-[10px] font-semibold bg-[#F7F7F5] border border-[#171717]/10 rounded-md p-1 mt-1 focus:outline-none"
                    >
                      {stages.map(s => (
                        <option key={s.id} value={s.id}>Move to: {s.title}</option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white text-[#171717] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#171717]/10 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedLead(null)}
                className="absolute top-5 right-5 text-[#6B6B6B] hover:text-[#171717] p-1.5 rounded-full hover:bg-[#F7F7F5]"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Lead Top Header */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#748C8C] bg-[#748C8C]/10 px-2.5 py-0.5 rounded-full">
                    {selectedLead.leadType}
                  </span>
                  <span className="text-xs text-[#6B6B6B]">Source: {selectedLead.source}</span>
                </div>
                <h2 className="font-serif-display text-3xl font-medium">{selectedLead.name}</h2>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[#F7F7F5] rounded-2xl border border-[#171717]/10 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#6B6B6B] block">Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-semibold text-[#748C8C] hover:underline truncate block">
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#6B6B6B] block">Phone</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-semibold text-[#171717] hover:underline block">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#6B6B6B] block">Assigned Agent</span>
                  <span className="font-semibold text-[#171717]">{selectedLead.assignedTo || 'Unassigned'}</span>
                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="space-y-4">
                <h3 className="font-serif-display text-xl font-medium">Internal Notes & History</h3>

                <div className="space-y-2 text-xs">
                  {selectedLead.notes.map((n: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#F7F7F5] rounded-xl border border-[#171717]/5 space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>{n.author}</span>
                        <span className="text-[10px] text-[#6B6B6B]">{n.date}</span>
                      </div>
                      <p className="text-[#6B6B6B]">{n.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add internal CRM note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl text-xs focus:outline-none focus:border-[#748C8C]"
                  />
                  <button
                    type="submit"
                    className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-brand transition-colors"
                  >
                    Add Note
                  </button>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
