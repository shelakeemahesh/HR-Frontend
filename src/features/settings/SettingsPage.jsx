import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';
import { useToast } from '@/shared/hooks/useToast';
import { cn } from '@/shared/utils/cn';
import { ROLES } from '@/config/constants';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <button type="button" onClick={() => onChange(!checked)} className={cn('relative w-11 h-6 rounded-full transition-colors', checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600')}>
        <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', checked && 'translate-x-5')} />
      </button>
    </label>
  );
}

const accentColors = [
  { name: 'Indigo', value: '#4F46E5' }, { name: 'Blue', value: '#2563EB' },
  { name: 'Purple', value: '#7C3AED' }, { name: 'Green', value: '#059669' },
  { name: 'Orange', value: '#D97706' }, { name: 'Red', value: '#DC2626' },
];

export default function SettingsPage() {
  const role = useAuthStore((s) => s.role);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '+1 (555) 234-5017',
    location: user?.location || 'San Francisco, CA',
    bio: user?.bio || '',
    avatar: user?.avatar || null
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [twoFA, setTwoFA] = useState(false);
  const [accent, setAccent] = useState('#4F46E5');
  const [notifPrefs, setNotifPrefs] = useState({ leave: true, payroll: true, performance: true, newEmployee: true, system: true, weekly: false });
  const [leavePolicy, setLeavePolicy] = useState([
    { type: 'Annual', quota: 12, maxConsec: 10, carryForward: true },
    { type: 'Sick', quota: 6, maxConsec: 5, carryForward: false },
    { type: 'Casual', quota: 3, maxConsec: 2, carryForward: false },
    { type: 'Maternity', quota: 90, maxConsec: 90, carryForward: false },
  ]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
        toast.info('Photo loaded. Click "Save Changes" to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      avatar: profile.avatar,
    });
    toast.success('Profile updated successfully!');
  };

  const tabs = [
    { label: 'Profile', icon: '👤' }, { label: 'Account', icon: '🔐' },
    { label: 'Appearance', icon: '🎨' }, { label: 'Notifications', icon: '🔔' },
    ...(role === ROLES.ADMIN ? [{ label: 'Leave Policy', icon: '📋' }] : []),
  ];

  const pwStrength = () => {
    const p = passwords.new;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: 'bg-red-500', w: 'w-1/3' };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Medium', color: 'bg-amber-500', w: 'w-2/3' };
    return { label: 'Strong', color: 'bg-emerald-500', w: 'w-full' };
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card variant="solid" padding="sm" className="lg:col-span-1">
          <div className="space-y-1 p-2">
            {tabs.map((t, i) => (
              <button key={t.label} onClick={() => setTab(i)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left', tab === i ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile */}
          {tab === 0 && (
            <Card variant="solid" padding="lg">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
              <div className="flex items-center gap-4 mb-6">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary-500" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl font-bold text-primary-600">{profile.firstName.charAt(0)}{profile.lastName.charAt(0)}</div>
                )}
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['First Name', 'firstName'], ['Last Name', 'lastName'], ['Phone', 'phone'], ['Location', 'location']].map(([label, key]) => (
                  <div key={key}><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label><input value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" /></div>
                ))}
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label><textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Tell us about yourself..." /></div>
              </div>
              <Button variant="primary" className="mt-4" onClick={handleSave}>Save Changes</Button>
            </Card>
          )}

          {/* Account */}
          {tab === 1 && (
            <Card variant="solid" padding="lg">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h2>
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input value={user?.email || ''} readOnly className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 cursor-not-allowed" /></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Change Password</h3>
              <div className="space-y-3 max-w-sm">
                {[['Current Password', 'current'], ['New Password', 'new'], ['Confirm Password', 'confirm']].map(([label, key]) => (
                  <div key={key}><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label><input type="password" value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" /></div>
                ))}
                {pwStrength() && (
                  <div><div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={cn('h-full rounded-full transition-all', pwStrength().color, pwStrength().w)} /></div><p className="text-xs mt-1 text-gray-500">{pwStrength().label}</p></div>
                )}
                <Button variant="primary" onClick={() => toast.success('Password updated!')}>Update Password</Button>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Toggle checked={twoFA} onChange={setTwoFA} label="Two-Factor Authentication" />
                <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
              </div>
            </Card>
          )}

          {/* Appearance */}
          {tab === 2 && (
            <Card variant="solid" padding="lg">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{isDark ? '🌙' : '☀️'}</span>
                    <div><p className="font-medium text-gray-900 dark:text-white">{isDark ? 'Dark Mode' : 'Light Mode'}</p><p className="text-xs text-gray-500">Toggle between light and dark theme</p></div>
                  </div>
                  <button onClick={toggleTheme} className={cn('relative w-14 h-8 rounded-full transition-colors', isDark ? 'bg-primary-600' : 'bg-gray-300')}>
                    <span className={cn('absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform', isDark && 'translate-x-6')} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Accent Color</h3>
              <div className="flex gap-3">
                {accentColors.map(c => (
                  <button key={c.value} onClick={() => { setAccent(c.value); toast.info(`Accent color: ${c.name}`); }} className={cn('w-10 h-10 rounded-xl transition-all', accent === c.value ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'hover:scale-105')} style={{ backgroundColor: c.value }} title={c.name} />
                ))}
              </div>
            </Card>
          )}

          {/* Notifications */}
          {tab === 3 && (
            <Card variant="solid" padding="lg">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[['leave', 'Leave Notifications'], ['payroll', 'Payroll Alerts'], ['performance', 'Performance Reviews'], ['newEmployee', 'New Employee Joined'], ['system', 'System Updates'], ['weekly', 'Weekly Summary Email']].map(([key, label]) => (
                  <Toggle key={key} checked={notifPrefs[key]} onChange={v => setNotifPrefs(p => ({ ...p, [key]: v }))} label={label} />
                ))}
              </div>
              <Button variant="primary" className="mt-6" onClick={() => toast.success('Preferences saved!')}>Save Preferences</Button>
            </Card>
          )}

          {/* Leave Policy (Admin) */}
          {tab === 4 && role === ROLES.ADMIN && (
            <Card variant="solid" padding="lg">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Leave Policy Configuration</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left border-b border-gray-200 dark:border-gray-700"><th className="pb-2 font-medium text-gray-500">Type</th><th className="pb-2 font-medium text-gray-500">Quota/Year</th><th className="pb-2 font-medium text-gray-500">Max Consecutive</th><th className="pb-2 font-medium text-gray-500">Carry Forward</th></tr></thead>
                  <tbody>
                    {leavePolicy.map((lp, i) => (
                      <tr key={lp.type} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 font-medium text-gray-900 dark:text-white">{lp.type}</td>
                        <td className="py-3"><input type="number" value={lp.quota} onChange={e => { const v = [...leavePolicy]; v[i].quota = +e.target.value; setLeavePolicy(v); }} className="w-20 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" /></td>
                        <td className="py-3"><input type="number" value={lp.maxConsec} onChange={e => { const v = [...leavePolicy]; v[i].maxConsec = +e.target.value; setLeavePolicy(v); }} className="w-20 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white" /></td>
                        <td className="py-3"><Toggle checked={lp.carryForward} onChange={v => { const p = [...leavePolicy]; p[i].carryForward = v; setLeavePolicy(p); }} label="" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="primary" className="mt-4" onClick={() => toast.success('Leave policy saved!')}>Save Policy</Button>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
