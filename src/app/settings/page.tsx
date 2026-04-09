'use client';

import React, { useState } from 'react';
import styles from './settings.module.css';
import { Navigation } from '@/components/ui/Navigation';
import { User, Bell, Shield, Lock } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [referralsOpen, setReferralsOpen] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Settings</h1>
          <p>Manage your account preferences and referral options.</p>
        </div>

        <div className={`glass-panel ${styles.settingsContainer}`}>
          <div className={styles.sidebar}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} /> General Profile
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'preferences' ? styles.active : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <Bell size={18} /> Preferences
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'privacy' ? styles.active : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <Shield size={18} /> Privacy & Security
            </button>
          </div>

          <div className={styles.content}>
            {activeTab === 'profile' && (
              <div className={styles.section}>
                <h2>Edit Profile</h2>
                <div className={styles.formGroup}>
                  <label>Display Name</label>
                  <input type="text" defaultValue="Jane Doe" />
                </div>
                <div className={styles.formGroup}>
                  <label>Current Role</label>
                  <input type="text" defaultValue="Frontend Developer" />
                </div>
                <div className={styles.formGroup}>
                  <label>Years of Experience</label>
                  <input type="number" defaultValue="3" />
                </div>
                <button className={styles.saveBtn}>Save Changes</button>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className={styles.section}>
                <h2>Referral Preferences</h2>
                
                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <label>Open to Referrals</label>
                    <p>Allow candidates to send you referral requests.</p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={referralsOpen} 
                      onChange={(e) => setReferralsOpen(e.target.checked)} 
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleInfo}>
                    <label>Email Notifications</label>
                    <p>Receive an email when you get a new request.</p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={emailNotifs} 
                      onChange={(e) => setEmailNotifs(e.target.checked)} 
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className={styles.section}>
                <h2>Privacy & Security</h2>
                <div className={styles.infoBox}>
                  <Lock size={20} className={styles.infoIcon} />
                  <div>
                    <h4>Identity Protection</h4>
                    <p>Your full name and email are hidden from candidates until you accept their referral request.</p>
                  </div>
                </div>
                <button className={styles.dangerBtn}>Delete Account</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
