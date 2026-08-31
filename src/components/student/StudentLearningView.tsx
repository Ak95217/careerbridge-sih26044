import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, LearningResource, UserCourseEnrollment } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  ALL_LEARNING_RESOURCES, 
  searchLearningResources, 
  getCatalogueCategories,
  getRecommendedCoursesForSkill 
} from '../../services/courseRecommendations';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  Search, 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  GraduationCap, 
  TrendingUp, 
  Target, 
  Layers, 
  Check, 
  Star, 
  ArrowRight, 
  Award, 
  Compass, 
  Code, 
  Database, 
  Shield, 
  Cpu, 
  Smartphone, 
  Palette, 
  Briefcase, 
  Flame,
  CheckCircle
} from 'lucide-react';

interface StudentLearningViewProps {
  onNavigateTab: (tabId: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'AI / Machine Learning': <Cpu className="w-3.5 h-3.5" />,
  'Data Science & Analytics': <TrendingUp className="w-3.5 h-3.5" />,
  'Python & Programming': <Code className="w-3.5 h-3.5" />,
  'Web Development & Full Stack': <Layers className="w-3.5 h-3.5" />,
  'Java & Backend Engineering': <Code className="w-3.5 h-3.5" />,
  'DSA & Algorithms': <Target className="w-3.5 h-3.5" />,
  'Cloud & DevOps': <Flame className="w-3.5 h-3.5" />,
  'Cybersecurity / Ethical Hacking': <Shield className="w-3.5 h-3.5" />,
  'SQL / Databases': <Database className="w-3.5 h-3.5" />,
  'Mobile App Development': <Smartphone className="w-3.5 h-3.5" />,
  'UI/UX Design': <Palette className="w-3.5 h-3.5" />,
  'Business / Product Management': <Briefcase className="w-3.5 h-3.5" />,
  'Digital Marketing / SEO': <Compass className="w-3.5 h-3.5" />,
  'Soft Skills / Career Development': <GraduationCap className="w-3.5 h-3.5" />
};

export const StudentLearningView: React.FC<StudentLearningViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const student = user as StudentProfile;

  // Active Main Tab: 'catalog' | 'enrolled' | 'bookmarked'
  const [activeViewTab, setActiveViewTab] = useState<'catalog' | 'enrolled' | 'bookmarked'>('catalog');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [freeOnly, setFreeOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Enrollment & Bookmark storage state
  const [enrollments, setEnrollments] = useState<UserCourseEnrollment[]>(() => 
    StorageService.getCourseEnrollments(student?.id)
  );
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => 
    StorageService.getBookmarkedCourseIds(student?.id)
  );

  // Categories list
  const categories = useMemo(() => ['All', ...getCatalogueCategories()], []);

  // Filtered Catalogue
  const filteredCourses = useMemo(() => {
    return searchLearningResources({
      query: searchQuery,
      category: selectedCategory,
      level: selectedLevel,
      freeOnly: freeOnly
    });
  }, [searchQuery, selectedCategory, selectedLevel, freeOnly]);

