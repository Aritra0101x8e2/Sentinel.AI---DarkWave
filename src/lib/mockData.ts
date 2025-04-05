
import { 
  User, 
  LoginAttempt, 
  DeviceInfo, 
  LocationInfo, 
  UserBehavior, 
  SecurityMetric, 
  SecurityAlert 
} from './types';

// Helper to create dates
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Mock users
export const mockUsers: User[] = [
  {
    id: 'usr_1',
    username: 'admin',
    email: 'admin@sentinel.com',
    createdAt: daysAgo(90),
    lastLogin: new Date(),
    riskScore: 25,
    loginHistory: []
  },
  {
    id: 'usr_2',
    username: 'john_doe',
    email: 'john@example.com',
    createdAt: daysAgo(60),
    lastLogin: daysAgo(2),
    riskScore: 50,
    loginHistory: []
  },
  {
    id: 'usr_3',
    username: 'jane_smith',
    email: 'jane@example.com',
    createdAt: daysAgo(30),
    lastLogin: daysAgo(5),
    riskScore: 80,
    loginHistory: []
  },
];

// Mock devices
const mockDevices: DeviceInfo[] = [
  {
    id: 'dev_1',
    type: 'Desktop',
    os: 'Windows 11',
    browser: 'Chrome',
    isMobile: false,
    isKnown: true
  },
  {
    id: 'dev_2',
    type: 'Phone',
    os: 'iOS 16',
    browser: 'Safari',
    isMobile: true,
    isKnown: true
  },
  {
    id: 'dev_3',
    type: 'Tablet',
    os: 'Android 13',
    browser: 'Firefox',
    isMobile: true,
    isKnown: false
  },
  {
    id: 'dev_4',
    type: 'Desktop',
    os: 'Linux',
    browser: 'Firefox',
    isMobile: false,
    isKnown: false
  }
];

// Mock locations
const mockLocations: LocationInfo[] = [
  {
    ip: '192.168.1.1',
    country: 'United States',
    city: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    timeZone: 'America/Los_Angeles',
    isKnown: true
  },
  {
    ip: '10.0.0.1',
    country: 'United Kingdom',
    city: 'London',
    latitude: 51.5074,
    longitude: 0.1278,
    timeZone: 'Europe/London',
    isKnown: false
  },
  {
    ip: '172.16.0.1',
    country: 'Russia',
    city: 'Moscow',
    latitude: 55.7558,
    longitude: 37.6173,
    timeZone: 'Europe/Moscow',
    isKnown: false
  }
];

// Mock behaviors
const generateBehaviors = (count: number): UserBehavior[] => {
  const behaviors: UserBehavior[] = [];
  const types: Array<BehaviorType> = [
    'typing_pattern', 
    'mouse_movement', 
    'interaction_flow', 
    'time_spent', 
    'form_filling_pattern'
  ];
  
  for (let i = 0; i < count; i++) {
    behaviors.push({
      id: `bhv_${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)] as BehaviorType,
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      value: `${Math.random().toString(36).substring(2, 8)}`,
      confidence: Math.random() * 100
    });
  }
  
  return behaviors;
};

// Generate login attempts
export const generateLoginHistory = (userId: string, count: number): LoginAttempt[] => {
  const history: LoginAttempt[] = [];
  
  for (let i = 0; i < count; i++) {
    const isSuccess = Math.random() > 0.2;
    const riskScore = Math.floor(Math.random() * 100);
    const isFlagged = riskScore > 75;
    
    history.push({
      id: `login_${userId}_${i}`,
      userId,
      timestamp: new Date(Date.now() - (i * 86400000 * (Math.random() * 2))),
      device: mockDevices[Math.floor(Math.random() * mockDevices.length)],
      location: mockLocations[Math.floor(Math.random() * mockLocations.length)],
      successful: isSuccess,
      riskScore,
      behaviors: generateBehaviors(Math.floor(Math.random() * 5) + 1),
      flagged: isFlagged,
      reviewStatus: isFlagged ? 'pending' : 'approved'
    });
  }
  
  // Sort by most recent first
  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Populate login history for each user
mockUsers.forEach(user => {
  user.loginHistory = generateLoginHistory(user.id, 10);
});

// Security metrics
export const mockSecurityMetrics: SecurityMetric[] = [
  {
    name: 'Login Attempts',
    value: 245,
    previousValue: 210,
    change: 16.67
  },
  {
    name: 'Flagged Attempts',
    value: 24,
    previousValue: 18,
    change: 33.33
  },
  {
    name: 'Average Risk Score',
    value: 45,
    previousValue: 42,
    change: 7.14
  },
  {
    name: 'Threats Blocked',
    value: 18,
    previousValue: 15,
    change: 20
  }
];

// Security alerts
export const mockAlerts: SecurityAlert[] = [
  {
    id: 'alert_1',
    userId: 'usr_3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    title: 'Unusual Login Location',
    description: 'User logged in from Moscow, Russia for the first time.',
    severity: 'high',
    status: 'new'
  },
  {
    id: 'alert_2',
    userId: 'usr_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    title: 'Abnormal Typing Pattern',
    description: 'Typing pattern significantly different from baseline.',
    severity: 'medium',
    status: 'in_progress'
  },
  {
    id: 'alert_3',
    userId: 'usr_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    title: 'Credential Stuffing Attempt',
    description: 'Multiple failed login attempts detected.',
    severity: 'high',
    status: 'resolved'
  },
  {
    id: 'alert_4',
    userId: 'usr_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    title: 'New Device Login',
    description: 'First login from Linux device.',
    severity: 'low',
    status: 'resolved'
  }
];

// Current logged in user - use this for demo
export const currentUser = mockUsers[0];
