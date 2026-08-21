// Mock datasets for standalone mode

export const mockDashboardStats = {
  totals: {
    visits: 2847,
    guests: 248,
    rsvps: 186,
    giftsTotal: 12400000
  },
  weeklyVisits: [120, 150, 180, 170, 220, 300, 350],
  latestRsvps: [
    { name: "Budi Santoso", attendance: true, createdAt: new Date().toISOString() },
    { name: "Siti Aminah", attendance: false, createdAt: new Date(Date.now() - 86400000).toISOString() }
  ]
};

export const mockGuests = [
  { id: "1", name: "Budi Santoso", email: "budi@example.com", phone: "08123456789", category: "Keluarga", status: "Sent" },
  { id: "2", name: "Siti Aminah", email: "siti@example.com", phone: "08129876543", category: "Teman", status: "Opened" },
  { id: "3", name: "Andi Wijaya", email: "andi@example.com", phone: "08131234567", category: "Rekan Kerja", status: "RSVP" }
];

export const mockRsvps = [
  { id: "1", name: "Budi Santoso", attendance: true, status: "Hadir", message: "Selamat ya! Semoga lancar sampai hari H.", createdAt: new Date().toISOString() },
  { id: "2", name: "Siti Aminah", attendance: false, status: "Tidak Hadir", message: "Maaf tidak bisa hadir, ada acara keluarga.", createdAt: new Date(Date.now() - 86400000).toISOString() }
];

export const mockGifts = [
  { id: "1", sender: "Andi Wijaya", amount: 500000, message: "Selamat menempuh hidup baru!", date: new Date().toISOString() },
  { id: "2", sender: "Budi Santoso", amount: 1000000, message: "Selamat berbahagia!", date: new Date(Date.now() - 86400000).toISOString() }
];

export const mockCheckins = [
  { id: "1", guestName: "Andi Wijaya", time: new Date().toISOString(), status: "Checked In" },
  { id: "2", guestName: "Siti Aminah", time: new Date(Date.now() - 3600000).toISOString(), status: "Checked In" }
];

export const mockTemplates = [
  { id: "1", name: "Elegance Gold", category: "Premium", thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
  { id: "2", name: "Rustic Floral", category: "Basic", thumbnail: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80" },
  { id: "3", name: "Modern Minimalist", category: "Standard", thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80" }
];

export const mockInvitations = [
  { id: "1", title: "Pernikahan Budi & Siti", date: "2024-12-20", status: "Active", link: "invito.com/budi-siti" },
  { id: "2", title: "Khitanan Ahmad", date: "2024-11-15", status: "Draft", link: "invito.com/khitanan-ahmad" }
];

export const mockTransactions = [
  { id: "INV-001", date: "2024-10-01", amount: 250000, status: "Success", description: "Pembelian Template Premium" },
  { id: "INV-002", date: "2024-10-05", amount: 150000, status: "Pending", description: "Perpanjangan Masa Aktif" }
];

export const mockDomains = [
  { id: "1", domain: "budisiti.com", status: "Active", expiry: "2025-10-01" },
  { id: "2", domain: "ahmadkhitan.id", status: "Pending", expiry: "2025-11-15" }
];

export const mockNotifications = {
  email: true,
  push: true,
  sms: false,
  weeklyReport: true
};

export const mockUserAccounts = [
  { id: "1", name: "Demo User", email: "demo@invito.com", role: "User", status: "Active", joinedAt: "2024-01-01" },
  { id: "2", name: "Test User", email: "test@invito.com", role: "User", status: "Inactive", joinedAt: "2024-02-01" }
];

export const mockAdminAccounts = [
  { id: "1", name: "Super Admin", email: "admin@invito.com", role: "Super Admin", status: "Active", joinedAt: "2023-01-01" }
];

// Helper to get users from localStorage
export const getLocalUsers = () => {
  const usersStr = localStorage.getItem('invito-users');
  if (usersStr) return JSON.parse(usersStr);
  
  // Default mock user
  const defaultUsers = [{ name: "Demo User", email: "demo@invito.com", password: "demo123" }];
  localStorage.setItem('invito-users', JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const registerMockUser = (user: any) => {
  const users = getLocalUsers();
  users.push(user);
  localStorage.setItem('invito-users', JSON.stringify(users));
};
