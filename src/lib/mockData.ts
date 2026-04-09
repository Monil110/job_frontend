export type Role = 'candidate' | 'employee' | 'pending';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REFERRED' | 'INTERVIEWING' | 'OFFER' | 'HIRED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatarUrl?: string;
  profileScore: number; // Quality Score (0-100)
  reputationScore: number;
}

export interface Candidate extends User {
  role: 'candidate';
  skills: string[];
  experience: number; // Years
  targetCompanies: string[];
  resumeUrl?: string;
  matchScore?: number; // Match Score for discovery
}

export interface Employee extends User {
  role: 'employee';
  company: string;
  jobRole: string;
  experience: number; // Years
  openToReferrals: boolean;
  skills: string[];
  stats: {
    referralsMade: number;
    successRate: number; // Percentage
  };
}

export interface ReferralRequest {
  id: string;
  candidateId: string;
  employeeId: string;
  status: RequestStatus;
  message: string;
  createdAt: string;
  isPrivacyLifted: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'STATUS_UPDATE' | 'NEW_MATCH' | 'GENERAL';
  isRead: boolean;
  createdAt: string;
}

// Fixed mock IDs
export const mockCandidates: Candidate[] = [
  {
    id: "mock_user_candidate_001",
    name: "Jane Doe",
    role: "candidate",
    email: "jane.doe@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=mock_user_candidate_001",
    profileScore: 85,
    reputationScore: 50,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    experience: 3,
    targetCompanies: ["Google", "Meta", "Stripe"],
    matchScore: 92
  },
  {
    id: "mock_user_candidate_002",
    name: "John Smith",
    role: "candidate",
    email: "john.smith@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=mock_user_candidate_002",
    profileScore: 45, // Below the "Gate" of 50
    reputationScore: 0,
    skills: ["Node.js", "Python", "SQL", "AWS"],
    experience: 1,
    targetCompanies: ["Amazon", "Netflix", "Microsoft"],
    matchScore: 75
  }
];

export const mockEmployees: Employee[] = [
  {
    id: "mock_user_employee_001",
    name: "Alice Chen",
    role: "employee",
    email: "alice.chen@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=mock_user_employee_001",
    profileScore: 100,
    reputationScore: 150,
    company: "Google",
    jobRole: "Software Engineer",
    experience: 5,
    openToReferrals: true,
    skills: ["React", "GraphQL", "TypeScript", "System Design"],
    stats: {
      referralsMade: 12,
      successRate: 80,
    }
  },
  {
    id: "mock_user_employee_002",
    name: "Bob Taylor",
    role: "employee",
    email: "bob.taylor@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=mock_user_employee_002",
    profileScore: 95,
    reputationScore: 80,
    company: "Meta",
    jobRole: "Product Designer",
    experience: 3,
    openToReferrals: true,
    skills: ["Figma", "UI/UX", "Prototyping"],
    stats: {
      referralsMade: 4,
      successRate: 50,
    }
  },
  {
    id: "mock_user_employee_003",
    name: "Charlie Davis",
    role: "employee",
    email: "charlie.davis@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=mock_user_employee_003",
    profileScore: 90,
    reputationScore: 20,
    company: "Stripe",
    jobRole: "Backend Engineer",
    experience: 4,
    openToReferrals: false,
    skills: ["Ruby", "Go", "PostgreSQL"],
    stats: {
      referralsMade: 0,
      successRate: 0,
    }
  }
];

export const mockRequests: ReferralRequest[] = [
  {
    id: "mock_request_001",
    candidateId: "mock_user_candidate_001",
    employeeId: "mock_user_employee_001",
    status: "PENDING",
    message: "Hi Alice, I love the work you do at Google. I have 3 years of React experience and would be honored if you could refer me for the Frontend role.",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isPrivacyLifted: false,
  },
  {
    id: "mock_request_002",
    candidateId: "mock_user_candidate_001",
    employeeId: "mock_user_employee_002",
    status: "ACCEPTED",
    message: "Hey Bob, I'm a big fan of the new Meta design system. Would you be open to chatting about a product design role?",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    isPrivacyLifted: true,
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "mock_notif_001",
    userId: "mock_user_candidate_001",
    message: "Your request to Alice Chen has been ACCEPTED! Privacy layer lifted.",
    type: "STATUS_UPDATE",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "mock_notif_002",
    userId: "mock_user_candidate_001",
    message: "New Match Found: Sarah Miller at Netflix shares 4 skills with you.",
    type: "NEW_MATCH",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  }
];

// Faking API calls for realistic demonstration
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function fetchEmployees(): Promise<Employee[]> {
  await delay(800);
  return mockEmployees;
}

export async function fetchCandidates(): Promise<Candidate[]> {
  await delay(800);
  return mockCandidates;
}

export async function fetchRequests(): Promise<ReferralRequest[]> {
  await delay(600);
  return mockRequests;
}

export async function fetchNotifications(): Promise<Notification[]> {
  await delay(400);
  return mockNotifications;
}

