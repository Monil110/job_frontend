'use client';

import React from 'react';
import styles from './profile.module.css';
import { Navigation } from '@/components/ui/Navigation';

export default function ProfilePage() {
  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Your Profile</h1>
          <p>This is how others see you on the platform.</p>
        </div>

        <div className={styles.profileContainer}>
          <div className={`glass-panel ${styles.profileCard}`}>
            <div className={styles.coverPhoto} />
            <div className={styles.avatarWrap}>
              <div className={styles.avatarPlaceholder} />
            </div>
            
            <div className={styles.profileInfo}>
              <h2>Jane Doe</h2>
              <p className={styles.roleTitle}>Frontend Developer • 3 Years Exp</p>
              
              <div className={styles.badges}>
                <span className={styles.badge}>Top Candidate</span>
                <span className={styles.completenessBadge}>Profile 85% Complete</span>
              </div>
              
              <div className={styles.sectionDivider} />
              
              <h3>Top Skills</h3>
              <div className={styles.skills}>
                <span>React</span>
                <span>Next.js</span>
                <span>TypeScript</span>
                <span>Tailwind CSS</span>
              </div>
              
              <div className={styles.sectionDivider} />
              
              <h3>Target Companies</h3>
              <div className={styles.skills}>
                <span>Google</span>
                <span>Meta</span>
                <span>Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
