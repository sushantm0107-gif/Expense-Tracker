import { useState, useEffect, useCallback } from 'react';
import { supabase, Category } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from './useTransactions';

export interface CategoryWithSpend extends Category {
    totalSpent: number;
}

export function useCategories() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const { transactions } = useTransactions();

    const fetchCategories = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at');
        setCategories(data ?? []);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const addCategory = async (cat: { name: string; icon: string; color: string }) => {
        if (!user) return { error: 'Not logged in' };
        const { error } = await supabase.from('categories').insert({ ...cat, user_id: user.id });
        if (!error) await fetchCategories();
        return { error: error?.message ?? null };
    };

    const updateCategory = async (id: string, updates: Partial<Pick<Category, 'name' | 'icon' | 'color'>>) => {
        const { error } = await supabase.from('categories').update(updates).eq('id', id);
        if (!error) await fetchCategories();
        return { error: error?.message ?? null };
    };

    const deleteCategory = async (id: string) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (!error) await fetchCategories();
        return { error: error?.message ?? null };
    };

    // Enrich with real totalSpent from transactions
    const categoriesWithSpend: CategoryWithSpend[] = categories.map(cat => ({
        ...cat,
        totalSpent: transactions
            .filter(t => t.type === 'expense' && t.category_id === cat.id)
            .reduce((s, t) => s + t.amount, 0),
    }));

    return { categories: categoriesWithSpend, loading, addCategory, updateCategory, deleteCategory, refetch: fetchCategories };
}
