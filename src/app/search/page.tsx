'use client';

import React, { useState, useEffect } from 'react';
import styles from './search.module.css';
import { Navigation } from '@/components/ui/Navigation';
import { EmployeeCard } from '@/components/ui/EmployeeCard';
import { Modal } from '@/components/ui/Modal';
import { fetchEmployees, Employee } from '@/lib/mockData';
import { Search, Filter } from 'lucide-react';

export default function SearchPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchEmployees();
      setEmployees(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleRequestClick = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };

  const handleSendRequest = () => {
    alert(`Request sent to ${selectedEmployeeId} with message: ${requestMessage}`);
    setSelectedEmployeeId(null);
    setRequestMessage('');
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
          <div className={styles.loading}>Searching network...</div>
        ) : (
          <div className={styles.grid}>
            {filteredEmployees.map(emp => (
              <EmployeeCard 
                key={emp.id} 
                employee={emp} 
                onRequestClick={handleRequestClick}
                isPrivacyMode={true} 
              />
            ))}
            {filteredEmployees.length === 0 && (
              <div className={styles.noResults}>No employees found matching your search.</div>
            )}
          </div>
        )}

        <Modal 
          isOpen={!!selectedEmployeeId} 
          onClose={() => setSelectedEmployeeId(null)} 
          title="Send Referral Request"
        >
          <div className={styles.modalContent}>
            <p>Write a brief, professional message explaining why you'd be a great fit for their team.</p>
            <textarea 
              className={styles.messageBox} 
              rows={5} 
              placeholder="Hi there, I noticed we both share a passion for..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
            <div className={styles.resumePreview}>
              <div className={styles.resumeIcon}>📄</div>
              <div className={styles.resumeText}>
                <strong>Jane_Doe_Resume_2026.pdf</strong>
                <span>Will be attached to this request</span>
              </div>
            </div>
            <button className={styles.sendBtn} onClick={handleSendRequest}>
              Send Request
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
