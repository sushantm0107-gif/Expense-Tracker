import { useState, useEffect, useCallback } from 'react';
import { supabase, Transaction } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useTransactions() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('transactions')
            .select('*, category:categories(id, name, icon, color)')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        if (error) setError(error.message);
        else setTransactions(data as Transaction[]);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = async (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'category'>) => {
        if (!user) return { error: 'Not logged in' };
        const { error } = await supabase.from('transactions').insert({ ...tx, user_id: user.id });
        if (!error) await fetchTransactions();
        return { error: error?.message ?? null };
    };

    const deleteTransaction = async (id: string) => {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (!error) await fetchTransactions();
        return { error: error?.message ?? null };
    };

    // Aggregated helpers
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    // Monthly data for bar chart  (current year)
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(0, i).toLocaleString('en', { month: 'short' });
        const amount = transactions
            .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === i)
            .reduce((s, t) => s + t.amount, 0);
        return { month, amount };
    });

    // Category distribution for pie chart
    const categoryMap: Record<string, { name: string; value: number; fill: string }> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        const name = t.category?.name ?? 'Other';
        const fill = t.category?.color ?? '#6366f1';
        if (!categoryMap[name]) categoryMap[name] = { name, value: 0, fill };
        categoryMap[name].value += t.amount;
    });
    const categoryDistribution = Object.values(categoryMap);

    return {
        transactions,
        loading,
        error,
        addTransaction,
        deleteTransaction,
        refetch: fetchTransactions,
        totalIncome,
        totalExpenses,
        balance,
        monthlyData,
        categoryDistribution,
    };
}
