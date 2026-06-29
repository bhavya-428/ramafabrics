import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import * as Icons from '../components/Icons';

export const AdminProfile = ({ showToast }) => {
  const { currentUser, setUsers, users } = useContext(ShopContext);

  const [form, setForm] = useState({
    name: currentUser?.name || 'Bhavyasri',
    email: currentUser?.email || 'v.bhavyasri2001@gmail.com',
    role: 'Senior Store Manager',
    bio: 'Overseeing local showroom operations, online client orders dispatch schedules, and premium handwoven fabrics acquisitions since 2023.',
    avatar: '',
    notifyOrders: true,
    notifyStock: true
  });

  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAvatarFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleAvatarFile(e.target.files[0]);
    }
  };

  const handleAvatarFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setForm(prev => ({ ...prev, avatar: event.target.result }));
      showToast('Avatar preview updated!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    // Sync current session name
    if (currentUser) {
      currentUser.name = form.name;
      localStorage.setItem('rf_current_user', JSON.stringify(currentUser));
    }
    
    // Also update users array in localStorage
    setUsers(prev => prev.map(u => u.email === form.email ? { ...u, name: form.name } : u));
    
    showToast('Administrator profile successfully updated!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Profile</h2>
        <p className="text-sm text-slate-500 mt-1">Configure administrator contact details, display avatars, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Avatar Drag & Drop card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <h4 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 mb-5 w-full text-left">Display Avatar</h4>

          {/* Drag & drop box */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative w-36 h-36 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
              dragActive ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 hover:border-indigo-400'
            }`}
          >
            {form.avatar ? (
              <img src={form.avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <Icons.ProfileIcon className="w-8 h-8 mx-auto text-slate-300" />
                <span className="text-[10px] text-slate-400 block mt-1">Drag Avatar</span>
              </div>
            )}
          </div>

          <div className="mt-5 w-full">
            <label className="w-full block text-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl py-2 cursor-pointer text-xs font-bold text-slate-700 transition-colors">
              Upload Avatar File
              <input type="file" className="hidden" onChange={handleFileInput} accept="image/*" />
            </label>
            <p className="text-[9px] text-slate-400 mt-2">Allows PNG, JPG. Max weight: 2MB.</p>
          </div>
        </div>

        {/* Right Details input Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 mb-5">Administrator Profile Details</h4>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation / Role</label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">System Login Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                className="w-full px-4 py-2.5 border border-slate-100 bg-slate-50 text-slate-400 font-semibold cursor-not-allowed text-sm focus:outline-none"
                readOnly
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Account logins require this email for verification.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Biography</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Notification switch options */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Notification Preferences</h5>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyOrders"
                  checked={form.notifyOrders}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5"
                />
                <span className="text-xs text-slate-600 font-semibold">Notify me on WhatsApp for new customer orders placement</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyStock"
                  checked={form.notifyStock}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5"
                />
                <span className="text-xs text-slate-600 font-semibold">Notify me on low stock alert updates</span>
              </label>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-100"
              >
                Update profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
