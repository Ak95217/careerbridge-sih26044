import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { CollegeRecord } from '../../data/collegesData';
import { 
  Building2, 
  Search, 
  Check, 
  ChevronDown, 
  X, 
  MapPin, 
  GraduationCap, 
  Award,
  Sparkles
} from 'lucide-react';

interface SearchableCollegeSelectProps {
  id?: string;
  value: string;
  onChange: (collegeName: string, customCollegeName?: string) => void;
  required?: boolean;
  error?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  customCollegeValue?: string;
  onCustomCollegeChange?: (customName: string) => void;
}

export const SearchableCollegeSelect: React.FC<SearchableCollegeSelectProps> = ({
  id = 'college-select-dropdown',
  value,
  onChange,
  required = false,
  error,
  label = 'College / Institute',
  placeholder = 'Search & select your college or institute...',
  helperText,
  customCollegeValue = '',
  onCustomCollegeChange
}) => {
  const colleges: CollegeRecord[] = useMemo(() => StorageService.getColleges(), []);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'JAIPUR' | 'NATIONAL'>('ALL');
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(
    value === 'OTHER' || (value !== '' && !colleges.some(c => c.name === value))
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when external value changes
  useEffect(() => {
    if (value === 'OTHER') {
      setIsOtherSelected(true);
    } else if (value && !colleges.some(c => c.name === value)) {
      setIsOtherSelected(true);
    } else if (value) {
      setIsOtherSelected(false);
    }
  }, [value, colleges]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter colleges based on search and region filter
  const filteredColleges = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return colleges.filter(college => {
      // Filter by city
      if (selectedFilter === 'JAIPUR' && college.city !== 'Jaipur') {
        return false;
      }
      if (selectedFilter === 'NATIONAL' && college.city === 'Jaipur') {
        return false;
      }
      
      // Search matching
      if (!query) return true;
      return (
        college.name.toLowerCase().includes(query) ||
        college.code.toLowerCase().includes(query) ||
        (college.city && college.city.toLowerCase().includes(query)) ||
        college.state.toLowerCase().includes(query) ||
        college.location.toLowerCase().includes(query) ||
        college.type.toLowerCase().includes(query) ||
        (college.programs && college.programs.some(p => p.toLowerCase().includes(query)))
      );
    });
  }, [colleges, searchQuery, selectedFilter]);

  const selectedRecord = useMemo(() => {
    return colleges.find(c => c.name === value);
  }, [colleges, value]);

  const handleSelectCollege = (college: CollegeRecord) => {
    setIsOtherSelected(false);
    onChange(college.name);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectOther = () => {
    setIsOtherSelected(true);
    onChange('OTHER');
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (onCustomCollegeChange) onCustomCollegeChange('');
    setIsOtherSelected(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full space-y-2" ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs font-semibold text-slate-300">
            {label} {required && <span className="text-rose-400">*</span>}
          </label>
          <span className="text-[11px] text-indigo-400 font-medium">
            {colleges.length} Verified Institutions
          </span>
        </div>
      )}

      {/* Main Select Button / Trigger */}
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }
          }}
          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${
            isOpen
              ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 text-white'
              : error
              ? 'bg-slate-900 border-rose-500 ring-1 ring-rose-500 text-white'
              : 'bg-slate-900 border-slate-700 hover:border-slate-600 text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            
            {isOtherSelected ? (
              <span className="truncate font-semibold text-amber-300 flex items-center gap-1.5">
                <span className="bg-amber-950/70 border border-amber-600/60 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">OTHER</span>
                {customCollegeValue || 'Other / Custom Institution'}
              </span>
            ) : selectedRecord ? (
              <div className="truncate text-left">
                <div className="font-semibold text-slate-100 truncate text-xs sm:text-sm">
                  {selectedRecord.name}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>{selectedRecord.city ? `${selectedRecord.city}, ${selectedRecord.state}` : selectedRecord.location}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-indigo-300">{selectedRecord.type}</span>
                </div>
              </div>
            ) : (
              <span className="text-slate-500 text-xs sm:text-sm">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {(value || isOtherSelected || customCollegeValue) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                title="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in-50 duration-150">
            {/* Search Input Header */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/90 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  id="college-search-input"
                  type="text"
                  placeholder="Type college name, code (e.g. SKIT, JECRC, LNMIIT, MNIT) or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    selectedFilter === 'ALL'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Institutions ({colleges.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('JAIPUR')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                    selectedFilter === 'JAIPUR'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-indigo-300 hover:text-indigo-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-indigo-300" />
                  Jaipur B.Tech Hub ({colleges.filter(c => c.city === 'Jaipur').length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter('NATIONAL')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    selectedFilter === 'NATIONAL'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  National / Other ({colleges.filter(c => c.city !== 'Jaipur').length})
                </button>
              </div>
            </div>

            {/* List of Colleges */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((college) => {
                  const isSelected = value === college.name;
                  const isJaipur = college.city === 'Jaipur';

                  return (
                    <button
                      key={college.id}
                      id={`college-option-${college.id}`}
                      type="button"
                      onClick={() => handleSelectCollege(college)}
                      className={`w-full text-left p-3 hover:bg-slate-800/90 transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                        isSelected ? 'bg-indigo-950/60 border-l-4 border-indigo-500' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold leading-snug ${isSelected ? 'text-indigo-300' : 'text-slate-100'}`}>
                            {college.name}
                          </span>
                          {isJaipur && (
                            <span className="text-[10px] font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 px-1.5 py-0.5 rounded">
                              Jaipur B.Tech
                            </span>
                          )}
                          <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {college.code}
                          </span>
                          {college.nirfRank && (
                            <span className="text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 px-1.5 py-0.5 rounded">
                              NIRF #{college.nirfRank}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {college.location}
                          </span>
                          <span>•</span>
                          <span className="text-slate-300 font-medium">{college.type}</span>
                        </div>

                        {college.accreditation && (
                          <div className="text-[10px] text-emerald-400/90 mt-1 flex items-center gap-1 truncate">
                            <Award className="w-3 h-3 shrink-0" />
                            <span>{college.accreditation}</span>
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div className="p-1 rounded-full bg-indigo-600 text-white shrink-0 mt-1">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-semibold text-slate-300">No matching college found</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Try searching by a different name, code or select "Other / My college is not listed" below.
                  </p>
                </div>
              )}

              {/* Other Option */}
              <button
                id="college-option-other"
                type="button"
                onClick={handleSelectOther}
                className={`w-full text-left p-3.5 hover:bg-slate-800/90 transition-colors flex items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/60 cursor-pointer ${
                  isOtherSelected ? 'bg-amber-950/40 border-l-4 border-amber-500' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-950/70 border border-amber-600/50 text-amber-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">
                      Other / My college is not listed
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Select to enter your institution's name manually
                    </span>
                  </div>
                </div>
                {isOtherSelected && (
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Input when Other is chosen */}
      {isOtherSelected && (
        <div className="pt-1.5 animate-in fade-in duration-200">
          <label className="block text-xs font-semibold text-amber-300 mb-1">
            Enter Your Institution Name <span className="text-rose-400">*</span>
          </label>
          <input
            id="custom-college-text-input"
            type="text"
            required
            placeholder="e.g. Govt. Engineering College, Ajmer / University of Rajasthan"
            value={customCollegeValue}
            onChange={(e) => onCustomCollegeChange && onCustomCollegeChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-amber-500/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Please enter your university / college full official name.
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
          <span>⚠️ {error}</span>
        </p>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
      )}
    </div>
  );
};
