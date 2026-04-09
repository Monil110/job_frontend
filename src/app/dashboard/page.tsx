'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './dashboard.module.css';
import { Navigation } from '@/components/ui/Navigation';
import { fetchRequests, fetchEmployees, ReferralRequest, Employee, Role } from '@/lib/mockData';
import { EmployeeCard } from '@/components/ui/EmployeeCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

function DashboardContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as Role) || 'candidate';

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ReferralRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [reqs, emps] = await Promise.all([fetchRequests(), fetchEmployees()]);
      setRequests(reqs);
      setEmployees(emps);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRequestClick = (employeeId: string) => {
    // Should open modal in standard app
    alert(`Request referral for employee ${employeeId}`);
  };

  const renderCandidateDashboard = () => (
    <>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Requests</h2>
          <span className={styles.viewAll}>View All</span>
        </div>
        <div className={styles.requestsList}>
          {requests.map(req => (
            <div key={req.id} className={`glass-panel ${styles.requestRow}`}>
              <div className={styles.reqInfo}>
                <h4>Request to Employee {req.employeeId.slice(-3)}</h4>
                <div className={styles.reqMeta}>Sent {new Date(req.createdAt).toLocaleDateString()}</div>
              </div>
              <StatusBadge status={req.status} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Suggested Employees for You</h2>
          <span className={styles.viewAll}>Discover More</span>
        </div>
        <div className={styles.grid}>
          {employees.slice(0, 2).map((emp) => (
            <EmployeeCard 
              key={emp.id} 
              employee={emp} 
              onRequestClick={handleRequestClick} 
              isPrivacyMode={true} 
            />
          ))}
        </div>
      </div>
    </>
  );

  const renderEmployeeDashboard = () => (
    <>
      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>Referrals Made</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statValue}>80%</div>
          <div className={styles.statLabel}>Acceptance Rate</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statValue}>2</div>
          <div className={styles.statLabel}>Pending Requests</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Action Required</h2>
        </div>
        <div className={styles.requestsList}>
          {requests.filter(r => r.status === 'Pending').map(req => (
            <div key={req.id} className={`glass-panel ${styles.requestRow}`}>
              <div className={styles.reqInfo}>
                <h4>Candidate {req.candidateId.slice(-3)}</h4>
                <div className={styles.reqMeta}>UX Designer • 3 Years Exp</div>
                <p className={styles.reqMessage}>"{req.message}"</p>
              </div>
              <div className={styles.reqActions}>
                <button className={styles.acceptBtn}>Accept</button>
                <button className={styles.rejectBtn}>Reject</button>
              </div>
            </div>
          ))}
          {requests.filter(r => r.status === 'Pending').length === 0 && (
            <p>No pending requests.</p>
          )}
        </div>
      </div>
    </>
  );

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
