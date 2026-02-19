import { useState, useEffect, useCallback } from 'react';
import { supabase, Profile } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at'>>) => {
        if (!user) return { error: 'Not logged in' };
        const { error } = await supabase.from('profiles').upsert({ id: user.id, ...updates });
        if (!error) await fetchProfile();
        return { error: error?.message ?? null };
    };

    const changePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return { error: error?.message ?? null };
    };

    const deleteAccount = async () => {
        // Delete profile data first, then sign out (actual user deletion requires service role)
        if (!user) return;
        await supabase.from('transactions').delete().eq('user_id', user.id);
        await supabase.from('categories').delete().eq('user_id', user.id);
        await supabase.from('profiles').delete().eq('id', user.id);
        await supabase.auth.signOut();
    };

    return { profile, loading, updateProfile, changePassword, deleteAccount, refetch: fetchProfile };
}
