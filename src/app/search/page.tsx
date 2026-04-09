'use client';

import React, { useState, useEffect } from 'react';
import styles from './search.module.css';
import { Navigation } from '@/components/ui/Navigation';
import { EmployeeCard } from '@/components/ui/EmployeeCard';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Search, Filter, AlertCircle, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const { role: authRole } = useAuth();
  const searchParams = useSearchParams();
  const role = authRole !== 'pending' ? authRole : (searchParams.get('role') as Role) || 'candidate';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getEmployees().catch(() => fetchEmployees());
        setEmployees(data);
      } catch (err: any) {
        setError(err.message || 'Failed to search employees');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRequestClick = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };

  const handleSendRequest = async () => {
    if (!selectedEmployeeId || !requestMessage.trim()) return;
    
    try {
      setIsSending(true);
      await api.sendRequest(selectedEmployeeId, requestMessage);
      alert(`Referral request sent successfully!`);
      setSelectedEmployeeId(null);
      setRequestMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to send request');
    } finally {
      setIsSending(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.layout}>
      <Navigation role="candidate" />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Discover Connections</h1>
          <p>Find employees at your target companies and request a referral.</p>
        </div>

        <div className={styles.searchControls}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.filterBtn}>
            <Filter size={20} />
            Filters
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Searching for the best referrers...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <AlertCircle size={48} />
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>Retry Search</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredEmployees.map(emp => (
              <EmployeeCard 
                key={emp.id} 
                employee={emp} 
                onRequestClick={handleRequestClick}
                isPrivacyMode={false} 
              />
            ))}
            {filteredEmployees.length === 0 && (
              <div className={styles.noResults}>
                <Search size={48} />
                <p>No employees found matching "{searchTerm}". Try a different company or role.</p>
              </div>
            )}
          </div>
        )}

        <Modal 
          isOpen={!!selectedEmployeeId} 
          onClose={() => setSelectedEmployeeId(null)} 
          title="Send Referral Request"
        >
          <div className={styles.modalContent}>
            <p className={styles.modalSubtitle}>Write a brief, professional message explaining why you'd be a great fit for their team.</p>
            <textarea 
              className={styles.messageBox} 
              rows={5} 
              placeholder="Hi there, I noticed we both share a passion for..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              disabled={isSending}
            />
            <div className={styles.resumePreview}>
              <div className={styles.resumeIcon}>📄</div>
              <div className={styles.resumeText}>
                <strong>Jane_Doe_Resume_2026.pdf</strong>
                <span>Will be attached to this request</span>
              </div>
            </div>
            <button 
              className={styles.sendBtn} 
              onClick={handleSendRequest}
              disabled={isSending || !requestMessage.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 size={18} className={styles.spinningIcon} />
                  Sending...
                </>
              ) : 'Send Referral Request'}
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
