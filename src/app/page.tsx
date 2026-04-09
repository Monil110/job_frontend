import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Navigation } from '@/components/ui/Navigation';

export default function Home() {
  return (
    <main className={styles.main}>
      <Navigation />
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Beta Launch</div>
          <h1 className={styles.title}>
            The Direct Path to <br />
            <span className={styles.highlight}>Your Next Role</span>
          </h1>
          <p className={styles.subtitle}>
            Connect with employees at top tech companies. Request referrals directly. Track your status. Cut through the resume black hole.
          </p>
          
          <div className={styles.ctaGroup}>
            <Link href="/login" className={styles.primaryBtn}>
              Find Employees
            </Link>
            <Link href="/login" className={styles.secondaryBtn}>
              I'm an Employee
            </Link>
          </div>
        </div>
        
        <div className={styles.heroVisual}>
          <div className={`${styles.metricsCard} glass-panel`}>
            <div className={styles.metric}>
              <span className={styles.metricValue}>85%</span>
              <span className={styles.metricLabel}>Interview Rate</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricValue}>2.4k</span>
              <span className={styles.metricLabel}>Referrals</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricValue}>120+</span>
              <span className={styles.metricLabel}>Companies</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
