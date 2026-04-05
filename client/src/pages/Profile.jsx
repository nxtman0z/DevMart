import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiUser, HiMail, HiGlobe, HiPencil } from 'react-icons/hi';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { userAPI } from '../api/endpoints';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      website: user?.website || '',
      github: user?.github || '',
      twitter: user?.twitter || '',
    },
  });

  const { register: registerPw, handleSubmit: handlePwSubmit, reset: resetPw } = useForm();

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { data: res } = await userAPI.updateProfile(data);
      setUser(res.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await userAPI.changePassword(data);
      toast.success('Password changed!');
      resetPw();
      setChangingPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 fade-in">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      {/* Profile Card */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-xl font-bold overflow-hidden">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-muted">{user?.email}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${user?.role === 'seller' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
              {user?.role}
            </span>
          </div>
          <button onClick={() => setEditing(!editing)} className="ml-auto btn-secondary text-sm">
            <HiPencil /> {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input className="input-field" {...register('name')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea className="input-field min-h-[80px] resize-none" {...register('bio')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input className="input-field" placeholder="https://..." {...register('website')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub</label>
                <input className="input-field" placeholder="https://github.com/..." {...register('github')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Twitter</label>
                <input className="input-field" placeholder="https://twitter.com/..." {...register('twitter')} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            {user?.bio && <p className="text-sm text-muted">{user.bio}</p>}
            <div className="flex gap-3">
              {user?.website && <a href={user.website} target="_blank" className="flex items-center gap-1 text-sm text-muted hover:text-primary"><HiGlobe /> Website</a>}
              {user?.github && <a href={user.github} target="_blank" className="flex items-center gap-1 text-sm text-muted hover:text-primary"><FaGithub /> GitHub</a>}
              {user?.twitter && <a href={user.twitter} target="_blank" className="flex items-center gap-1 text-sm text-muted hover:text-primary"><FaTwitter /> Twitter</a>}
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Change Password</h3>
          <button onClick={() => setChangingPassword(!changingPassword)} className="text-sm text-primary hover:text-primary-light">
            {changingPassword ? 'Cancel' : 'Change'}
          </button>
        </div>
        {changingPassword && (
          <form onSubmit={handlePwSubmit(onPasswordSubmit)} className="space-y-4">
            <input type="password" className="input-field" placeholder="Current password" {...registerPw('currentPassword', { required: true })} />
            <input type="password" className="input-field" placeholder="New password (min 6 chars)" {...registerPw('newPassword', { required: true, minLength: 6 })} />
            <button type="submit" className="btn-primary text-sm">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
}
