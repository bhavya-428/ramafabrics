import React, { createContext, useState, useEffect, useMemo } from 'react';

export const ShopContext = createContext();

// Dynamic generator for 100 realistic fabric types with clean stock photos
const generateProducts = () => {
  const categories = ['Cotton', 'Silk', 'Linen', 'Rayon', 'Muslin', 'Organza', 'Chiffon', 'Velvet', 'Embroidery', 'Printed Fabrics', 'Dress Materials'];
  
  const adjectives = [
    'Royal', 'Traditional', 'Contemporary', 'Artisanal', 'Exquisite', 
    'Premium', 'Classic', 'Vibrant', 'Elegant', 'Artistic', 
    'Vintage', 'Luxury', 'Sleek', 'Ethnic', 'Handwoven'
  ];
  
  const types = {
    'Silk': ['Banarasi Brocade', 'Batik Dye Silk', 'Tussar Raw Silk', 'Kanchipuram Silk', 'Chanderi Silk', 'Mysore Soft Crepe'],
    'Cotton': ['Mangalagiri Zari Cotton', 'Jaipuri Block Print', 'Kalamkari Handblock', 'Lakhnavi Chikankari', 'Organic Khadi', 'Mulmul Cotton'],
    'Linen': ['Pure Linen', 'Linen Blend', 'Printed Linen', 'Linen Zari'],
    'Rayon': ['Rayon Crepe', 'Rayon Slub', 'Soft Rayon'],
    'Muslin': ['Pure Muslin', 'Printed Muslin', 'Muslin Silk'],
    'Organza': ['Pure Organza', 'Tissue Organza', 'Organza Embroidery'],
    'Chiffon': ['Pure Chiffon', 'Printed Chiffon', 'Chiffon Zari'],
    'Velvet': ['Micro Velvet', 'Crushed Velvet', 'Velvet Sequence'],
    'Embroidery': ['Thread Work', 'Zari Work', 'Sequence Work'],
    'Printed Fabrics': ['Digital Print', 'Block Print', 'Floral Print'],
    'Dress Materials': ['Unstitched Suit Set', 'Kurti Material', 'Lehenga Fabric']
  };

  const colors = [
    { name: 'Crimson Maroon', gradient: 'linear-gradient(135deg, #800020 0%, #D4AF37 100%)' },
    { name: 'Emerald Green', gradient: 'linear-gradient(135deg, #0B4A3A 0%, #C5A059 100%)' },
    { name: 'Indigo Blue', gradient: 'linear-gradient(135deg, #0f2b5c 0%, #84d9ce 100%)' },
    { name: 'Mustard Gold', gradient: 'linear-gradient(135deg, #C5A059 0%, #7D1D2B 100%)' },
    { name: 'Lavender Mist', gradient: 'linear-gradient(135deg, #E6E6FA 0%, #9370DB 100%)' },
    { name: 'Royal Plum', gradient: 'linear-gradient(135deg, #4B0082 0%, #FF69B4 100%)' },
    { name: 'Coral Rose', gradient: 'linear-gradient(135deg, #FF7F50 0%, #FFE4E1 100%)' },
    { name: 'Turquoise Teal', gradient: 'linear-gradient(135deg, #008080 0%, #AFEEEE 100%)' },
    { name: 'Charcoal Black', gradient: 'linear-gradient(135deg, #2F4F4F 0%, #778899 100%)' },
    { name: 'Rust Orange', gradient: 'linear-gradient(135deg, #8B0000 0%, #FF8C00 100%)' },
    { name: 'Peach Cream', gradient: 'linear-gradient(135deg, #FFDAB9 0%, #FFEFD5 100%)' },
    { name: 'Sage Olive', gradient: 'linear-gradient(135deg, #556B2F 0%, #BDB76B 100%)' }
  ];

  // A pool of high-quality Unsplash image IDs matching each fabric category (ONLY pure fabric textures)
  const unsplashImageIds = {
    'Silk': [
      '1618005182384-a83a8bd57fbe',
      '1574169208507-84376144848b',
      '1513519245088-0e12902e5a38',
      '1548036328-c9fa89d128fa'
    ],
    'Cotton': [
      '1606744824163-985d376605aa',
      '1597484211616-396f17ed1997',
      '1528459801416-a9e53bbf4e17'
    ],
    'Linen': ['1598048145874-f9566c3a270a', '1620799140408-edc6dcb6d633'],
    'Rayon': ['1579783900882-c0d3dad7b119'],
    'Muslin': ['1528459801416-a9e53bbf4e17'],
    'Organza': ['1588854337236-6889d631faa8'],
    'Chiffon': ['1543087903-1ac2ec7aa8c5'],
    'Velvet': ['1621600411688-4be93cd68504', '1609144415840-0de31cd85172'],
    'Embroidery': ['1544816155-12df9643f363'],
    'Printed Fabrics': ['1563245372-f21724e3856d'],
    'Dress Materials': ['1596462502278-27bfdc403348']
  };

  const results = [];
  
  for (let i = 1; i <= 100; i++) {
    const category = categories[i % categories.length];
    const adj = adjectives[Math.floor((i * 7) % adjectives.length)];
    const subTypes = types[category];
    const type = subTypes[Math.floor((i * 3) % subTypes.length)];
    const colorObj = colors[Math.floor((i * 11) % colors.length)];
    
    const name = `${adj} ${type} (${colorObj.name})`;
    const price = Math.floor(150 + ((i * 13) % 450)); // Price between 150 and 600 per meter, or higher for RTW
    const actualPrice = category === 'Ready-to-Wear' ? price * 3.5 : price; // Kurti sets cost more
    
    // Determine if this item is on offer (low cost markdown) - about 33% of items are on offer
    const isOnOffer = i % 3 === 0;
    const originalPrice = isOnOffer ? Math.round(actualPrice * 1.25 + 20) : undefined;
    
    const stock = Math.floor(5 + ((i * 17) % 85)); // stock between 5 and 90
    
    const rating = parseFloat((4.0 + ((i * 3) % 11) / 10).toFixed(1));
    const isFeatured = i % 10 === 0; // 10 featured items

    // Select photo from unsplash pool
    const idList = unsplashImageIds[category];
    const photoId = idList[Math.floor((i * 5) % idList.length)];
    const image = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=600&q=80`;

    results.push({
      id: `p${i}`,
      name,
      category,
      price: Math.round(actualPrice),
      originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
      stock,
      description: `Premium grade ${colorObj.name} ${category} fabric, featuring a beautiful ${type} texture. Exquisite weave and skin-friendly quality, sourced directly from certified weavers. Suitable for custom styling, designer suits, sarees, or ethnic celebrations.`,
      colorPattern: colorObj.gradient,
      image,
      rating,
      isFeatured
    });
  }
  
  results.push(
    {
      id: 'spotlight1',
      name: 'Midnight Velvet Elegance',
      category: 'Velvet',
      price: 1850,
      originalPrice: 2200,
      stock: 12,
      description: 'Experience the soft touch of our premium micro velvet. Handcrafted for elegance and luxury.',
      colorPattern: 'linear-gradient(135deg, #2F4F4F 0%, #000000 100%)',
      image: 'https://images.unsplash.com/photo-1621600411688-4be93cd68504?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      isFeatured: true
    },
    {
      id: 'spotlight2',
      name: 'Banarasi Silk Heritage',
      category: 'Silk',
      price: 3400,
      originalPrice: 4000,
      stock: 5,
      description: 'Handwoven pure silk that defines royal luxury. A masterpiece of Banarasi weaving tradition.',
      colorPattern: 'linear-gradient(135deg, #800020 0%, #D4AF37 100%)',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      isFeatured: true
    }
  );

  return results;
};

const initialProducts = generateProducts();

const initialOffers = [
  {
    id: 'o1',
    code: 'RAMA10',
    discount: 10,
    type: 'percentage',
    minPurchase: 500,
    description: 'Get 10% OFF on all fabrics! Minimum order value ₹500.'
  },
  {
    id: 'o2',
    code: 'FESTIVE100',
    discount: 100,
    type: 'flat',
    minPurchase: 1000,
    description: 'Flat ₹100 OFF on orders above ₹1000.'
  },
  {
    id: 'o3',
    code: 'WELCOME50',
    discount: 50,
    type: 'flat',
    minPurchase: 0,
    description: 'Flat ₹50 OFF for all new users! No minimum purchase required.'
  }
];

const initialHeroBanners = [
  {
    id: 'hb1',
    image: 'https://bridalandtuxedogalleria.com/wp-content/uploads/2026/02/bridal-dress-1024x683.jpg',
    tag: 'PREMIUM COLLECTION',
    title: 'WEDDING FABRICS',
    subtitle: 'Exclusive fabrics for your special moments'
  },
  {
    id: 'hb2',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL41P5M0MtQ7Rfnhy9cmjOxWNgMT2Lh_QHS1YFjInsZ3qbrYgVl1a7bWPi&s=10',
    tag: 'NEW ARRIVALS',
    title: 'PURE SILK ELEGANCE',
    subtitle: 'Discover our latest Banarasi collection'
  },
  {
    id: 'hb3',
    image: 'https://image.made-in-china.com/203f0j00efrowRqgLAkO/Breathable-Cotton-High-Quality-Shirt-Fabric.webp',
    tag: 'SUMMER ESSENTIALS',
    title: 'BREATHABLE COTTONS',
    subtitle: 'Stay cool with our handblock prints'
  },
  {
    id: 'hb4',
    image: 'https://saroj.in/cdn/shop/files/WhatsAppImage2023-05-08at12.02.37PM.jpg?v=1774244198',
    tag: 'DESIGNER CHOICE',
    title: 'FLORAL ORGANZA',
    subtitle: 'Perfect for contemporary drapes'
  }
];

const initialSettings = {
  storeName: 'Rama Fabrics',
  storeAddress: '40-26/1-14, Brindavan Colony, Sriram Nagar, Vijayawada, Andhra Pradesh 520010',
  phone: '96188 96169',
  whatsapp: '919618896169', // digits only with country code
  upiId: 'ramafabrics@okaxis',
  merchantName: 'Rama Fabrics',
  hours: '10:00 AM - 9:30 PM',
  heroTitle: 'Vijayawada\'s Premier Destination for Exquisite Clothing & Fabrics',
  heroSubtitle: 'Sourced from the finest handloom and contemporary textile weavers across India since 2022.',
  heroImage: '' // Fallback to CSS styled banner if empty
};

const initialCategories = [
  { id: 'cat_1', name: 'Silk', isEnabled: true },
  { id: 'cat_2', name: 'Cotton', isEnabled: true },
  { id: 'cat_3', name: 'Linen', isEnabled: true },
  { id: 'cat_4', name: 'Rayon', isEnabled: true },
  { id: 'cat_5', name: 'Muslin', isEnabled: true },
  { id: 'cat_6', name: 'Organza', isEnabled: true },
  { id: 'cat_7', name: 'Chiffon', isEnabled: true },
  { id: 'cat_8', name: 'Velvet', isEnabled: true },
  { id: 'cat_9', name: 'Embroidery', isEnabled: true },
  { id: 'cat_10', name: 'Printed Fabrics', isEnabled: true },
  { id: 'cat_11', name: 'Dress Materials', isEnabled: true },
  { id: 'cat_12', name: 'Ready-to-Wear', isEnabled: true }
];

export const ShopProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Database States loaded from LocalStorage or seeded with initial data
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('rf_products_v2');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialProducts;
  });

  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem('rf_offers');
    return saved ? JSON.parse(saved) : initialOffers;
  });

  const [heroBanners, setHeroBanners] = useState(() => {
    const saved = localStorage.getItem('rf_hero_banners');
    return saved ? JSON.parse(saved) : initialHeroBanners;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('rf_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.whatsapp === '918977001696') {
        parsed.whatsapp = '919618896169';
        parsed.phone = '96188 96169';
        localStorage.setItem('rf_settings', JSON.stringify(parsed));
      }
      return parsed;
    }
    return initialSettings;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('rf_orders');
    if (saved) {
      let parsed = JSON.parse(saved);
      // Migration: Add statusHistory to older orders
      parsed = parsed.map(o => {
        if (!o.statusHistory) {
          const history = [{ status: 'Pending Payment', timestamp: o.createdAt }];
          if (o.status !== 'Pending Payment') {
             history.push({ status: o.status, timestamp: o.createdAt });
          }
          return { ...o, statusHistory: history };
        }
        return o;
      });
      return parsed;
    }
    return [];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('rf_users');
    return saved ? JSON.parse(saved) : []; // Array of { email, password, isAdmin, name }
  });

  const [inventoryLogs, setInventoryLogs] = useState(() => {
    const saved = localStorage.getItem('rf_inventory_logs');
    return saved ? JSON.parse(saved) : []; // Array of stock movement logs
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('rf_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('rf_reviews');
    return saved ? JSON.parse(saved) : []; // Array of { id, productId, orderId, userId, userName, rating, comment, date }
  });

  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem('rf_pages');
    return saved ? JSON.parse(saved) : {
      about: { title: 'About Us', content: 'Welcome to Rama Fabrics. We bring the finest handloom textiles straight from the weavers to you.' },
      privacy: { title: 'Privacy Policy', content: 'Your privacy is important to us. We do not share your data.' },
      refund: { title: 'Refund Policy', content: 'We offer a 7-day return policy for unused fabrics.' },
      terms: { title: 'Terms & Conditions', content: 'By using this site, you agree to our terms of service.' },
      shipping: { title: 'Shipping Policy', content: 'Orders are shipped within 2-3 business days.' }
    };
  });

  const [faqs, setFaqs] = useState(() => {
    const saved = localStorage.getItem('rf_faqs');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', question: 'Do you offer international shipping?', answer: 'Currently, we only ship within India.' },
      { id: 'f2', question: 'How can I track my order?', answer: 'Once your order is shipped, you will receive a tracking link via WhatsApp/Email.' }
    ];
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('rf_announcements');
    return saved ? JSON.parse(saved) : [
    ];
  });

  // Client Session States
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rf_current_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email === 'v.bhavyasri2001@gmail.com' && parsed.name === 'Store Owner') {
        parsed.name = 'v.bhavyasri2001';
        localStorage.setItem('rf_current_user', JSON.stringify(parsed));
      }
      return parsed;
    }
    return null;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('rf_cart');
    return saved ? JSON.parse(saved) : []; // Array of { product, quantity }
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('rf_wishlist');
    return saved ? JSON.parse(saved) : []; // Array of product IDs
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('rf_recently_viewed');
    return saved ? JSON.parse(saved) : []; // Array of product IDs
  });

  const [activeCoupon, setActiveCoupon] = useState(null);

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('rf_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rf_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('rf_hero_banners', JSON.stringify(heroBanners));
  }, [heroBanners]);

  useEffect(() => {
    localStorage.setItem('rf_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('rf_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('rf_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('rf_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('rf_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rf_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('rf_inventory_logs', JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  useEffect(() => {
    localStorage.setItem('rf_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('rf_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('rf_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rf_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rf_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('rf_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // --- CART OPERATIONS ---
  const addToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        // Limit quantity to available stock
        const newQty = Math.min(existing.quantity + qty, product.stock);
        return prevCart.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { product, quantity: Math.min(qty, product.stock) }];
    });
  };

  const updateCartQty = (productId, qty) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    setCart((prevCart) => {
      if (qty <= 0) {
        return prevCart.filter(item => item.product.id !== productId);
      }
      const boundedQty = Math.min(qty, product.stock);
      return prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity: boundedQty } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  // --- WISHLIST OPERATIONS ---
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const addToRecentlyViewed = (productId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10); // Keep last 10 viewed
    });
  };

  // Calculate totals
  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartDiscount = () => {
    const subtotal = getCartSubtotal();
    if (!activeCoupon) return 0;
    if (subtotal < activeCoupon.minPurchase) return 0;

    if (activeCoupon.type === 'percentage') {
      return Math.round((subtotal * activeCoupon.discount) / 100);
    } else {
      return activeCoupon.discount;
    }
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getCartDiscount();
    return Math.max(0, subtotal - discount);
  };

  const applyCoupon = (code) => {
    const match = offers.find(o => o.code.toUpperCase() === code.toUpperCase());
    if (!match) return { success: false, message: 'Invalid coupon code.' };
    
    const subtotal = getCartSubtotal();
    if (subtotal < match.minPurchase) {
      return { success: false, message: `Minimum purchase of ₹${match.minPurchase} required.` };
    }

    setActiveCoupon(match);
    return { success: true, message: `Coupon "${match.code}" applied successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  // --- ORDER CREATION ---
  const placeOrder = (shippingInfo, paymentMethod) => {
    const subtotal = getCartSubtotal();
    const discount = getCartDiscount();
    const total = getCartTotal();
    const orderId = 'RF-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      id: orderId,
      items: [...cart],
      shippingInfo,
      paymentMethod,
      subtotal,
      discount,
      total,
      couponApplied: activeCoupon ? activeCoupon.code : null,
      status: 'Pending Payment',
      statusHistory: [{ status: 'Pending Payment', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      userEmail: currentUser ? currentUser.email : shippingInfo.email
    };

    // Decrement stock for ordered items and generate logs
    const logs = [];
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        const orderItem = cart.find(item => item.product.id === prod.id);
        if (orderItem) {
          return { ...prod, stock: Math.max(0, prod.stock - orderItem.quantity) };
        }
        return prod;
      })
    );
    
    cart.forEach(item => {
      const product = products.find(p => p.id === item.product.id);
      if (product) {
        logs.push({
          id: 'log-' + Date.now() + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString(),
          productId: product.id,
          productName: product.name,
          prevStock: product.stock,
          qtyChange: -item.quantity,
          newStock: Math.max(0, product.stock - item.quantity),
          actionType: 'Order Placed',
          user: currentUser ? currentUser.email : shippingInfo.email
        });
      }
    });
    if (logs.length > 0) {
      setInventoryLogs(prev => [...logs, ...prev].slice(0, 1000));
    }

    // Save order
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    
    // Clear cart
    clearCart();

    return newOrder;
  };

  // --- AUTH OPERATIONS ---
  const signup = (name, email, password) => {
    const trimmedEmail = email.toLowerCase().trim();
    const existing = users.find(u => u.email === trimmedEmail);
    if (existing) return { success: false, message: 'Email already exists.' };

    // The very first user to signup becomes Admin
    const isAdmin = users.length === 0;

    const newUser = { name, email: trimmedEmail, password, isAdmin };
    setUsers(prev => [...prev, newUser]);
    
    const userSession = { name, email: trimmedEmail, isAdmin };
    setCurrentUser(userSession);
    return { success: true, message: isAdmin ? 'Admin account created successfully!' : 'Account created successfully!' };
  };

  const login = (email, password) => {
    const trimmedEmail = email.toLowerCase().trim();
    // Default hardcoded admin fallback for ease of access if users array is empty
    if (trimmedEmail === 'v.bhavyasri2001@gmail.com' && password === '123456') {
      const adminSession = { name: 'v.bhavyasri2001', email: trimmedEmail, isAdmin: true };
      setCurrentUser(adminSession);
      return { success: true, message: 'Logged in as Admin successfully!' };
    }

    const user = users.find(u => u.email === trimmedEmail && u.password === password);
    if (!user) return { success: false, message: 'Invalid email or password.' };

    const userSession = { name: user.name, email: user.email, isAdmin: user.isAdmin };
    setCurrentUser(userSession);
    return { success: true, message: 'Logged in successfully!' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- ADMIN CONFIGURATION OPERATIONS ---
  const addProduct = (newProd) => {
    const id = 'p-' + Math.floor(1000 + Math.random() * 9000);
    setProducts(prev => [{ ...newProd, id, rating: 5.0 }, ...prev]);
  };

  const updateProduct = (updatedProd) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addOffer = (newOffer) => {
    const id = 'o-' + Math.floor(1000 + Math.random() * 9000);
    setOffers(prev => [{ ...newOffer, id }, ...prev]);
  };

  const updateOffer = (updatedOffer) => {
    setOffers(prev => prev.map(o => o.id === updatedOffer.id ? updatedOffer : o));
  };

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    let orderToCancel = null;
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        if ((newStatus === 'Cancelled' || newStatus === 'Rejected') && 
            order.status !== 'Cancelled' && order.status !== 'Rejected' &&
            order.status !== 'Shipped' && order.status !== 'Delivered') {
           orderToCancel = order;
        }
        const history = order.statusHistory ? [...order.statusHistory] : [];
        history.push({ status: newStatus, timestamp: new Date().toISOString() });
        return { ...order, status: newStatus, statusHistory: history };
      }
      return order;
    }));

    // Restore stock if the order was just cancelled/rejected
    if (orderToCancel) {
       const logs = [];
       setProducts(prevProducts => 
         prevProducts.map(prod => {
           const orderItem = orderToCancel.items.find(item => item.product.id === prod.id);
           if (orderItem) {
             return { ...prod, stock: prod.stock + orderItem.quantity };
           }
           return prod;
         })
       );
       
       orderToCancel.items.forEach(item => {
         const product = products.find(p => p.id === item.product.id);
         if (product) {
           logs.push({
              id: 'log-' + Date.now() + Math.random().toString(36).substr(2, 5),
              timestamp: new Date().toISOString(),
              productId: product.id,
              productName: product.name,
              prevStock: product.stock,
              qtyChange: item.quantity,
              newStock: product.stock + item.quantity,
              actionType: 'Order ' + newStatus,
              user: currentUser ? currentUser.name : 'System'
           });
         }
       });
       if (logs.length > 0) {
         setInventoryLogs(prev => [...logs, ...prev].slice(0, 1000));
       }
    }
  };

  const updateProductStock = (productId, qtyChange, actionType = 'Manual Restock') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const prevStock = product.stock;
    const newStock = Math.max(0, prevStock + qtyChange); // Prevent negative stock

    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));

    const log = {
      id: 'log-' + Date.now() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      productId,
      productName: product.name,
      prevStock,
      qtyChange: newStock - prevStock, // Actual change (accounts for bounds)
      newStock,
      actionType,
      user: currentUser ? currentUser.name : 'Admin'
    };
    setInventoryLogs(prev => [log, ...prev].slice(0, 1000));
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  // Helper: Create UPI payment URL
  // Format: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=INR
  const getUpiUrl = (order) => {
    const cleanUpi = encodeURIComponent(settings.upiId);
    const cleanName = encodeURIComponent(settings.merchantName);
    const amount = order.total;
    return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${amount}&cu=INR&tn=Order%20${order.id}`;
  };

  // Helper: Create WhatsApp message text for notification
  const getWhatsAppLink = (order) => {
    const itemsText = order.items.map(item => 
      `• ${item.product.name} x ${item.quantity} ${item.product.category === 'Ready-to-Wear' ? 'pc' : 'meters'} (₹${item.product.price}/${item.product.category === 'Ready-to-Wear' ? 'pc' : 'm'})`
    ).join('\n');

    const message = `*NEW ORDER FROM RAMA FABRICS storefront*
----------------------------------------
*Order ID:* ${order.id}
*Customer:* ${order.shippingInfo.name}
*WhatsApp:* ${order.shippingInfo.whatsapp}
*Address:* ${order.shippingInfo.address}, ${order.shippingInfo.city} - ${order.shippingInfo.pincode}
----------------------------------------
*Items Ordered:*
${itemsText}
----------------------------------------
*Subtotal:* ₹${order.subtotal}
*Discount:* ₹${order.discount} ${order.couponApplied ? `(Coupon: ${order.couponApplied})` : ''}
*Total Paid:* ₹${order.total}
*Payment Method:* UPI QR
----------------------------------------
_I have completed the payment via UPI. Please confirm my order!_`;

    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${settings.whatsapp}?text=${encodedText}`;
  };
  // --- Dynamic Computed Properties ---
  const newArrivals = useMemo(() => {
    // Top 12 latest products (assuming array order or we can just reverse)
    return [...products].reverse().slice(0, 12);
  }, [products]);

  const bestSellers = useMemo(() => {
    const salesCount = {};
    orders.forEach(order => {
      if (order.status !== 'Cancelled' && order.status !== 'Pending Payment') {
        order.items.forEach(item => {
          if (!salesCount[item.product.id]) salesCount[item.product.id] = 0;
          salesCount[item.product.id] += item.quantity;
        });
      }
    });

    return [...products]
      .map(p => ({ ...p, unitsSold: salesCount[p.id] || 0 }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 12);
  }, [products, orders]);

  return (
    <ShopContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        products,
        newArrivals,
        bestSellers,
        offers,
        heroBanners,
        setHeroBanners,
        orders,
        settings,
        setSettings,
        pages,
        setPages,
        faqs,
        setFaqs,
        announcements,
        setAnnouncements,
        currentUser,
        cart,
        wishlist,
        activeCoupon,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        getCartSubtotal,
        getCartDiscount,
        getCartTotal,
        applyCoupon,
        removeCoupon,
        placeOrder,
        signup,
        login,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        addOffer,
        updateOffer,
        deleteOffer,
        updateOrderStatus,
        updateSettings,
        getUpiUrl,
        getWhatsAppLink,
        users,
        setUsers,
        recentlyViewed,
        addToRecentlyViewed,
        inventoryLogs,
        updateProductStock,
        categories,
        setCategories,
        reviews,
        setReviews
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
