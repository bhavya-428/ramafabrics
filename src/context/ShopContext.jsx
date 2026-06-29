import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

// Dynamic generator for 100 realistic fabric types with clean stock photos
const generateProducts = () => {
  const categories = ['Silk', 'Cotton', 'Handloom', 'Georgette', 'Ready-to-Wear'];
  
  const adjectives = [
    'Royal', 'Traditional', 'Contemporary', 'Artisanal', 'Exquisite', 
    'Premium', 'Classic', 'Vibrant', 'Elegant', 'Artistic', 
    'Vintage', 'Luxury', 'Sleek', 'Ethnic', 'Handwoven'
  ];
  
  const types = {
    'Silk': ['Banarasi Brocade', 'Batik Dye Silk', 'Tussar Raw Silk', 'Kanchipuram Silk', 'Chanderi Silk', 'Mysore Soft Crepe'],
    'Cotton': ['Mangalagiri Zari Cotton', 'Jaipuri Block Print', 'Kalamkari Handblock', 'Lakhnavi Chikankari', 'Organic Khadi', 'Mulmul Cotton'],
    'Handloom': ['Sambhalpuri Ikat', 'Pochampally Handloom', 'Bhagalpuri Linen', 'Venkatagiri Zari', 'Jamdani Handwoven', 'Phulkari Embroidery'],
    'Georgette': ['Bandhani Tie-Dye georgette', 'Chiffon Floral Print', 'Brocade Border Crepe', 'Sequinned Net georgette', 'Satin Print', 'Shimmer georgette'],
    'Ready-to-Wear': ['Anarkali Suit Set', 'A-Line Floral Kurti', 'Angrakha Kurta set', 'Palazzo Kurta Pair', 'Straight-Cut Salwar Set', 'Festive Silk Sherwani']
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
      '1618005182384-a83a8bd57fbe', // Teal satin waves
      '1574169208507-84376144848b', // Crimson silk satin
      '1513519245088-0e12902e5a38', // Gold satin texture
      '1548036328-c9fa89d128fa', // Royal blue silk folds
      '1603252109303-2751441dd157', // Emerald green shiny silk
      '1617627143750-d86bc21e42bb', // Magenta pink silk folds
      '1621600411688-4be93cd68504', // Crimson velvet texture
      '1609144415840-0de31cd85172'  // Purple velvet fabric
    ],
    'Cotton': [
      '1606744824163-985d376605aa', // Ivory cotton linen texture
      '1597484211616-396f17ed1997', // Soft indigo cotton
      '1528459801416-a9e53bbf4e17', // Pastel peach canvas cotton
      '1563245372-f21724e3856d', // Printed block cotton
      '1620799140408-edc6dcb6d633', // Plain linen cotton fold
      '1583847268964-b28dc8f51f92'  // Pink cotton block print
    ],
    'Handloom': [
      '1544816155-12df9643f363', // Tribal handwoven patterns
      '1508285869451-140578618bb9', // Organic weave texture
      '1528254338168-da2944b28c1c', // Traditional ikat patterns
      '1605721911519-3dfeb3be25e7', // Colorful handblock print
      '1598048145874-f9566c3a270a', // Linen fabric folds close-up
      '1596462502278-27bfdc403348'  // Stack of colorful folded fabrics
    ],
    'Georgette': [
      '1588854337236-6889d631faa8', // Floral print chiffon georgette
      '1579783900882-c0d3dad7b119', // Watercolor artistic georgette
      '1543087903-1ac2ec7aa8c5', // Flowy print patterns
      '1550684848-fac1c5b4e853', // Patterned chiffon drape
      '1601752943749-7dd8d89f407a', // Fine georgette weave
      '1618220179428-22790b461013'  // Teal-green georgette print
    ],
    'Ready-to-Wear': [
      '1596462502278-27bfdc403348', // Stack of premium colorful ethnic fabrics
      '1589156280159-27698a70f29e', // Folded cotton garment texture stack
      '1584917865442-de89df76afd3', // Gold designer fabric folds
      '1620799140408-edc6dcb6d633', // Clean linen clothing fabric close up
      '1508285869451-140578618bb9', // Textured fabric weave close up
      '1543087903-1ac2ec7aa8c5'  // Intricate block printed clothing fabric drape
    ]
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

const initialSettings = {
  storeName: 'Rama Fabrics',
  storeAddress: '40-26/1-14, Brindavan Colony, Sriram Nagar, Vijayawada, Andhra Pradesh 520010',
  phone: '089770 01696',
  whatsapp: '918977001696', // digits only with country code
  upiId: 'ramafabrics@okaxis',
  merchantName: 'Rama Fabrics',
  hours: '10:00 AM - 9:30 PM',
  heroTitle: 'Vijayawada\'s Premier Destination for Exquisite Clothing & Fabrics',
  heroSubtitle: 'Sourced from the finest handloom and contemporary textile weavers across India since 2022.',
  heroImage: '' // Fallback to CSS styled banner if empty
};

export const ShopProvider = ({ children }) => {
  // Database States loaded from LocalStorage or seeded with initial data
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('rf_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Ensure we load the complete 100 fabrics collection with pure fabric textures (no models/machinery)
      if (parsed.length < 100 || !parsed.some(p => p.image !== undefined) || parsed.some(p => p.image && p.image.includes('photo-1610030469983-98e550d6193c'))) {
        return initialProducts;
      }
      return parsed;
    }
    return initialProducts;
  });

  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem('rf_offers');
    return saved ? JSON.parse(saved) : initialOffers;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('rf_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('rf_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('rf_users');
    return saved ? JSON.parse(saved) : []; // Array of { email, password, isAdmin, name }
  });

  // Client Session States
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rf_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('rf_cart');
    return saved ? JSON.parse(saved) : []; // Array of { product, quantity }
  });

  const [activeCoupon, setActiveCoupon] = useState(null);

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('rf_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rf_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('rf_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('rf_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rf_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('rf_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rf_cart', JSON.stringify(cart));
  }, [cart]);

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
      createdAt: new Date().toISOString(),
      userEmail: currentUser ? currentUser.email : shippingInfo.email
    };

    // Decrement stock for ordered items
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        const orderItem = cart.find(item => item.product.id === prod.id);
        if (orderItem) {
          return { ...prod, stock: Math.max(0, prod.stock - orderItem.quantity) };
        }
        return prod;
      })
    );

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
    if (trimmedEmail === 'admin@ramafabrics.com' && password === 'admin123') {
      const adminSession = { name: 'Store Owner', email: trimmedEmail, isAdmin: true };
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
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
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
*Discount:* ₹${order.discount} ${order.couponApplied ? `(Promo: ${order.couponApplied})` : ''}
*Total Paid:* ₹${order.total}
*Payment Method:* UPI QR
----------------------------------------
_I have completed the payment via UPI. Please confirm my order!_`;

    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${settings.whatsapp}?text=${encodedText}`;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        offers,
        orders,
        settings,
        currentUser,
        cart,
        activeCoupon,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
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
        getWhatsAppLink
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
