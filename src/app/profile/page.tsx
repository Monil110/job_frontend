'use client';

import React, { Suspense } from 'react';
import styles from './profile.module.css';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/ui/Navigation';
import { Role } from '@/lib/mockData';
import { Award, Briefcase, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

function ProfileContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as Role) || 'candidate';
  const score = parseInt(searchParams.get('score') || '85');
  const reputation = role === 'employee' ? 150 : 50;

  return (
    <div className={styles.layout}>
      <Navigation role={role} reputation={reputation} />
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
              <div className={styles.nameHeader}>
                <h2>{role === 'candidate' ? 'Jane Doe' : 'Alice Chen'}</h2>
                <div className={styles.repBadge}>
                  <Award size={18} />
                  <span>{reputation} Rep</span>
                </div>
              </div>
              <p className={styles.roleTitle}>
                {role === 'candidate' ? 'Frontend Developer • 3 Years Exp' : 'Senior Software Engineer at Google'}
              </p>
              
              <div className={styles.badges}>
                <span className={styles.badge}>
                  <ShieldCheck size={14} />
                  Verified {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
                <span className={`${styles.completenessBadge} ${score >= 50 ? styles.good : styles.bad}`}>
                  Quality Score: {score}/100
                </span>
              </div>
              
              <div className={styles.sectionDivider} />
              
              <h3>Top Skills</h3>
              <div className={styles.skills}>
                <span>React</span>
                <span>Next.js</span>
                <span>TypeScript</span>
                {role === 'employee' && <span>System Design</span>}
                {role === 'employee' && <span>GraphQL</span>}
                {role === 'candidate' && <span>Tailwind CSS</span>}
              </div>
              
              <div className={styles.sectionDivider} />
              
              <h3>{role === 'candidate' ? 'Target Companies' : 'Referral Success'}</h3>
              <div className={styles.metaInfo}>
                {role === 'candidate' ? (
                  <div className={styles.skills}>
                    <span>Google</span>
                    <span>Meta</span>
                    <span>Stripe</span>
                  </div>
                ) : (
                  <div className={styles.successStats}>
                    <div className={styles.statItem}>
                      <strong>12</strong>
                      <span>Referrals Made</span>
                    </div>
                    <div className={styles.statItem}>
                      <strong>80%</strong>
                      <span>Success Rate</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.actions}>
                <button className={styles.editBtn}>Edit Profile</button>
                <button className={styles.shareBtn}>
                  <ExternalLink size={16} />
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
