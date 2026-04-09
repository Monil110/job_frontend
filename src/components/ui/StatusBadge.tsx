'use client';

import React from 'react';
import styles from './StatusBadge.module.css';
import { RequestStatus } from '@/lib/mockData';
import { CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'Accepted':
        return { icon: <CheckCircle size={14} />, className: styles.accepted };
      case 'Rejected':
        return { icon: <XCircle size={14} />, className: styles.rejected };
      case 'Referred':
        return { icon: <ExternalLink size={14} />, className: styles.referred };
      case 'Pending':
      default:
        return { icon: <Clock size={14} />, className: styles.pending };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`${styles.badge} ${config.className}`}>
      {config.icon}
      <span>{status}</span>
    </div>
  );
}
