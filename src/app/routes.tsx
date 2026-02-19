import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddExpense } from './pages/AddExpense';
import { Categories } from './pages/Categories';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { useAuth } from './context/AuthContext';
import type { JSX } from 'react';

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Loading...
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

export const router = createBrowserRouter([
    {
        path: '/login',
        Component: Login,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, Component: Dashboard },
            { path: 'add-expense', Component: AddExpense },
            { path: 'categories', Component: Categories },
            { path: 'reports', Component: Reports },
            { path: 'settings', Component: Settings },
        ],
    },
]);
