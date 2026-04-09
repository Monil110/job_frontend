'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './dashboard.module.css';
import { Navigation } from '@/components/ui/Navigation';
import { fetchRequests, fetchEmployees, ReferralRequest, Employee, Role } from '@/lib/mockData';
import { EmployeeCard } from '@/components/ui/EmployeeCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { AlertCircle, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

function DashboardContent() {
  const { user, role: authRole } = useAuth();
  const searchParams = useSearchParams();
  
  // Use auth role if available, otherwise search params
  const role = authRole !== 'pending' ? authRole : (searchParams.get('role') as Role) || 'candidate';
  const profileScore = Number(user?.profileScore || searchParams.get('score') || 85);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ReferralRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In real app, we use api service
        // For hackathon, we can fallback to mock if API fails
        const [reqs, emps] = await Promise.all([
          api.getRequests().catch(() => fetchRequests()),
          api.getMatches().catch(() => fetchEmployees())
        ]);
        
        setRequests(reqs);
        setEmployees(emps);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRequestClick = (employeeId: string) => {
    alert(`Request referral for employee ${employeeId}`);
  };

  const renderCandidateDashboard = () => {
    const isGateBlocked = profileScore < 50;

    return (
      <>
        <div className={styles.scoreBanner}>
          <div className={styles.scoreHeader}>
            <div className={styles.scoreInfo}>
              <span className={styles.scoreLabel}>Profile Strength</span>
              <span className={styles.scoreValue}>{profileScore}%</span>
            </div>
            <span className={styles.completenessText}>
              {profileScore >= 90 ? 'Excellent! You are top-tier.' : 
               profileScore >= 70 ? 'Great profile! Almost there.' :
               profileScore >= 50 ? 'Good start. Add more skills to rank higher.' :
               'Action Required: Complete your profile.'}
            </span>
          </div>
          <div className={styles.scoreProgress}>
            <div 
              className={styles.scoreFill} 
              style={{ 
                width: `${profileScore}%`, 
                background: isGateBlocked ? '#ef4444' : profileScore > 80 ? '#10b981' : '#3b82f6' 
              }}
            ></div>
          </div>
          {isGateBlocked && (
            <div className={styles.gateMessage}>
              <AlertCircle size={16} />
              <p>Your score is below 50. Complete your profile to unlock employee discovery and matching.</p>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWithIcon}>
              <TrendingUp size={20} className={styles.sectionIcon} />
              <h2>Active Requests</h2>
            </div>
            <span className={styles.viewAll}>View Pipeline</span>
          </div>
          <div className={styles.requestsList}>
            {requests.slice(0, 3).map(req => (
              <div key={req.id} className={`glass-panel ${styles.requestRow}`}>
                <div className={styles.reqInfo}>
                  <h4>Referral at {employees.find(e => e.id === req.employeeId)?.company || 'Tech Corp'}</h4>
                  <div className={styles.reqMeta}>Submitted {new Date(req.createdAt).toLocaleDateString()}</div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
            {requests.length === 0 && (
              <div className={styles.emptyState}>
                <p>No active requests. Start your journey by discovering employees!</p>
              </div>
            )}
          </div>
        </div>

        {!isGateBlocked && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.titleWithIcon}>
                <CheckCircle2 size={20} className={styles.sectionIcon} />
                <h2>Top Matches for You</h2>
              </div>
              <span className={styles.viewAll}>See All Matches</span>
            </div>
            <div className={styles.grid}>
              {employees.slice(0, 2).map((emp) => (
                <EmployeeCard 
                  key={emp.id} 
                  employee={emp} 
                  onRequestClick={handleRequestClick} 
                  isPrivacyMode={false} 
                />
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderEmployeeDashboard = () => (
    <>
      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIconWrap} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>Referrals Made</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIconWrap} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statValue}>80%</div>
          <div className={styles.statLabel}>Success Rate</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIconWrap} style={{ background: 'rgba(255, 215, 0, 0.1)', color: '#ffd700' }}>
            <Users size={24} />
          </div>
          <div className={styles.statValue}>150</div>
          <div className={styles.statLabel}>Reputation Score</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleWithIcon}>
            <AlertCircle size={20} className={styles.sectionIcon} />
            <h2>Action Required</h2>
          </div>
        </div>
        <div className={styles.requestsList}>
          {requests.filter(r => r.status === 'PENDING').map(req => (
            <div key={req.id} className={`glass-panel ${styles.requestRow}`}>
              <div className={styles.reqInfo}>
                <h4>Candidate {req.candidateId.slice(-4)}</h4>
                <div className={styles.reqMeta}>Privacy Protected • Sent {new Date(req.createdAt).toLocaleDateString()}</div>
                <p className={styles.reqMessage}>"{req.message}"</p>
              </div>
              <div className={styles.reqActions}>
                <button className={styles.acceptBtn}>Review</button>
              </div>
            </div>
          ))}
          {requests.filter(r => r.status === 'PENDING').length === 0 && (
            <div className={styles.emptyState}>
              <p>All caught up! No pending requests to review.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (error) {
    return (
      <div className={styles.layout}>
        <Navigation role={role} />
        <main className={styles.mainContent}>
          <div className={styles.errorContainer}>
            <AlertCircle size={48} />
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Navigation role={role} />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Welcome back!</h1>
          <p>Here is what's happening with your referral network.</p>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading your dashboard...</div>
        ) : (
          <div className={styles.content}>
            {role === 'candidate' ? renderCandidateDashboard() : renderEmployeeDashboard()}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading Dashboard Module...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
