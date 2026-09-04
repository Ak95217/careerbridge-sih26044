import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { Card, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  Briefcase, 
  MapPin, 
  ExternalLink, 
  Globe,
  Filter,
  Users, 
  Layers
} from 'lucide-react';

export const AdminCompaniesView: React.FC = () => {
  const opportunities = useMemo(() => StorageService.getOpportunities(), []);
  const allCompanies = useMemo(() => StorageService.getCompanies(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  // Compute industry list
  const industries = useMemo(() => {
    const set = new Set<string>();
    allCompanies.forEach(c => set.add(c.industry));
    return ['All', ...Array.from(set)];
  }, [allCompanies]);

  // Merge with opportunity stats
  const companiesWithStats = useMemo(() => {
    const oppCountMap = new Map<string, number>();
    opportunities.forEach(opp => {
      const cId = opp.companyId || opp.company_id || '';
      const cName = opp.companyName || '';
      if (cId) {
        oppCountMap.set(cId, (oppCountMap.get(cId) || 0) + 1);
      }
      if (cName) {
        oppCountMap.set(cName, (oppCountMap.get(cName) || 0) + 1);
      }
    });

    return allCompanies.map(c => {
      const count = (oppCountMap.get(c.id) || 0) + (oppCountMap.get(c.name) || 0);
      return {
        ...c,
        openingsCount: count > 0 ? count : 1
      };
    });
  }, [allCompanies, opportunities]);

  const filteredCompanies = useMemo(() => {
    return companiesWithStats.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
      return matchesSearch && matchesIndustry;
    });
  }, [companiesWithStats, searchQuery, selectedIndustry]);

  return (
    <div id="admin-companies-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Industry Partners Directory</h2>
              <Badge variant="primary">{allCompanies.length} Verified Employers</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              AICTE-aligned corporate directory spanning Software, Product, FinTech, Semiconductors, Automotive, AI & PSU Tech organizations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">100% Industry Verified</Badge>
        </div>
      </div>

      {/* Search and Sector Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company name, sector, location, or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Sector chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-thin">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sector:
          </span>
          {industries.slice(0, 7).map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedIndustry === ind
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ind}
            </button>
          ))}
          {industries.length > 7 && (
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="text-xs py-1 px-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
            >
              <option value="All">All Sectors ({industries.length - 1})</option>
              {industries.filter(i => i !== 'All').map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Summary Stats bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-800">{filteredCompanies.length}</strong> of {allCompanies.length} corporate partners</span>
        {selectedIndustry !== 'All' && (
          <button 
            onClick={() => setSelectedIndustry('All')}
            className="text-indigo-600 hover:underline font-medium"
          >
            Clear sector filter
          </button>
        )}
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((comp) => (
          <Card key={comp.id} className="hover:border-indigo-300 transition-all flex flex-col justify-between">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/80 border border-indigo-200/60 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0 shadow-2xs">
                    {comp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{comp.name}</h3>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <Badge variant="outline" className="mt-1 text-[10px] bg-slate-50">
                      {comp.industry}
                    </Badge>
                  </div>
                </div>
                <Badge variant="success" className="shrink-0 text-[10px]">Verified</Badge>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {comp.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1 truncate max-w-[160px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{comp.headquarters}</span>
                </span>
                <span className="flex items-center gap-1 text-indigo-600 font-semibold shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                  {comp.openingsCount} Open Role{comp.openingsCount > 1 ? 's' : ''}
                </span>
              </div>

              {comp.website && (
                <div className="pt-1">
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    <span className="truncate">{comp.website.replace('https://', '').replace('www.', '')}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
