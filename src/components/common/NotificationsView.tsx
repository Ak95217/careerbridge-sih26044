import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { AppNotification } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Briefcase, 
  Award, 
  Calendar, 
  Info, 
  Trash2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface NotificationsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  const loadNotifications = () => {
    if (user?.id) {
      setNotifications(StorageService.getNotifications(user.id));
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const handleMarkAsRead = (id: string) => {
    StorageService.markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    if (user?.id) {
      StorageService.markAllNotificationsRead(user.id);
      loadNotifications();
    }
  };

  const handleDelete = (id: string) => {
    StorageService.deleteNotification(id);
    loadNotifications();
  };

  const handleClearAllRead = () => {
    if (user?.id) {
      StorageService.clearAllReadNotifications(user.id);
      loadNotifications();
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    if (!notif.read) {
      StorageService.markNotificationRead(notif.id);
      loadNotifications();
    }

    if (onNavigateTab) {
      if (notif.actionUrl) {
        onNavigateTab(notif.actionUrl);
      } else if (notif.type === 'interview' || notif.type === 'application') {
        onNavigateTab('applications');
      } else if (notif.type === 'mentor') {
        onNavigateTab('mentor');
      } else if (notif.type === 'recommendation') {
        onNavigateTab('internships');
      }
    }
  };

  const filtered = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType !== 'all') return n.type === filterType;
    return true;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'application':
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'mentor':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'system':
      case 'announcement':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  return (
    <div id="notifications-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Notification Center & Alerts</h2>
              {unreadCount > 0 ? (
                <Badge variant="primary">{unreadCount} Unread</Badge>
              ) : (
                <Badge variant="success">All Caught Up</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated application progression alerts, interview invitations, assessment results, and mentorship notes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<CheckCheck className="w-4 h-4" />}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
          {readCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
              onClick={handleClearAllRead}
            >
              Clear read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {[
          { id: 'all', label: 'All Alerts', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'application', label: 'Applications' },
          { id: 'interview', label: 'Interviews' },
          { id: 'mentor', label: 'Mentorship' },
          { id: 'recommendation', label: 'Opportunities' },
          { id: 'system', label: 'System' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterType === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Notifications</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {filterType === 'unread' ? 'You have read all your notifications.' : 'No alerts in this category.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(notif => (
            <Card 
              key={notif.id} 
              className={`transition-colors ${
                !notif.read ? 'border-indigo-200 bg-indigo-50/20' : 'bg-white'
              }`}
            >
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-100 rounded-xl mt-0.5 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                      )}
                      <Badge variant="neutral" size="sm">{notif.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                      {onNavigateTab && (
                        <button
                          onClick={() => handleActionClick(notif)}
                          className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                        >
                          View details <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!notif.read && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