  // Pagination for catalog
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage]);

  // Enrolled courses map & objects
  const enrolledCourseIds = useMemo(() => new Set(enrollments.map(e => e.courseId)), [enrollments]);
  const enrolledCourseObjects = useMemo(() => {
    return enrollments.map(enr => {
      const course = ALL_LEARNING_RESOURCES.find(c => c.id === enr.courseId);
      return { enrollment: enr, course };
    });
  }, [enrollments]);

  // Bookmarked courses list
  const bookmarkedCourses = useMemo(() => {
    return ALL_LEARNING_RESOURCES.filter(c => bookmarkedIds.includes(c.id));
  }, [bookmarkedIds]);

  // Student Career Recommended Courses
  const recommendedCourses = useMemo(() => {
    // If student has career interest or target roles, recommend top matching
    const careerInterest = student?.preferredRole || student?.careerDomain || 'Software Engineer';
    const targetRoles = [careerInterest, 'Full Stack Developer', 'AI/ML Engineer', 'Cloud DevOps'];
    
    // Find courses matching career role or addressing high demand domains
    return ALL_LEARNING_RESOURCES.filter(c => {
      const matchesRole = c.career_roles.some(r => targetRoles.some(tr => tr.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(tr.toLowerCase())));
      return matchesRole;
    }).slice(0, 4);
  }, [student]);

  // Handlers
  const handleToggleBookmark = (courseId: string) => {
    if (!student?.id) return;
    const isNowBookmarked = StorageService.toggleBookmarkCourse(student.id, courseId);
    setBookmarkedIds(prev => 
      isNowBookmarked ? [...prev, courseId] : prev.filter(id => id !== courseId)
    );
  };

  const handleEnroll = (course: LearningResource) => {
    if (!student?.id) return;
    const newEnr = StorageService.enrollInCourse({
      studentId: student.id,
      courseId: course.id,
      courseTitle: course.title,
      platform: course.platform,
      status: 'In Progress',
      progressPercent: 10
    });
    setEnrollments(StorageService.getCourseEnrollments(student.id));
  };

  const handleUpdateProgress = (enrollmentId: string, newPercent: number, status?: 'Not Started' | 'In Progress' | 'Completed') => {
    StorageService.updateCourseProgress(enrollmentId, newPercent, status);
    setEnrollments(StorageService.getCourseEnrollments(student?.id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Curated Learning Resource Catalogue</h2>
                <Badge variant="primary" size="sm">500+ Verified Courses</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                NPTEL, Swayam, Google, Microsoft, AWS, Harvard CS50, Stanford, DeepLearning.AI & freeCodeCamp
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigateTab('gap-engine')}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
          >
            Bridge Missing Skill Gaps
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigateTab('internships')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore 100+ Matched Companies
          </Button>
        </div>
      </div>

      {/* How to Close Your Skill Gap Pathway Card */}
      <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/40">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
              How SkillBridge AI Closes Your Skill Gap to Unlock Opportunities
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px]">1</span>
                <span>Analyze Gaps</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Identify missing prerequisites for top MNCs & Tier-1 roles via the deterministic Skill Gap Engine.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 text-purple-600 font-bold">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[11px]">2</span>
                <span>Enroll & Study</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Study top-rated free & certified modules from verified universities and industry accreditation leaders.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-600 font-bold">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[11px]">3</span>
                <span>Verify Skill</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Take standardized timed skill assessments on SkillBridge to earn tamper-proof verified credentials.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px]">4</span>
                <span>Land Placement</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Instantly boost your match score to 90%+ for 100+ enterprise internship & placement opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Career Recommendations Section */}
      {recommendedCourses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Recommended For Your Career Goal ({student?.preferredRole || student?.careerDomain || 'Software Engineer'})
              </h3>
            </div>
            <span className="text-xs text-slate-500">High hiring relevance</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCourses.map((c) => {
              const isEnrolled = enrolledCourseIds.has(c.id);
              const isBookmarked = bookmarkedIds.includes(c.id);

              return (
                <div 
                  key={c.id} 
                  className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 p-4 flex flex-col justify-between transition-all hover:shadow-sm group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded truncate max-w-[170px]">
                        {c.platform}
                      </span>
                      <button 
                        onClick={() => handleToggleBookmark(c.id)}
                        className="text-slate-400 hover:text-amber-500 transition-colors p-1"
                        title="Bookmark course"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {c.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.skills.slice(0, 2).map((sk) => (
                        <span key={sk} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{c.duration}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {c.course_url ? (
                        <a 
                          href={c.course_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-slate-200 transition-colors"
                          title="Open official course website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : null}

                      {isEnrolled ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                          Enrolled
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEnroll(c)}
                          className="text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded transition-colors"
                        >
                          Enroll
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Tabs & Filter Bar */}
      <div className="space-y-4">
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveViewTab('catalog'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViewTab === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>All Curated Resources ({filteredCourses.length})</span>
            </button>

            <button
              onClick={() => setActiveViewTab('enrolled')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViewTab === 'enrolled'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>My Enrolled Trackers ({enrollments.length})</span>
            </button>

            <button
              onClick={() => setActiveViewTab('bookmarked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeViewTab === 'bookmarked'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Courses ({bookmarkedCourses.length})</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Total Catalogue: <strong className="text-slate-800">{ALL_LEARNING_RESOURCES.length}</strong> resources
          </span>
        </div>

        {/* Filter Controls (for Catalog Tab) */}
        {activeViewTab === 'catalog' && (
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by skill, topic, or keyword..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-700"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories (14 Pathways)' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Dropdown */}
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-700"
                >
                  <option value="All">All Difficulty Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Free Only Toggle */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-medium text-slate-700">Free / Audit Only</span>
                <input
                  type="checkbox"
                  checked={freeOnly}
                  onChange={(e) => { setFreeOnly(e.target.checked); setCurrentPage(1); }}
                  className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categories.slice(0, 8).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-all flex items-center gap-1 ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {CATEGORY_ICONS[cat] || <BookOpen className="w-3 h-3" />}
                  <span>{cat === 'All' ? 'All Domains' : cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VIEW TAB 1: ALL CURATED CATALOGUE */}
      {activeViewTab === 'catalog' && (
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">No courses match your active search filters</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Try clearing your search keyword or switching the category filter to explore other engineering domains.
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                  setFreeOnly(false);
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedCourses.map((course) => {
                  const isEnrolled = enrolledCourseIds.has(course.id);
                  const isBookmarked = bookmarkedIds.includes(course.id);

                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 flex flex-col justify-between transition-all hover:shadow-xs group"
                    >
                      <div className="space-y-3">
                        {/* Header Tags */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md truncate max-w-[200px]">
                            {course.platform}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              course.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                              course.level === 'Intermediate' ? 'bg-indigo-50 text-indigo-700' :
                              'bg-purple-50 text-purple-700'
                            }`}>
                              {course.level}
                            </span>
                            <button
                              onClick={() => handleToggleBookmark(course.id)}
                              className="text-slate-400 hover:text-amber-500 transition-colors p-1"
                              title="Bookmark course"
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Title & Badge */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                            {course.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        {/* Skills Chips */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Skills Taught:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {course.skills.slice(0, 4).map((sk) => (
                              <span key={sk} className="text-[10px] bg-slate-50 text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded">
                                {sk}
                              </span>
                            ))}
                            {course.skills.length > 4 && (
                              <span className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded">
                                +{course.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Career Roles targeted */}
                        {course.career_roles && course.career_roles.length > 0 && (
                          <div className="text-[10px] text-slate-600 bg-slate-50/80 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">
                              <strong>Career Track:</strong> {course.career_roles.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer Info & Actions */}
                      <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{course.duration}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {course.rating && (
                              <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span>{course.rating}</span>
                              </div>
                            )}
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {course.free_or_paid}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          {course.course_url ? (
                            <a
                              href={course.course_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              <span>Official Course Page</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Self-Study Curriculum</span>
                          )}

                          {isEnrolled ? (
                            <button
                              onClick={() => setActiveViewTab('enrolled')}
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Enrolled</span>
                            </button>
                          ) : (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleEnroll(course)}
                              leftIcon={<PlayCircle className="w-3.5 h-3.5" />}
                            >
                              Track / Enroll
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200/80 text-xs">
                  <span className="text-slate-500">
                    Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filteredCourses.length)}</strong> of <strong>{filteredCourses.length}</strong> resources
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Previous
                    </button>

                    <span className="px-2 font-bold text-slate-700">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* VIEW TAB 2: MY ENROLLED TRACKERS */}
      {activeViewTab === 'enrolled' && (
        <div className="space-y-4">
          {enrolledCourseObjects.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">You haven't enrolled in any courses yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Browse the 500+ curated catalogue to track your active learning progress toward your target internship and placement goals.
                </p>
              </div>
              <Button 
                size="sm" 
                variant="primary"
                onClick={() => setActiveViewTab('catalog')}
              >
                Browse Curated Catalogue
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledCourseObjects.map(({ enrollment, course }) => {
                if (!course) return null;

                return (
                  <Card key={enrollment.id} className="border-slate-200">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                              {course.platform}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              enrollment.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {enrollment.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {course.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {course.course_url && (
                            <a
                              href={course.course_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors"
                            >
                              <span>Launch Course</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar and Slider */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700">Course Completion Progress</span>
                          <span className="font-bold text-indigo-600">{enrollment.progressPercent}%</span>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              enrollment.progressPercent >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${enrollment.progressPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-slate-500">
                            Update your study milestone:
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateProgress(enrollment.id, Math.max(0, enrollment.progressPercent - 25))}
                              className="px-2 py-0.5 rounded text-xs bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700"
                            >
                              -25%
                            </button>
                            <button
                              onClick={() => handleUpdateProgress(enrollment.id, Math.min(100, enrollment.progressPercent + 25))}
                              className="px-2 py-0.5 rounded text-xs bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700"
                            >
                              +25%
                            </button>
                            <button
                              onClick={() => handleUpdateProgress(enrollment.id, 100, 'Completed')}
                              className="px-2.5 py-0.5 rounded text-xs bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-2xs"
                            >
                              Mark Completed
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW TAB 3: BOOKMARKED COURSES */}
      {activeViewTab === 'bookmarked' && (
        <div className="space-y-4">
          {bookmarkedCourses.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">No saved courses yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Click the bookmark icon on any course card in the catalogue to save resources you want to study later.
                </p>
              </div>
              <Button 
                size="sm" 
                variant="primary"
                onClick={() => setActiveViewTab('catalog')}
              >
                Browse Curated Catalogue
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {course.platform}
                      </span>
                      <button
                        onClick={() => handleToggleBookmark(course.id)}
                        className="text-amber-500 p-1"
                        title="Remove bookmark"
                      >
                        <BookmarkCheck className="w-4 h-4 fill-amber-500" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {course.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {course.duration}
                    </span>

                    {course.course_url && (
                      <a
                        href={course.course_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <span>Start</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
