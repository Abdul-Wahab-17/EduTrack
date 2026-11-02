import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Edit the signed-in user's name, bio and picture URL (saved through the API, then reloaded into the auth context).
export default function ProfileModal({ onClose }) {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    displayName: user.displayName || user.username || '',
    bio: user.bio || '',
    profilePic: user.profilePic || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const input = 'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Edit profile">
      <form onSubmit={save} className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800">Edit profile</h2>
        <label className="mt-4 block text-sm font-medium text-gray-700">Name
          <input name="displayName" value={form.displayName} onChange={change} required maxLength={100} className={input} />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700">Bio
          <textarea name="bio" value={form.bio} onChange={change} rows={3} maxLength={2000} className={input} />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-700">Picture URL
          <input name="profilePic" type="url" value={form.profilePic} onChange={change} placeholder="https://…" className={input} />
        </label>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md border border-gray-300 px-4 py-2 text-gray-700">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
