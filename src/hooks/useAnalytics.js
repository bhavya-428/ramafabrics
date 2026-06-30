import { useMemo, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export const useAnalytics = () => {
  const { orders, products, users } = useContext(ShopContext);

  return useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonthStr = todayStr.substring(0, 7);

    let totalRevenue = 0;
    let todayRevenue = 0;
    let monthlyRevenue = 0;
    let totalOrders = 0;
    let todayOrders = 0;

    let statusCounts = {
      'Pending': 0,
      'Processing': 0,
      'Shipped': 0,
      'Delivered': 0,
      'Cancelled': 0,
    };

    const categorySales = {};
    const productSales = {};

    orders.forEach(order => {
      // Map 'Pending Payment' to 'Pending'
      const status = order.status === 'Pending Payment' ? 'Pending' : order.status;
      
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }

      if (status !== 'Cancelled' && status !== 'Refunded') {
        totalOrders++;
        totalRevenue += order.total;

        const orderDate = new Date(order.createdAt);
        const orderDateStr = orderDate.toISOString().split('T')[0];
        const orderMonthStr = orderDateStr.substring(0, 7);

        if (orderDateStr === todayStr) {
          todayRevenue += order.total;
          todayOrders++;
        }

        if (orderMonthStr === currentMonthStr) {
          monthlyRevenue += order.total;
        }

        // Aggregate product & category sales
        order.items.forEach(item => {
          const cat = item.product.category;
          const pid = item.product.id;
          
          if (!categorySales[cat]) categorySales[cat] = 0;
          categorySales[cat] += (item.product.price * item.quantity);

          if (!productSales[pid]) {
            productSales[pid] = {
              id: pid,
              name: item.product.name,
              image: item.product.image,
              category: item.product.category,
              unitsSold: 0,
              revenue: 0
            };
          }
          productSales[pid].unitsSold += item.quantity;
          productSales[pid].revenue += (item.product.price * item.quantity);
        });
      }
    });

    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    
    // Fake previous period growth percentages for demo realism
    const revGrowth = totalOrders > 0 ? 18.4 : 0;
    const orderGrowth = totalOrders > 0 ? 12.1 : 0;
    const aovGrowth = totalOrders > 0 ? 5.2 : 0;

    // Customer Metrics
    const customers = users.filter(u => !u.isAdmin);
    const totalCustomers = customers.length;
    const newCustomers = Math.floor(totalCustomers * 0.2); 

    // Product Metrics
    let outOfStock = 0;
    let lowStock = 0;
    products.forEach(p => {
      if (p.stock === 0) outOfStock++;
      else if (p.stock <= 10) lowStock++;
    });

    // Best Sellers List
    const bestSellers = Object.values(productSales)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 10)
      .map(p => {
        const currentProd = products.find(prod => prod.id === p.id);
        return {
          ...p,
          stock: currentProd ? currentProd.stock : 0
        };
      });

    // Low Stock List
    const lowStockAlerts = products
      .filter(p => p.stock > 0 && p.stock <= 10)
      .sort((a, b) => a.stock - b.stock);

    // Chart Data: Last 7 Days Sales
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      let dRev = 0;
      let dOrd = 0;
      orders.forEach(o => {
        if (o.status !== 'Cancelled' && o.status !== 'Refunded') {
          if (o.createdAt.startsWith(dStr)) {
            dRev += o.total;
            dOrd++;
          }
        }
      });
      last7Days.push({
        name: shortDay,
        date: dStr,
        revenue: dRev,
        orders: dOrd
      });
    }

    // Chart Data: Monthly Revenue (Jan-Dec)
    const currentYear = now.getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((m, idx) => {
      const monthPrefix = `${currentYear}-${String(idx + 1).padStart(2, '0')}`;
      let mRev = 0;
      let mOrd = 0;
      orders.forEach(o => {
        if (o.status !== 'Cancelled' && o.status !== 'Refunded') {
          if (o.createdAt.startsWith(monthPrefix)) {
            mRev += o.total;
            mOrd++;
          }
        }
      });
      return {
        name: m,
        revenue: mRev,
        orders: mOrd
      };
    });

    // Category Chart Data
    const categoryData = Object.keys(categorySales).map(cat => ({
      name: cat,
      value: categorySales[cat]
    }));

    // Orders Analytics Data
    const ordersAnalytics = [
      { name: 'Completed', value: statusCounts['Delivered'] || 0 },
      { name: 'Processing', value: (statusCounts['Pending'] || 0) + (statusCounts['Processing'] || 0) + (statusCounts['Shipped'] || 0) },
      { name: 'Cancelled', value: statusCounts['Cancelled'] || 0 },
    ];

    return {
      kpi: {
        totalRevenue,
        todayRevenue,
        monthlyRevenue,
        totalOrders,
        todayOrders,
        averageOrderValue,
        statusCounts,
        totalCustomers,
        newCustomers,
        totalProducts: products.length,
        outOfStock,
        lowStock,
        revGrowth,
        orderGrowth,
        aovGrowth
      },
      charts: {
        last7Days,
        monthlyData,
        categoryData,
        ordersAnalytics
      },
      tables: {
        bestSellers,
        lowStockAlerts,
        recentOrders: [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)
      }
    };
  }, [orders, products, users]);
};
