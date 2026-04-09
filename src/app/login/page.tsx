'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { login, updateRole } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'auth' | 'role'>('auth');
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'employee' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Mock the OAuth flow
    setTimeout(() => {
      // Mock user data from Google
      const mockGoogleUser = {
        id: 'google_123',
        name: 'Jane Doe',
        email: 'jane@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=jane',
        profileScore: 0,
        reputationScore: 0,
        role: 'pending' as const
      };
      
      login('mock_jwt_token', mockGoogleUser);
      setStep('role');
      setIsLoading(false);
    }, 1200);
  };

  const handleRoleSelection = (role: 'candidate' | 'employee') => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (selectedRole) {
      setIsLoading(true);
      try {
        // Real API call to update role
        await api.updateRole(selectedRole).catch(() => {
          // Fallback for mock demo
          updateRole(selectedRole);
        });
        router.push(`/onboarding?role=${selectedRole}`);
      } catch (err) {
        alert('Failed to set role');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backBtn}>← Back</Link>
      
      <div className={`glass-panel ${styles.loginBox}`}>
        <div className={styles.header}>
          <h2>{step === 'auth' ? 'Welcome Back' : 'Choose Your Role'}</h2>
          <p>{step === 'auth' ? 'Sign in to access the referral platform.' : 'How will you be using this platform?'}</p>
        </div>

        {step === 'auth' ? (
          <div className={styles.authStep}>
            <button className={styles.googleBtn} onClick={handleGoogleLogin} disabled={isLoading}>
              {isLoading ? (
                <Loader2 size={20} className={styles.spinner} />
              ) : (
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className={styles.gLogo} />
              )}
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </button>
            <div className={styles.divider}>or</div>
            <p className={styles.hint}>Mocking OAuth login for demo purposes.</p>
          </div>
        ) : (
          <div className={styles.roleStep}>
            <div className={styles.roleOptions}>
              <button 
                className={`${styles.roleCard} ${selectedRole === 'candidate' ? styles.selected : ''}`}
                onClick={() => handleRoleSelection('candidate')}
                disabled={isLoading}
              >
                <h3>Candidate</h3>
                <p>I want to find employees and request referrals for open roles.</p>
              </button>
              <button 
                className={`${styles.roleCard} ${selectedRole === 'employee' ? styles.selected : ''}`}
                onClick={() => handleRoleSelection('employee')}
                disabled={isLoading}
              >
                <h3>Employee</h3>
                <p>I want to refer talented candidates to open roles at my company.</p>
              </button>
            </div>
            
            <button 
              className={styles.continueBtn} 
              disabled={!selectedRole || isLoading}
              onClick={handleContinue}
            >
              {isLoading ? <Loader2 size={20} className={styles.spinner} /> : 'Continue to Setup'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
