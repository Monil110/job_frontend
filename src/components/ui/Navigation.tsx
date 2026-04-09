'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';
import { Home, Compass, MessageSquare, User, Settings, LogOut, Bell, Award } from 'lucide-react';

// For MVP, we pass the current role as prop.
interface NavigationProps {
  role?: 'candidate' | 'employee' | 'pending' | null;
  reputation?: number;
}

export function Navigation({ role, reputation = 50 }: NavigationProps) {
  const pathname = usePathname();

  const getLinks = () => {
    const baseLinks = [
      { href: `/dashboard?role=${role}`, label: 'Dashboard', icon: <Home size={20} /> },
    ];

    if (role === 'candidate') {
      baseLinks.push({ href: `/search?role=${role}`, label: 'Discover', icon: <Compass size={20} /> });
    }

    baseLinks.push(
      { href: `/requests?role=${role}`, label: 'Requests', icon: <MessageSquare size={20} /> },
      { href: `/profile?role=${role}`, label: 'Profile', icon: <User size={20} /> },
      { href: `/settings?role=${role}`, label: 'Settings', icon: <Settings size={20} /> }
    );

    return baseLinks;
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className={`${styles.navbar} glass-panel`}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            Referral<span>Platform</span>
          </Link>
          <div className={styles.topActions}>
            {role ? (
              <div className={styles.userControls}>
                <div className={styles.reputationBadge}>
                  <Award size={16} />
                  <span>{reputation}</span>
                </div>
                <Link href={`/notifications?role=${role}`} className={styles.notifBtn}>
                  <Bell size={20} />
                  <span className={styles.notifBadge} />
                </Link>
                <Link href={`/profile?role=${role}`} className={styles.profileBtn}>
                  <div className={styles.avatarMini} />
                </Link>
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar - only show if logged in and not on boarding/login */}
      {role && !['/login', '/onboarding', '/'].includes(pathname) && (
        <aside className={`${styles.sidebar} glass-panel`}>
          <div className={styles.sidebarMenu}>
            {getLinks().map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`${styles.menuItem} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
          <div className={styles.sidebarFooter}>
            <Link href="/" className={styles.logoutBtn}>
              <LogOut size={20} />
              <span>Log Out</span>
            </Link>
          </div>
        </aside>
      )}
    </>
  );
}
