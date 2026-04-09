'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './onboarding.module.css';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as 'candidate' | 'employee' | null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    skills: '',
    targetCompanies: '',
    company: '',
    jobRole: '',
    openToReferrals: true,
  });

  useEffect(() => {
    // If no role in URL, fallback to candidate
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and redirect
    setTimeout(() => {
      // Mock passing role to dashboard for hackathon prototype
      router.push(`/dashboard?role=${role || 'candidate'}`);
    }, 600);
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
          <p>Step {step} of 2</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(step / 2) * 100}%` }}></div>
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
