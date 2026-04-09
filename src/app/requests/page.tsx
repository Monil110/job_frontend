'use client';

import React, { useState, useEffect } from 'react';
import styles from './requests.module.css';
import { Navigation } from '@/components/ui/Navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { fetchRequests, ReferralRequest } from '@/lib/mockData';
import { MessageSquare, Calendar, ChevronRight } from 'lucide-react';

export default function RequestsPage() {
  const [requests, setRequests] = useState<ReferralRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchRequests();
      setRequests(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Your Requests</h1>
          <p>Track the status of your referral requests pipeline.</p>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading requests...</div>
        ) : (
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.col}>Person</div>
              <div className={styles.col}>Status</div>
              <div className={styles.col}>Date</div>
              <div className={styles.col}>Message</div>
              <div className={styles.col}></div>
            </div>

            <div className={styles.tableBody}>
              {requests.map(req => (
                <div key={req.id} className={styles.tableRow}>
                  <div className={styles.col}>
                    <div className={styles.personInfo}>
                      <div className={styles.avatarPlaceholder} />
                      <div>
                        <div className={styles.personName}>User {req.employeeId.slice(-3)}</div>
                        <div className={styles.personSub}>Software Engineer</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.col}>
                    <StatusBadge status={req.status} />
                  </div>
                  
                  <div className={styles.col}>
                    <div className={styles.dateInfo}>
                      <Calendar size={14} />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className={styles.col}>
                    <div className={styles.messagePreview}>
                      <MessageSquare size={14} />
                      <span>{req.message.slice(0, 30)}...</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.col} ${styles.colAction}`}>
                    <button className={styles.viewBtn}>
                      View details <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              {requests.length === 0 && (
                <div className={styles.noData}>No requests found.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
