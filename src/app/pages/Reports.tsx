import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Download } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';

export function Reports() {
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { transactions, loading } = useTransactions();
  const { categories } = useCategories();

  // Filter transactions by category
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (t.type !== 'expense') return false;
      if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
      return true;
    });
  }, [transactions, categoryFilter]);

  // Build chart data based on timeFilter
  const chartData = useMemo(() => {
    const groups: Record<string, number> = {};
    filtered.forEach(t => {
      const d = new Date(t.date);
      let key = '';
      if (timeFilter === 'weekly') {
        const weekNum = Math.ceil(d.getDate() / 7);
        key = `${d.toLocaleString('en', { month: 'short' })} W${weekNum}`;
      } else if (timeFilter === 'monthly') {
        key = d.toLocaleString('en', { month: 'short', year: '2-digit' });
      } else {
        key = d.getFullYear().toString();
      }
      groups[key] = (groups[key] ?? 0) + t.amount;
    });
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount: parseFloat(amount.toFixed(2)) }));
  }, [filtered, timeFilter]);

  // Stats
  const totalTransactions = filtered.length;
  const avgDaily = useMemo(() => {
    if (!filtered.length) return 0;
    const days = new Set(filtered.map(t => t.date)).size;
    const total = filtered.reduce((s, t) => s + t.amount, 0);
    return days > 0 ? total / days : 0;
  }, [filtered]);

  const highestExpenseDay = useMemo(() => {
    const dayTotals: Record<string, number> = {};
    filtered.forEach(t => { dayTotals[t.date] = (dayTotals[t.date] ?? 0) + t.amount; });
    const sorted = Object.entries(dayTotals).sort(([, a], [, b]) => b - a);
    if (!sorted.length) return { date: '—', amount: 0 };
    return { date: new Date(sorted[0][0]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), amount: sorted[0][1] };
  }, [filtered]);

  // Export CSV
  const handleExport = () => {
    const header = 'Date,Title,Category,Amount,Type,Status,Payment Method\n';
    const rows = filtered.map(t =>
      `"${t.date}","${t.title}","${t.category?.name ?? ''}","${t.amount}","${t.type}","${t.status}","${t.payment_method ?? ''}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Analyze your spending patterns and trends.</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <span className="text-sm text-gray-500 pb-2">Filters apply automatically</span>
          </div>
        </div>
      </div>

      {/* Spending Over Time Chart */}
      <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Over Time</h3>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center text-gray-400">Loading...</div>
        ) : chartData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-gray-400">No expense data for this filter</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ fill: '#4F46E5', r: 4 }}
                activeDot={{ r: 6 }}
                name="Amount ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
          <h4 className="text-sm text-gray-600 mb-1">Average Daily Spend</h4>
          <p className="text-3xl font-semibold text-gray-900">${avgDaily.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
          <h4 className="text-sm text-gray-600 mb-1">Highest Expense Day</h4>
          <p className="text-3xl font-semibold text-gray-900">${highestExpenseDay.amount.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">{highestExpenseDay.date}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
          <h4 className="text-sm text-gray-600 mb-1">Total Transactions</h4>
          <p className="text-3xl font-semibold text-gray-900">{totalTransactions}</p>
        </div>
      </div>

      {/* Spending Insights */}
      <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Insights</h3>
        <div className="space-y-4">
          {avgDaily > 200 ? (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-1">⚠️ Alert</h4>
              <p className="text-sm text-amber-800">Your average daily spend is ${avgDaily.toFixed(2)}. Consider reviewing your budget.</p>
            </div>
          ) : (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-1">✨ Great Job!</h4>
              <p className="text-sm text-green-800">Your average daily spend is ${avgDaily.toFixed(2)}. You're being financially responsible!</p>
            </div>
          )}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-1">💡 Tip</h4>
            <p className="text-sm text-blue-800">Use the Export button to download your transaction data as a CSV and analyze it in Excel or Google Sheets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
