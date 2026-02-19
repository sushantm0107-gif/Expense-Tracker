import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useNavigate } from 'react-router';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { toast } from 'sonner';

const INCOME_SOURCES = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'business', label: 'Business' },
  { value: 'investment', label: 'Investment' },
  { value: 'rental', label: 'Rental' },
  { value: 'gift', label: 'Gift' },
  { value: 'refund', label: 'Refund' },
  { value: 'other_income', label: 'Other' },
];

export function AddExpense() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  const { categories } = useCategories();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category_id: '',
    income_source: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: '',
    notes: '',
    type: 'expense' as 'expense' | 'income',
    status: 'completed' as 'completed' | 'pending',
  });

  const handleTypeChange = (newType: 'expense' | 'income') => {
    setFormData({ ...formData, type: newType, category_id: '', income_source: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    // For income, prepend the income source to notes for storage
    const incomeSourceLabel = formData.type === 'income' && formData.income_source
      ? `[${INCOME_SOURCES.find(s => s.value === formData.income_source)?.label ?? formData.income_source}] `
      : '';

    const { error } = await addTransaction({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category_id: formData.type === 'expense' ? (formData.category_id || null) : null,
      date: formData.date,
      payment_method: formData.payment_method || null,
      notes: formData.notes ? `${incomeSourceLabel}${formData.notes}` : (incomeSourceLabel || null),
      type: formData.type,
      status: formData.status,
    });

    if (error) {
      toast.error('Failed to add transaction: ' + error);
    } else {
      toast.success(formData.type === 'income' ? 'Income added successfully!' : 'Expense added successfully!');
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Add Transaction</h1>
        <p className="text-gray-600">Record a new expense or income transaction.</p>
      </div>

      <div className="bg-white rounded-lg p-8 border border-border shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type toggle */}
          <div>
            <Label>Transaction Type</Label>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-2 rounded-lg font-medium text-sm border transition-colors ${formData.type === 'expense'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                  }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-2 rounded-lg font-medium text-sm border transition-colors ${formData.type === 'income'
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                  }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Grocery Shopping"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          <div>
            {formData.type === 'expense' ? (
              <>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select expense category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="none" disabled>No categories — add some first</SelectItem>
                    ) : (
                      categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <>
                <Label htmlFor="income_source">Income Source</Label>
                <Select
                  value={formData.income_source}
                  onValueChange={(value) => setFormData({ ...formData, income_source: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select income source" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_SOURCES.map(src => (
                      <SelectItem key={src.value} value={src.value}>{src.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>

          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="payment">Payment Method</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as 'completed' | 'pending' })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-2 resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? 'Saving...' : formData.type === 'income' ? 'Add Income' : 'Add Expense'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
