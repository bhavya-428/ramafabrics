import React, { useState, useEffect } from 'react';
import * as Icons from '../components/Icons';

export const CategoryManagement = ({ showToast }) => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('rf_categories');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'cat1', name: 'Silk', description: 'Premium luxury mulberry silks, Banarasi weaves, and Batik dyes.', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=300&q=80', order: 1, status: 'Active', parent: 'None' },
      { id: 'cat2', name: 'Cotton', description: 'Soft breathable Block prints, Lakhnavi Chikankari, and daily wear cottons.', image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=300&q=80', order: 2, status: 'Active', parent: 'None' },
      { id: 'cat3', name: 'Handloom', description: 'Authentic Indian artisanal handwoven linen, Pochampally, and Ikats.', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80', order: 3, status: 'Active', parent: 'None' },
      { id: 'cat4', name: 'Georgette', description: 'Elegant flowy georgettes, bandhanis, and floral chiffon prints.', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=300&q=80', order: 4, status: 'Active', parent: 'None' },
      { id: 'cat5', name: 'Ready-to-Wear', description: 'Premium designer suite sets, Kurtis, and ethnic sherwanis.', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80', order: 5, status: 'Active', parent: 'None' }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('rf_categories', JSON.stringify(categories));
  }, [categories]);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const initialFormState = {
    name: '',
    description: '',
    image: '',
    order: '1',
    status: 'Active',
    parent: 'None'
  };

  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Image upload check
  const handleImageInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
      showToast('Category image uploaded!', 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Category name is required.');
      return;
    }

    const orderNum = parseInt(form.order) || 1;
    const finalImage = form.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80';

    const cleanCategory = {
      ...form,
      order: orderNum,
      image: finalImage
    };

    if (editingCategory) {
      setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? { ...cleanCategory, id: cat.id } : cat));
      showToast(`Category "${form.name}" updated!`, 'success');
    } else {
      const id = 'cat-' + Math.floor(1000 + Math.random() * 9000);
      setCategories(prev => [...prev, { ...cleanCategory, id }]);
      showToast(`Category "${form.name}" created!`, 'success');
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    setForm(initialFormState);
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      order: cat.order?.toString() || '1',
      status: cat.status || 'Active',
      parent: cat.parent || 'None'
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      showToast(`Category "${categoryToDelete.name}" deleted!`, 'success');
      setIsDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Category Manager</h2>
          <p className="text-sm text-slate-500 mt-1">Organize catalog navigation, parent relationships, and filter parameters.</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setForm(initialFormState);
            setError('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-100"
        >
          <Icons.PlusIcon className="w-5 h-5" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="h-40 bg-slate-100 relative">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                cat.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
              }`}>
                {cat.status}
              </span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-slate-900/60 text-white px-2 py-0.5 rounded-full">
                Display Order: {cat.order}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-base">{cat.name}</h4>
                <p className="text-xs text-slate-400 mt-1">Parent: <strong className="text-slate-600">{cat.parent}</strong></p>
                <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">{cat.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 text-xs font-semibold">
                <button
                  onClick={() => handleEditClick(cat)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(cat)}
                  className="px-3.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 animate-scale-up overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingCategory ? 'Modify Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <Icons.CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</div>}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Linen Fabrics"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe items in this category..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Parent Category</label>
                  <select
                    name="parent"
                    value={form.parent}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="None">None (Root Category)</option>
                    {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Cover Image</label>
                  <label className="w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl py-2.5 cursor-pointer text-xs font-bold text-slate-700 transition-colors">
                    Browse File
                    <input type="file" className="hidden" onChange={handleImageInput} accept="image/*" />
                  </label>
                </div>
              </div>

              {form.image && (
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Image Preview</span>
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-5 mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-100"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-6 animate-scale-up">
            <h3 className="font-bold text-slate-900 text-lg">Delete Category</h3>
            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to delete category <strong>"{categoryToDelete?.name}"</strong>? Products in this category will not be deleted but their category field will remain.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
