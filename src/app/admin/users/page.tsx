'use client';

import React, { useState } from 'react';
import { Shield, Plus, Mail, UserCheck, CheckCircle2, Lock } from 'lucide-react';
import { getDb, AdminUser } from '@/lib/db';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 'usr_1',
      name: 'Alexandre de Saint-Clair',
      email: 'admin@maison-meridia.fr',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      active: true,
      createdAt: '2026-01-10'
    },
    {
      id: 'usr_2',
      name: 'Valérie Morel',
      email: 'v.morel@maison-meridia.fr',
      role: 'Property Manager',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      active: true,
      createdAt: '2026-02-01'
    }
  ]);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminUser['role']>('Sales Agent');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const userObj: AdminUser = {
      id: `usr_${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, userObj]);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A2234]">
            RBAC ACCESS CONTROL
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-[#171717]">
            Admin Users & Role Permissions
          </h1>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-3xl border border-[#171717]/10 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#171717]/10 font-serif-display font-medium text-lg text-[#171717]">
          Active Administrative Team ({users.length})
        </div>

        <div className="divide-y divide-[#171717]/5 text-xs">
          {users.map((u) => (
            <div key={u.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#7A2234]/10 text-[#7A2234] font-bold flex items-center justify-center">
                  {u.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-[#171717] block">{u.name}</span>
                  <span className="text-[#6B6B6B] text-[11px]">{u.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-bold text-[10px] uppercase text-[#7A2234] bg-[#7A2234]/10 px-2.5 py-1 rounded-full">
                  {u.role}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New User */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#171717]/10 shadow-xs space-y-4">
        <h2 className="font-serif-display text-xl font-medium text-[#171717]">
          Invite New Administrative User
        </h2>

        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <input
            type="text"
            required
            placeholder="Full Name (e.g. Marc Dubois)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="sm:col-span-4 px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-medium"
          />
          <input
            type="email"
            required
            placeholder="email@maison-meridia.fr"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="sm:col-span-5 px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-medium"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as any)}
            className="sm:col-span-3 px-3.5 py-2.5 bg-[#F7F7F5] border border-[#171717]/15 rounded-xl font-semibold"
          >
            <option value="Administrator">Administrator</option>
            <option value="Property Manager">Property Manager</option>
            <option value="Content Manager">Content Manager</option>
            <option value="Sales Agent">Sales Agent</option>
            <option value="Editor">Editor</option>
          </select>
          <div className="sm:col-span-12 flex justify-end">
            <button
              type="submit"
              className="bg-[#7A2234] hover:bg-[#5C1D27] text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow whitespace-nowrap"
            >
              Invite User
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
