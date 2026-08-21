import axios from 'axios';
import { USE_BACKEND } from './config';
import {
  mockDashboardStats, mockGuests, mockRsvps, mockGifts, mockCheckins,
  mockTemplates, mockInvitations, mockTransactions, mockDomains,
  mockNotifications, mockUserAccounts, mockAdminAccounts,
  getLocalUsers, registerMockUser
} from './mockData';

// Helper to simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const mockAdapter = async (config: any) => {
  await delay();
  
  const { url, method, data } = config;
  const parsedData = data ? JSON.parse(data) : {};

  let responseData: any = null;
  let status = 200;

  console.log(`[Mock API Request] ${method?.toUpperCase()} ${url}`);

  if (method?.toLowerCase() === 'get') {
    switch (url) {
      case '/stats/dashboard': responseData = mockDashboardStats; break;
      case '/guests': responseData = mockGuests; break;
      case '/rsvp': responseData = mockRsvps; break;
      case '/gifts': responseData = mockGifts; break;
      case '/checkins': responseData = mockCheckins; break;
      case '/templates': responseData = mockTemplates; break;
      case '/invitations': responseData = mockInvitations; break;
      case '/transactions': responseData = mockTransactions; break;
      case '/domains': responseData = mockDomains; break;
      case '/notifications': responseData = mockNotifications; break;
      case '/user-accounts': responseData = mockUserAccounts; break;
      case '/admin-accounts': responseData = mockAdminAccounts; break;
      default:
        status = 404;
        responseData = { message: "Not found" };
    }
  } else if (method?.toLowerCase() === 'post') {
    if (url === '/auth/login') {
      const { email, password } = parsedData;
      const users = getLocalUsers();
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        responseData = {
          access_token: "mock-jwt-token-" + Date.now(),
          user: { name: user.name, email: user.email }
        };
      } else {
        status = 401;
        responseData = { message: "Email atau password salah" };
      }
    } else if (url === '/auth/register') {
      const { name, email, password } = parsedData;
      registerMockUser({ name, email, password });
      responseData = { success: true };
    } else if (url === '/users/password') {
      responseData = { success: true };
    } else {
      responseData = { success: true };
    }
  } else if (method?.toLowerCase() === 'patch') {
    if (url === '/users/profile') {
      responseData = { name: parsedData.name };
    } else if (url?.startsWith('/invitations/')) {
      responseData = { success: true };
    } else if (url === '/notifications') {
      responseData = { success: true };
    } else {
      responseData = { success: true };
    }
  }

  if (status >= 400) {
    const error: any = new Error(`Request failed with status code ${status}`);
    error.config = config;
    error.response = { status, data: responseData, config };
    throw error;
  }

  return {
    data: responseData,
    status,
    statusText: 'OK',
    headers: {},
    config,
    request: {}
  };
};

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  ...(USE_BACKEND ? {} : { adapter: mockAdapter as any })
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (USE_BACKEND) {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, { token });
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (USE_BACKEND) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('current_user');
      // Redirect to login if not already there, avoiding infinite loops
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
