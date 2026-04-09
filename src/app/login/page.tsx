'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<'auth' | 'role'>('auth');
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'employee' | null>(null);

  const handleGoogleLogin = () => {
    // Mock the OAuth flow by simply moving to the next step
    setTimeout(() => {
      setStep('role');
    }, 800);
  };

  const handleRoleSelection = (role: 'candidate' | 'employee') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // In a real app we'd save it to the DB or Context
      router.push(`/onboarding?role=${selectedRole}`);
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
            <button className={styles.googleBtn} onClick={handleGoogleLogin}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className={styles.gLogo} />
              Continue with Google
            </button>
            <div className={styles.divider}>or</div>
            <p className={styles.hint}>For the hackathon MVP, clicking the button mocks a successful OAuth login.</p>
          </div>
        ) : (
          <div className={styles.roleStep}>
            <div className={styles.roleOptions}>
              <button 
                className={`${styles.roleCard} ${selectedRole === 'candidate' ? styles.selected : ''}`}
                onClick={() => handleRoleSelection('candidate')}
              >
                <h3>Candidate</h3>
                <p>I want to find employees and request referrals for open roles.</p>
              </button>
              <button 
                className={`${styles.roleCard} ${selectedRole === 'employee' ? styles.selected : ''}`}
                onClick={() => handleRoleSelection('employee')}
              >
                <h3>Employee</h3>
                <p>I want to refer talented candidates to open roles at my company.</p>
              </button>
            </div>
            
            <button 
              className={styles.continueBtn} 
              disabled={!selectedRole}
              onClick={handleContinue}
            >
              Continue to Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
