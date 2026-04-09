'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styles from './requests.module.css';
import { Navigation } from '@/components/ui/Navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { fetchRequests, ReferralRequest, Role, RequestStatus } from '@/lib/mockData';
import { MessageSquare, Calendar, ChevronRight, User as UserIcon, Shield, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

function RequestsContent() {
  const { role: authRole } = useAuth();
  const searchParams = useSearchParams();
  const role = authRole !== 'pending' ? authRole : (searchParams.get('role') as Role) || 'candidate';

  const [requests, setRequests] = useState<ReferralRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getRequests().catch(() => fetchRequests());
        setRequests(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateStatus = async (id: string, newStatus: RequestStatus) => {
    try {
      await api.updateRequestStatus(id, newStatus);
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: newStatus, isPrivacyLifted: newStatus !== 'PENDING' && newStatus !== 'REJECTED' } : req
      ));
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const getDisplayName = (req: ReferralRequest) => {
    if (role === 'candidate') {
      return `Employee ${req.employeeId.slice(-4)}`;
    }
    return req.isPrivacyLifted ? `Candidate ${req.candidateId.slice(-4)}` : `Candidate #${req.candidateId.slice(0, 4).toUpperCase()}`;
  };

  return (
    <div className={styles.layout}>
      <Navigation role={role} />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>{role === 'candidate' ? 'Sent Requests' : 'Incoming Requests'}</h1>
          <p>{role === 'candidate' ? 'Track the status of your referral requests pipeline.' : 'Manage and respond to referral requests from candidates.'}</p>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Fetching your requests...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <AlertCircle size={48} />
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry</button>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.col}>Person</div>
              <div className={styles.col}>Status</div>
              <div className={styles.col}>Privacy</div>
              <div className={styles.col}>Date</div>
              <div className={styles.col}>Actions</div>
            </div>

            <div className={styles.tableBody}>
              {requests.map(req => (
                <div key={req.id} className={styles.tableRow}>
                  <div className={styles.col}>
                    <div className={styles.personInfo}>
                      <div className={styles.avatarPlaceholder}>
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <div className={styles.personName}>{getDisplayName(req)}</div>
                        <div className={styles.personSub}>{role === 'candidate' ? 'Software Engineer' : 'Product Designer'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.col}>
                    <StatusBadge status={req.status} />
                  </div>

                  <div className={styles.col}>
                    <div className={`${styles.privacyIndicator} ${req.isPrivacyLifted ? styles.lifted : styles.masked}`}>
                      {req.isPrivacyLifted ? <ShieldCheck size={16} /> : <Shield size={16} />}
                      <span>{req.isPrivacyLifted ? 'Lifted' : 'Masked'}</span>
                    </div>
                  </div>
                  
                  <div className={styles.col}>
                    <div className={styles.dateInfo}>
                      <Calendar size={14} />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className={`${styles.col} ${styles.colAction}`}>
                    {role === 'employee' && req.status === 'PENDING' && (
                      <div className={styles.actionGroup}>
                        <button className={styles.acceptBtn} onClick={() => updateStatus(req.id, 'ACCEPTED')}>Accept</button>
                        <button className={styles.rejectBtn} onClick={() => updateStatus(req.id, 'REJECTED')}>Reject</button>
                      </div>
                    )}
                    {role === 'employee' && req.status === 'ACCEPTED' && (
                      <button className={styles.nextBtn} onClick={() => updateStatus(req.id, 'REFERRED')}>Mark as Referred</button>
                    )}
                    {role === 'employee' && req.status === 'REFERRED' && (
                      <button className={styles.nextBtn} onClick={() => updateStatus(req.id, 'INTERVIEWING')}>Move to Interview</button>
                    )}
                    {role === 'employee' && req.status === 'INTERVIEWING' && (
                      <button className={styles.nextBtn} onClick={() => updateStatus(req.id, 'OFFER')}>Move to Offer</button>
                    )}
                    {role === 'employee' && req.status === 'OFFER' && (
                      <button className={styles.hireBtn} onClick={() => updateStatus(req.id, 'HIRED')}>Confirm Hire (+50 Rep)</button>
                    )}
                    {req.status === 'HIRED' && (
                      <div className={styles.successBadge}>
                        <CheckCircle2 size={16} />
                        <span>Hired!</span>
                      </div>
                    )}
                    {role === 'candidate' && req.status !== 'HIRED' && (
                      <button className={styles.viewBtn}>
                        Details <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {requests.length === 0 && (
                <div className={styles.noData}>
                  <MessageSquare size={48} />
                  <p>No requests found in your pipeline.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<div className={styles.loading}><div className={styles.spinner} /><p>Loading Requests...</p></div>}>
      <RequestsContent />
    </Suspense>
  );
}
