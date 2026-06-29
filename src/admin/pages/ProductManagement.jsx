import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import * as Icons from '../components/Icons';

export const ProductManagement = ({ showToast }) => {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(ShopContext);

  // Layout View State
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const initialFormState = {
    name: '',
    description: '',
    shortDescription: '',
    images: [], // array of image urls or data URIs
    category: 'Silk',
    subCategory: 'Brocade',
    fabricType: 'Banarasi',
    brand: 'Rama Fabrics Private Label',
    material: '100% Organic Silk',
    pattern: 'Intricate Paisley',
    color: 'Crimson Gold',
    width: '44 Inches',
    length: '1 Meter',
    weight: '120 GSM',
    price: '',
    discountPrice: '',
    gst: '5',
    stock: '',
    minimumStock: '5',
    stockStatus: 'In Stock',
    sku: '',
    tags: '',
    featured: false,
    bestSeller: false,
    newArrival: false,
    published: true,
  };

  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // File Drag & Drop State
  const [dragActive, setDragActive] = useState(false);

  // Categories list derived from context
  const categoriesList = ['All', 'Silk', 'Cotton', 'Handloom', 'Georgette', 'Ready-to-Wear'];

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Drag & Drop Image uploads
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newImages = [...form.images];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push(event.target.result);
        setForm(prev => ({ ...prev, images: newImages }));
      };
      reader.readAsDataURL(file);
    });
    
    showToast(`${files.length} image(s) uploaded successfully!`, 'success');
  };

  const removeImage = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Product name is required';
    if (!form.sku.trim()) errors.sku = 'SKU identifier is required';
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) errors.price = 'Valid price is required';
    if (!form.stock || isNaN(form.stock) || parseInt(form.stock) < 0) errors.stock = 'Valid stock is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please check the form for errors', 'error');
      return;
    }

    const priceNum = parseFloat(form.price);
    const discPriceNum = form.discountPrice ? parseFloat(form.discountPrice) : undefined;
    const stockNum = parseInt(form.stock);
    const minStockNum = parseInt(form.minimumStock);

    // Auto update status based on stock level if In Stock / Low Stock is set
    let computedStockStatus = form.stockStatus;
    if (stockNum === 0) {
      computedStockStatus = 'Out of Stock';
    } else if (stockNum <= minStockNum && computedStockStatus === 'In Stock') {
      computedStockStatus = 'Low Stock';
    }

    const tagsArray = typeof form.tags === 'string' 
      ? form.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') 
      : form.tags;

    const fallbackImage = form.images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

    const cleanProduct = {
      ...form,
      price: priceNum,
      originalPrice: discPriceNum, // Map discountPrice to originalPrice for compatibility with customer storefront schema
      stock: stockNum,
      minimumStock: minStockNum,
      stockStatus: computedStockStatus,
      tags: tagsArray,
      image: fallbackImage, // Ensure main compatibility field
      updatedAt: new Date().toISOString(),
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...cleanProduct,
        id: editingProduct.id
      });
      showToast(`Product "${form.name}" updated!`, 'success');
    } else {
      addProduct({
        ...cleanProduct,
        createdAt: new Date().toISOString(),
      });
      showToast(`Product "${form.name}" added to catalog!`, 'success');
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(initialFormState);
  };

  // Edit action
  const handleEditClick = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name || '',
      description: prod.description || '',
      shortDescription: prod.shortDescription || '',
      images: prod.images && prod.images.length > 0 ? prod.images : [prod.image].filter(Boolean),
      category: prod.category || 'Silk',
      subCategory: prod.subCategory || '',
      fabricType: prod.fabricType || '',
      brand: prod.brand || '',
      material: prod.material || '',
      pattern: prod.pattern || '',
      color: prod.color || '',
      width: prod.width || '',
      length: prod.length || '',
      weight: prod.weight || '',
      price: prod.price || '',
      discountPrice: prod.originalPrice || '', // map originalPrice from customer schema
      gst: prod.gst || '5',
      stock: prod.stock !== undefined ? prod.stock : '',
      minimumStock: prod.minimumStock !== undefined ? prod.minimumStock : '5',
      stockStatus: prod.stockStatus || 'In Stock',
      sku: prod.sku || '',
      tags: prod.tags ? prod.tags.join(', ') : '',
      featured: prod.featured || false,
      bestSeller: prod.bestSeller || false,
      newArrival: prod.newArrival || false,
      published: prod.published !== undefined ? prod.published : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Duplicate action
  const handleDuplicateClick = (prod) => {
    setEditingProduct(null);
    const newSku = (prod.sku || '') + '-COPY-' + Math.floor(100 + Math.random() * 900);
    setForm({
      name: `${prod.name} (Copy)`,
      description: prod.description || '',
      shortDescription: prod.shortDescription || '',
      images: prod.images && prod.images.length > 0 ? prod.images : [prod.image].filter(Boolean),
      category: prod.category || 'Silk',
      subCategory: prod.subCategory || '',
      fabricType: prod.fabricType || '',
      brand: prod.brand || '',
      material: prod.material || '',
      pattern: prod.pattern || '',
      color: prod.color || '',
      width: prod.width || '',
      length: prod.length || '',
      weight: prod.weight || '',
      price: prod.price || '',
      discountPrice: prod.originalPrice || '',
      gst: prod.gst || '5',
      stock: prod.stock || '10',
      minimumStock: prod.minimumStock || '5',
      stockStatus: prod.stockStatus || 'In Stock',
      sku: newSku,
      tags: prod.tags ? prod.tags.join(', ') : '',
      featured: prod.featured || false,
      bestSeller: prod.bestSeller || false,
      newArrival: prod.newArrival || false,
      published: prod.published !== undefined ? prod.published : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
    showToast(`Duplicated details from "${prod.name}"`, 'info');
  };

  // Open delete confirm
  const handleDeleteClick = (prod) => {
    setProductToDelete(prod);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      showToast(`Product "${productToDelete.name}" deleted from catalog`, 'success');
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  // Filtering Logic
  const filteredProducts = products.filter(prod => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (prod.sku && prod.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      prod.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || prod.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      const isPublished = prod.published !== false;
      matchesStatus = statusFilter === 'Published' ? isPublished : !isPublished;
    }

    const matchesStock = stockStatusFilter === 'All' || prod.stockStatus === stockStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Fabric Catalog</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and edit your online store items and categories.</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setForm(initialFormState);
            setFormErrors({});
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-100"
        >
          <Icons.PlusIcon className="w-5 h-5" />
          <span>Add New Fabric</span>
        </button>
      </div>

      {/* Filter / Search Bar Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products by name, category, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <Icons.SearchIcon className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>

          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="All">All Stocks</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="price-low">Sort by: Price Low</option>
            <option value="price-high">Sort by: Price High</option>
            <option value="name-asc">Sort by: Name A-Z</option>
          </select>

          {/* Toggle View */}
          <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50/50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table View"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main content viewport */}
      {paginatedProducts.length > 0 ? (
        viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left">
                <thead className="bg-slate-50/50">
                  <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Texture</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">SKU / Code</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-100 overflow-hidden flex-shrink-0">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900 block leading-tight">{prod.name}</span>
                        <span className="text-xs text-slate-400 mt-1 block">{prod.fabricType} • {prod.material}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500 whitespace-nowrap">
                        {prod.sku || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">₹{prod.price}</span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        <span className={prod.stock <= prod.minimumStock ? 'text-red-600' : 'text-slate-700'}>
                          {prod.stock} {prod.category === 'Ready-to-Wear' ? 'pcs' : 'm'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          prod.stockStatus === 'In Stock' ? 'bg-emerald-50 text-emerald-700' :
                          prod.stockStatus === 'Low Stock' ? 'bg-amber-50 text-amber-700' :
                          prod.stockStatus === 'Out of Stock' ? 'bg-red-50 text-red-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {prod.stockStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(prod)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Icons.EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDuplicateClick(prod)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                            title="Duplicate"
                          >
                            <Icons.DuplicateIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(prod)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Icons.DeleteIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="h-48 bg-slate-100 relative overflow-hidden group">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  {/* Stock tag overlay */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    prod.stockStatus === 'In Stock' ? 'bg-emerald-500 text-white' :
                    prod.stockStatus === 'Low Stock' ? 'bg-amber-500 text-white' :
                    prod.stockStatus === 'Out of Stock' ? 'bg-red-500 text-white' :
                    'bg-slate-500 text-white'
                  }`}>
                    {prod.stockStatus}
                  </span>
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="p-2 bg-white text-slate-800 rounded-xl shadow-lg hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <Icons.EditIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDuplicateClick(prod)}
                      className="p-2 bg-white text-slate-800 rounded-xl shadow-lg hover:text-slate-600 transition-colors"
                      title="Duplicate"
                    >
                      <Icons.DuplicateIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(prod)}
                      className="p-2 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Icons.DeleteIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">{prod.category}</span>
                    <h5 className="font-bold text-slate-800 text-sm mt-1 line-clamp-1">{prod.name}</h5>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prod.description}</p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-slate-800 text-sm">₹{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Stock: {prod.stock}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* EMPTY STATE */
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
          <span className="text-4xl">🔎</span>
          <h3 className="font-bold text-slate-800 text-lg mt-4">No Products Found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">We couldn't find any fabrics matching your filters or search query.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('All');
              setStockStatusFilter('All');
            }}
            className="mt-6 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm text-sm">
          <span className="text-slate-500">
            Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredProducts.length} items total)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-xl font-semibold transition-all ${page === currentPage ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* DETAILED CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingProduct ? 'Edit Fabric Specifications' : 'Add New Fabric Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <Icons.CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: General details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="e.g. Royal Indigo Banarasi Brocade Silk"
                      required
                    />
                    {formErrors.name && <span className="text-red-500 text-xs font-semibold mt-1 block">{formErrors.name}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SKU ID *</label>
                      <input
                        type="text"
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                        placeholder="e.g. SILK-BAN-ROY-01"
                        required
                      />
                      {formErrors.sku && <span className="text-red-500 text-xs font-semibold mt-1 block">{formErrors.sku}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">GST Percentage</label>
                      <select
                        name="gst"
                        value={form.gst}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="0">0% Exempt</option>
                        <option value="5">5% Standard Fabric</option>
                        <option value="12">12% Luxury Apparel</option>
                        <option value="18">18% Prints & Synth</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="Silk">Silk</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Handloom">Handloom</option>
                        <option value="Georgette">Georgette</option>
                        <option value="Ready-to-Wear">Ready-to-Wear</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sub Category</label>
                      <input
                        type="text"
                        name="subCategory"
                        value={form.subCategory}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Brocade / Linen"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fabric Type</label>
                      <input
                        type="text"
                        name="fabricType"
                        value={form.fabricType}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Banarasi / Mangalagiri"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Material / Composition</label>
                      <input
                        type="text"
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. 100% Pure Mulberry Silk"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pattern / Style</label>
                      <input
                        type="text"
                        name="pattern"
                        value={form.pattern}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Floral Jaal / Plain Woven"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Color Name</label>
                      <input
                        type="text"
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Royal Teal Gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Width</label>
                      <input
                        type="text"
                        name="width"
                        value={form.width}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. 44 Inches"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Length Unit</label>
                      <input
                        type="text"
                        name="length"
                        value={form.length}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. 1 Meter / pc"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Weight / GSM</label>
                      <input
                        type="text"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. 110 GSM"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing, Inventory & Images */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sale Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        step="0.01"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="350"
                        required
                      />
                      {formErrors.price && <span className="text-red-500 text-xs font-semibold mt-1 block">{formErrors.price}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Struck Price / Original (₹)</label>
                      <input
                        type="number"
                        name="discountPrice"
                        value={form.discountPrice}
                        onChange={handleChange}
                        step="0.01"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Initial Qty *</label>
                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="45"
                        required
                      />
                      {formErrors.stock && <span className="text-red-500 text-xs font-semibold mt-1 block">{formErrors.stock}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Min Warning Qty</label>
                      <input
                        type="number"
                        name="minimumStock"
                        value={form.minimumStock}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock Status</label>
                      <select
                        name="stockStatus"
                        value={form.stockStatus}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Discontinued">Discontinued</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Description</label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={form.shortDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Catchy brief description displayed on list items..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Detailed composition details, care advice, styling recommendations..."
                    />
                  </div>

                  {/* Drag & Drop File uploads */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Fabric Images</label>
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                        dragActive ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      <Icons.UploadIcon className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-xs text-slate-600 mt-2 font-medium">Drag & Drop product photos here or</p>
                      <label className="inline-block mt-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer">
                        Browse Files
                        <input type="file" multiple className="hidden" onChange={handleFileInput} accept="image/*" />
                      </label>
                    </div>

                    {/* Images Previews list */}
                    {form.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
                        {form.images.map((img, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 group">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Icons.CloseIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Extra details (Tags, Flags) */}
              <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search Tags (Comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="silk, raw silk, red, festive, banarasi"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5"
                    />
                    <span className="text-sm font-semibold text-slate-700">Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="bestSeller"
                      checked={form.bestSeller}
                      onChange={handleChange}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5"
                    />
                    <span className="text-sm font-semibold text-slate-700">Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="newArrival"
                      checked={form.newArrival}
                      onChange={handleChange}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5"
                    />
                    <span className="text-sm font-semibold text-slate-700">New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      checked={form.published}
                      onChange={handleChange}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5"
                    />
                    <span className="text-sm font-semibold text-slate-700">Published (Visible)</span>
                  </label>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-slate-100 pt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-100"
                >
                  {editingProduct ? 'Save Product Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM POPUP */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-6 animate-scale-up">
            <h3 className="font-bold text-slate-900 text-lg">Confirm Delete</h3>
            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-100 transition-all"
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
