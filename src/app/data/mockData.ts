export interface Transaction {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number;
  status: 'completed' | 'pending';
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  totalSpent: number;
  color: string;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
}

export const categories: Category[] = [
  { id: '1', name: 'Food', icon: 'UtensilsCrossed', totalSpent: 2450, color: '#4F46E5' },
  { id: '2', name: 'Travel', icon: 'Plane', totalSpent: 1820, color: '#06b6d4' },
  { id: '3', name: 'Bills', icon: 'Receipt', totalSpent: 3200, color: '#8b5cf6' },
  { id: '4', name: 'Shopping', icon: 'ShoppingBag', totalSpent: 1560, color: '#f59e0b' },
  { id: '5', name: 'Entertainment', icon: 'Film', totalSpent: 890, color: '#10b981' },
  { id: '6', name: 'Health', icon: 'Heart', totalSpent: 1200, color: '#ef4444' },
  { id: '7', name: 'Education', icon: 'GraduationCap', totalSpent: 2100, color: '#f97316' },
  { id: '8', name: 'Other', icon: 'MoreHorizontal', totalSpent: 680, color: '#6366f1' },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    date: '2026-02-18',
    title: 'Grocery Shopping',
    category: 'Food',
    amount: -85.50,
    status: 'completed',
    type: 'expense'
  },
  {
    id: '2',
    date: '2026-02-18',
    title: 'Freelance Project',
    category: 'Income',
    amount: 2500.00,
    status: 'completed',
    type: 'income'
  },
  {
    id: '3',
    date: '2026-02-17',
    title: 'Netflix Subscription',
    category: 'Bills',
    amount: -15.99,
    status: 'completed',
    type: 'expense'
  },
  {
    id: '4',
    date: '2026-02-17',
    title: 'Uber Ride',
    category: 'Travel',
    amount: -22.30,
    status: 'completed',
    type: 'expense'
  },
  {
    id: '5',
    date: '2026-02-16',
    title: 'Online Course',
    category: 'Education',
    amount: -149.00,
    status: 'pending',
    type: 'expense'
  },
  {
    id: '6',
    date: '2026-02-16',
    title: 'Restaurant',
    category: 'Food',
    amount: -65.20,
    status: 'completed',
    type: 'expense'
  },
  {
    id: '7',
    date: '2026-02-15',
    title: 'Salary Deposit',
    category: 'Income',
    amount: 4500.00,
    status: 'completed',
    type: 'income'
  },
  {
    id: '8',
    date: '2026-02-15',
    title: 'Gym Membership',
    category: 'Health',
    amount: -50.00,
    status: 'completed',
    type: 'expense'
  },
  {
    id: '9',
    date: '2026-02-14',
    title: 'Shopping - Clothes',
    category: 'Shopping',
    amount: -120.00,
    status: 'completed',
    type: 'expense'
  },
  {
    id: '10',
    date: '2026-02-14',
    title: 'Electricity Bill',
    category: 'Bills',
    amount: -95.50,
    status: 'completed',
    type: 'expense'
  },
];

export const monthlyExpenses: MonthlyExpense[] = [
  { month: 'Jan', amount: 3200 },
  { month: 'Feb', amount: 2800 },
  { month: 'Mar', amount: 3500 },
  { month: 'Apr', amount: 2900 },
  { month: 'May', amount: 3800 },
  { month: 'Jun', amount: 3100 },
  { month: 'Jul', amount: 4200 },
  { month: 'Aug', amount: 3600 },
  { month: 'Sep', amount: 3300 },
  { month: 'Oct', amount: 3900 },
  { month: 'Nov', amount: 3400 },
  { month: 'Dec', amount: 4100 },
];

export const categoryDistribution = [
  { name: 'Food', value: 2450, fill: '#4F46E5' },
  { name: 'Travel', value: 1820, fill: '#06b6d4' },
  { name: 'Bills', value: 3200, fill: '#8b5cf6' },
  { name: 'Shopping', value: 1560, fill: '#f59e0b' },
  { name: 'Other', value: 890, fill: '#10b981' },
];

export const spendingOverTime = [
  { date: 'Week 1', amount: 850 },
  { date: 'Week 2', amount: 920 },
  { date: 'Week 3', amount: 780 },
  { date: 'Week 4', amount: 1100 },
  { date: 'Week 5', amount: 950 },
  { date: 'Week 6', amount: 870 },
  { date: 'Week 7', amount: 1050 },
  { date: 'Week 8', amount: 990 },
];
