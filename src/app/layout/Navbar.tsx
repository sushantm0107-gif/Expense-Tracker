import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

export function Navbar() {
  const { user } = useAuth();
  const { profile } = useProfile();

  const displayName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : user?.email?.split('@')[0] ?? 'User';

  const displayEmail = user?.email ?? '';

  return (
    <header className="h-16 bg-white border-b border-border fixed top-0 left-64 right-0 z-10">
      <div className="h-full px-8 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{displayEmail}</p>
          </div>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
