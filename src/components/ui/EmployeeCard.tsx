'use client';

import React from 'react';
import styles from './EmployeeCard.module.css';
import { Employee } from '@/lib/mockData';
import { Building2, Briefcase, Star, Send, Award } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onRequestClick: (employeeId: string) => void;
  isPrivacyMode?: boolean;
}

export function EmployeeCard({ employee, onRequestClick, isPrivacyMode = false }: EmployeeCardProps) {
  // If privacy mode is on, we blur/hide identifiers
  const displayName = isPrivacyMode ? "Anonymous Employee" : employee.name;
  
  // Ensure matchScore is a number
  const matchScore = typeof employee.matchScore === 'number' 
    ? employee.matchScore 
    : (Math.random() * 20 + 75); // Mock fallback if not provided

  const getMatchLevel = (score: number) => {
    if (score >= 90) return { label: 'Highly Compatible', color: '#10b981' };
    if (score >= 80) return { label: 'Great Match', color: '#3b82f6' };
    return { label: 'Good Match', color: '#94a3b8' };
  };

  const matchLevel = getMatchLevel(matchScore);
  
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
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{displayName}</h3>
            <div className={styles.reputation} title="Reputation Score">
              <Award size={14} />
              <span>{employee.reputationScore}</span>
            </div>
          </div>
          <div className={styles.companyRow}>
            <Building2 size={14} className={styles.icon} />
            <span className={styles.company}>{employee.company}</span>
          </div>
        </div>
      </div>

      <div className={styles.details}>
        {employee.role === 'employee' && (
          <div className={styles.matchScoreRow}>
            <div className={styles.matchHeader}>
              <span className={styles.matchLabel}>{matchLevel.label}</span>
              <span className={styles.matchValue}>{matchScore.toFixed(0)}%</span>
            </div>
            <div className={styles.matchBar}>
              <div 
                className={styles.matchFill} 
                style={{ width: `${matchScore}%`, backgroundColor: matchLevel.color }} 
              />
            </div>
          </div>
        )}
        <div className={styles.detailItem}>
          <Briefcase size={16} />
          <span>{employee.jobRole} • {employee.experience} yrs exp</span>
        </div>
        <div className={styles.detailItem}>
          <Star size={16} />
          <span className={styles.successRateText}>
            <strong>{employee.stats.successRate}% Success Rate</strong> • {employee.stats.referralsMade} Referrals
          </span>
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
