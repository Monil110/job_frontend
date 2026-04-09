'use client';

import React from 'react';
import styles from './EmployeeCard.module.css';
import { Employee } from '@/lib/mockData';
import { Building2, Briefcase, Star, Send } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onRequestClick: (employeeId: string) => void;
  isPrivacyMode?: boolean;
}

export function EmployeeCard({ employee, onRequestClick, isPrivacyMode = true }: EmployeeCardProps) {
  // If privacy mode is on, we blur/hide identifiers
  const displayName = isPrivacyMode ? "Anonymous Employee" : employee.name;
  
  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          {isPrivacyMode ? (
            <div className={styles.avatarPlaceholder} />
          ) : (
            <img src={employee.avatarUrl} alt={employee.name} className={styles.avatar} />
          )}
        </div>
        <div className={styles.headerInfo}>
          <h3 className={styles.name}>{displayName}</h3>
          <div className={styles.companyRow}>
            <Building2 size={14} className={styles.icon} />
            <span className={styles.company}>{employee.company}</span>
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <Briefcase size={16} />
          <span>{employee.jobRole} • {employee.experience} yrs exp</span>
        </div>
        <div className={styles.detailItem}>
          <Star size={16} />
          <span>Acceptance Rate: {employee.stats.acceptanceRate}% ({employee.stats.referralsMade} Referrals)</span>
        </div>
      </div>

      <div className={styles.skills}>
        {employee.skills.map(skill => (
          <span key={skill} className={styles.skillTag}>{skill}</span>
        ))}
      </div>

      <button 
        className={styles.requestButton}
        onClick={() => onRequestClick(employee.id)}
        disabled={!employee.openToReferrals}
      >
        <Send size={16} />
        {employee.openToReferrals ? "Request Referral" : "Not Accepting Requests"}
      </button>
    </div>
  );
}
