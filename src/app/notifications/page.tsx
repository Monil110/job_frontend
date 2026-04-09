'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './notifications.module.css';
import { Navigation } from '@/components/ui/Navigation';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { fetchNotifications, Notification, Role } from '@/lib/mockData';
import { Bell, CheckCircle, Search, Info, Clock, AlertCircle } from 'lucide-react';

function NotificationsContent() {
  const { role: authRole } = useAuth();
  const searchParams = useSearchParams();
  const role = authRole !== 'pending' ? authRole : (searchParams.get('role') as Role) || 'candidate';

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      // Fallback to mock if API fails during demo
      const data = await api.getNotifications().catch(() => fetchNotifications());
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    // Polling for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadNotifications(false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      // Quietly fail or show toast
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'STATUS_UPDATE': return <CheckCircle size={20} className={styles.statusIcon} />;
      case 'NEW_MATCH': return <Search size={20} className={styles.matchIcon} />;
      default: return <Info size={20} className={styles.infoIcon} />;
    }
  };

  return (
    <div className={styles.layout}>
      <Navigation role={role} />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Notifications</h1>
          <p>Stay updated on your referral progress and new matching opportunities.</p>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Syncing your notifications...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <AlertCircle size={48} />
            <p>{error}</p>
            <button onClick={() => loadNotifications()} className={styles.retryBtn}>Retry Sync</button>
          </div>
        ) : (
          <div className={styles.notifList}>
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`${styles.notifCard} ${notif.isRead ? styles.read : styles.unread} glass-panel`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className={styles.notifIconContainer}>
                  {getIcon(notif.type)}
                </div>
                <div className={styles.notifContent}>
                  <p className={styles.message}>{notif.message}</p>
                  <div className={styles.meta}>
                    <Clock size={12} />
                    <span>{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                {!notif.isRead && <div className={styles.unreadDot} />}
              </div>
            ))}
            {notifications.length === 0 && (
              <div className={styles.noNotifs}>
                <Bell size={48} />
                <p>All caught up! No new notifications.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading Notifications...</div>}>
      <NotificationsContent />
    </Suspense>
  );
}
