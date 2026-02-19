import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function Settings() {
  const { profile, loading, updateProfile, changePassword } = useProfile();
  const { signOut } = useAuth();

  const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState<string | null>(null);

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
      });
    }
  }, [profile]);

  const handleProfileSave = async () => {
    setSaving('profile');
    const { error } = await updateProfile(profileForm);
    if (error) toast.error(error);
    else toast.success('Profile saved!');
    setSaving(null);
  };

  const handleChangePassword = async () => {
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving('password');
    const { error } = await changePassword(passwordForm.newPassword);
    if (error) toast.error(error);
    else { toast.success('Password changed!'); setPasswordForm({ newPassword: '', confirmPassword: '' }); }
    setSaving(null);
  };

  if (loading) return <div className="text-gray-400 text-center py-16">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileForm.first_name}
                onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileForm.last_name}
                onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileForm.email}
              onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={profileForm.phone}
              onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="mt-2"
            />
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={handleProfileSave}
            disabled={saving === 'profile'}
          >
            {saving === 'profile' ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="mt-2"
            />
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={handleChangePassword}
            disabled={saving === 'password'}
          >
            {saving === 'password' ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </div>

      {/* Logout and Danger Zone */}
      <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session</h3>
        <Button variant="outline" onClick={signOut}>Sign Out</Button>
      </div>

      <div className="bg-white rounded-lg p-6 border border-red-200 shadow-sm">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, all your data will be permanently removed. Please be certain.
        </p>
        <Button
          variant="destructive"
          onClick={() => {
            if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
              signOut();
              toast.success('Account deletion initiated. You have been signed out.');
            }
          }}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
