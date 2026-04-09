'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './onboarding.module.css';

import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Role } from '@/lib/mockData';

function OnboardingContent() {
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as 'candidate' | 'employee') || 'candidate';

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    skills: '',
    targetCompanies: '',
    company: '',
    jobRole: '',
    resumeUploaded: false,
    openToReferrals: true,
  });

  const calculateScore = () => {
    let score = 0;
    if (formData.name) score += 10;
    if (formData.experience) score += 20;
    const skillsCount = formData.skills.split(',').filter(s => s.trim()).length;
    score += Math.min(skillsCount * 10, 30);
    if (role === 'candidate' && formData.resumeUploaded) score += 40;
    if (role === 'employee' && formData.company) score += 20;
    if (role === 'employee' && formData.jobRole) score += 20;
    return Math.min(score, 100);
  };

  const currentScore = calculateScore();

  useEffect(() => {
    if (!role) {
      router.replace('/onboarding?role=candidate');
    }
  }, [role, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const score = calculateScore();
    
    try {
      // Real API call
      if (role === 'candidate') {
        await api.updateCandidateProfile({ ...formData, profileScore: score });
      } else {
        await api.updateEmployeeProfile({ ...formData, profileScore: score });
      }
      
      // Update local state
      if (user) {
        login(localStorage.getItem('token') || '', { ...user, profileScore: score });
      }
      
      router.push(`/dashboard?role=${role}&score=${score}`);
    } catch (err) {
      // For demo purposes, we still proceed if API fails
      console.error('API Error:', err);
      router.push(`/dashboard?role=${role}&score=${score}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCandidateFields = () => (
    <>
      {step === 1 && (
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Doe" />
          
          <label>Years of Experience</label>
          <input required type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 3" min="0" />
        </div>
      )}
      {step === 2 && (
        <div className={styles.formGroup}>
          <label>Key Skills (comma separated)</label>
          <input required type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python" />
          
          <label>Target Companies (comma separated)</label>
          <input type="text" name="targetCompanies" value={formData.targetCompanies} onChange={handleChange} placeholder="Google, Meta, Stripe" />

          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="resumeUploaded" name="resumeUploaded" checked={formData.resumeUploaded} onChange={handleChange} />
            <label htmlFor="resumeUploaded">Resume Uploaded (Simulated)</label>
          </div>
        </div>
      )}
    </>
  );

  const renderEmployeeFields = () => (
    <>
      {step === 1 && (
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Smith" />
          
          <label>Current Company</label>
          <input required type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Google" />
        </div>
      )}
      {step === 2 && (
        <div className={styles.formGroup}>
          <label>Job Role</label>
          <input required type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} placeholder="Software Engineer" />
          
          <label>Years at Company</label>
          <input required type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" min="0" />
          
          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="openToReferrals" name="openToReferrals" checked={formData.openToReferrals} onChange={handleChange} />
            <label htmlFor="openToReferrals">I am open to receiving referral requests</label>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.onboardingBox}`}>
        <div className={styles.header}>
          <h2>Complete Your Profile</h2>
          <div className={styles.progressContainer}>
            <div className={styles.stepIndicator}>Step {step} of 2</div>
            <div className={styles.completenessIndicator}>Profile: {currentScore}% complete</div>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(step / 2) * 100}%` }}></div>
            <div className={styles.scoreFill} style={{ width: `${currentScore}%` }}></div>
          </div>
        </div>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <div className={styles.formContent}>
            {role === 'candidate' ? renderCandidateFields() : renderEmployeeFields()}
          </div>

          <div className={styles.actions}>
            {step > 1 && (
              <button type="button" className={styles.secondaryBtn} onClick={handlePrev}>
                Back
              </button>
            )}
            <button type="submit" className={styles.primaryBtn}>
              {step === 2 ? 'Complete Profile' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading Profile Setup...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
