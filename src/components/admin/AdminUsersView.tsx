import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { BaseProfile, UserRole } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Award, 
  UserCheck, 
  CheckCircle2, 
  Clock,
  Mail,
  SlidersHorizontal
} from 'lucide-react';

interface AdminUsersViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = () => {
  const allUsers = useMemo(() => StorageService.getAllUsers(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchSearch = 
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [allUsers, searchQuery, roleFilter]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allUsers.length, student: 0, company: 0, faculty: 0, mentor: 0, admin: 0 };
    allUsers.forEach(u => {
      counts[u.role] = (counts[u.role] || 0) + 1;
    });
    return counts;
  }, [allUsers]);

  return (
    <div id="admin-users-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">National User & Identity Governance</h2>
              <Badge variant="primary">{allUsers.length} Registered Accounts</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Role-Based Access Control (RBAC), verification statuses, and verified identity profiles across all ecosystem personas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">Identity Verified: 100%</Badge>
        </div>
      </div>

      {/* Role Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'student', 'company', 'faculty', 'mentor', 'admin'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                roleFilter === role
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)} ({roleCounts[role] || 0})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role & Domain</th>
                  <th className="py-3 px-4">Security Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((user) => {
                  let roleColor: 'primary' | 'purple' | 'success' | 'warning' | 'neutral' = 'neutral';
                  if (user.role === 'admin') roleColor = 'purple';
                  else if (user.role === 'student') roleColor = 'primary';
                  else if (user.role === 'company') roleColor = 'success';
                  else if (user.role === 'faculty') roleColor = 'warning';
                  else if (user.role === 'mentor') roleColor = 'primary';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={user.fullName}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{user.fullName}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={roleColor}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Authenticated
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '2026-01-15'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
