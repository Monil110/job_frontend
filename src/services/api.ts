import { Role, RequestStatus, Employee, Candidate, ReferralRequest, Notification } from '@/lib/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || 'Something went wrong');
  }
  return response.json();
}

export const api = {
  // Auth
  updateRole: (role: Role) => 
    fetch(`${API_BASE_URL}/auth/role`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    }).then(handleResponse<{ token: string; user: any }>),

  // Profile
  getProfile: () => 
    fetch(`${API_BASE_URL}/profile`, { headers: getHeaders() }).then(handleResponse<any>),
  
  updateCandidateProfile: (data: any) => 
    fetch(`${API_BASE_URL}/profile/candidate`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<any>),

  updateEmployeeProfile: (data: any) => 
    fetch(`${API_BASE_URL}/profile/employee`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse<any>),

  // Discovery
  getEmployees: (filters?: { company?: string; role?: string }) => {
    const params = new URLSearchParams(filters as any);
    return fetch(`${API_BASE_URL}/discovery/employees?${params}`, { headers: getHeaders() })
      .then(handleResponse<Employee[]>);
  },

  getMatches: () => 
    fetch(`${API_BASE_URL}/discovery/matches`, { headers: getHeaders() })
      .then(handleResponse<Employee[]>),

  // Referrals
  getRequests: () => 
    fetch(`${API_BASE_URL}/referrals`, { headers: getHeaders() })
      .then(handleResponse<ReferralRequest[]>),

  sendRequest: (employeeId: string, message: string) => 
    fetch(`${API_BASE_URL}/referrals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ employeeId, message }),
    }).then(handleResponse<ReferralRequest>),

  updateRequestStatus: (id: string, status: RequestStatus) => 
    fetch(`${API_BASE_URL}/referrals/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    }).then(handleResponse<ReferralRequest>),

  // Notifications
  getNotifications: () => 
    fetch(`${API_BASE_URL}/notifications`, { headers: getHeaders() })
      .then(handleResponse<Notification[]>),

  markNotificationRead: (id: string) => 
    fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
    }).then(handleResponse<void>),
};
