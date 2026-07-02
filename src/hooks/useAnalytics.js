import { useMemo, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export const useAnalytics = (dateRange = 'today') => {
  // dateRange: 'today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'thisYear', 'all'
  const { orders, products, users, inventoryLogs } = useContext(ShopContext);

  return useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    let prevStartDate = new Date(startDate);
    let prevEndDate = new Date(now);

    switch (dateRange) {
      case 'today':
        prevStartDate.setDate(prevStartDate.getDate() - 1);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        prevEndDate.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        startDate.setDate(startDate.getDate() - 1);
        now.setDate(now.getDate() - 1);
        now.setHours(23, 59, 59, 999);
        prevStartDate.setDate(startDate.getDate() - 1);
        prevEndDate.setDate(now.getDate() - 1);
        break;
      case 'last7days':
        startDate.setDate(startDate.getDate() - 6);
        prevStartDate.setDate(startDate.getDate() - 7);
        prevEndDate.setDate(now.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(startDate.getDate() - 29);
        prevStartDate.setDate(startDate.getDate() - 30);
        prevEndDate.setDate(now.getDate() - 30);
        break;
      case 'thisMonth':
        startDate.setDate(1);
        prevStartDate.setMonth(prevStartDate.getMonth() - 1);
        prevStartDate.setDate(1);
        prevEndDate = new Date(startDate);
        prevEndDate.setDate(0);
        prevEndDate.setHours(23, 59, 59, 999);
        break;
      case 'thisYear':
        startDate.setMonth(0, 1);
        prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
        prevStartDate.setMonth(0, 1);
        prevEndDate = new Date(startDate);
        prevEndDate.setDate(0);
        prevEndDate.setHours(23, 59, 59, 999);
        break;
      case 'all':
        startDate = new Date(0);
        prevStartDate = new Date(0);
        prevEndDate = new Date(0);
        break;
      default:
        break;
    }

    const isDateInRange = (dateStr, start, end) => {
      const d = new Date(dateStr);
      return d >= start && d <= end;
    };

    let totalRevenue = 0;
    let prevRevenue = 0;
    let totalOrders = 0;
    let prevOrders = 0;
    let totalOnlinePayments = 0;
    let pendingPaymentsCount = 0;

    let statusCounts = {
      'Pending Payment': 0,
      'Paid': 0,
      'Confirmed': 0,
      'Shipped': 0,
      'Delivered': 0,
      'Cancelled': 0,
    };

    const categorySales = {};
    const productSales = {};
    const customerSpending = {};

    // Filtered orders for the current period
    const currentOrders = [];

    orders.forEach(order => {
      const inCurrent = isDateInRange(order.createdAt, startDate, now);
      const inPrev = isDateInRange(order.createdAt, prevStartDate, prevEndDate);

      if (inCurrent) {
        currentOrders.push(order);
        if (statusCounts[order.status] !== undefined) {
          statusCounts[order.status]++;
        } else {
          statusCounts[order.status] = 1;
        }

        if (order.status === 'Pending Payment') {
           pendingPaymentsCount++;
        }

        if (order.status !== 'Cancelled' && order.status !== 'Pending Payment') {
          totalOrders++;
          totalRevenue += order.total;
          
          if (order.paymentMethod === 'online' || order.paymentMethod === 'card' || order.paymentMethod === 'UPI' || !order.paymentMethod) {
             totalOnlinePayments += order.total;
          }

          // Customer spending
          const email = order.userEmail || order.shippingInfo?.email || 'Guest';
          if (!customerSpending[email]) {
            customerSpending[email] = {
               email,
               name: order.shippingInfo?.name || 'Customer',
               totalSpent: 0,
               orderCount: 0
            };
          }
          customerSpending[email].totalSpent += order.total;
          customerSpending[email].orderCount++;

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
      } else if (inPrev) {
        if (order.status !== 'Cancelled' && order.status !== 'Pending Payment') {
          prevOrders++;
          prevRevenue += order.total;
        }
      }
    });

    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    
    // Growth calculations
    const revGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : (totalRevenue > 0 ? 100 : 0);
    const orderGrowth = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : (totalOrders > 0 ? 100 : 0);

    // Customer Metrics
    const customers = users.filter(u => !u.isAdmin);
    const totalCustomers = customers.length;
    // Top customers dynamically calculated
    const topCustomers = Object.values(customerSpending)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Product Metrics
    let outOfStock = 0;
    let lowStock = 0;
    products.forEach(p => {
      if (p.stock === 0) outOfStock++;
      else if (p.stock <= 5) lowStock++;
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
      .filter(p => p.stock > 0 && p.stock <= 5)
      .sort((a, b) => a.stock - b.stock);

    // Dynamic Chart Data Construction
    let timeSeriesData = [];
    
    if (dateRange === 'today' || dateRange === 'yesterday') {
      timeSeriesData = [{ date: 'Today', revenue: totalRevenue, orders: totalOrders }];
    } else if (dateRange === 'last7days' || dateRange === 'last30days' || dateRange === 'thisMonth') {
      const days = dateRange === 'last7days' ? 7 : (dateRange === 'last30days' ? 30 : new Date(now.getFullYear(), now.getMonth()+1, 0).getDate());
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        if (dateRange === 'thisMonth') {
           d.setDate(days - i);
        } else {
           d.setDate(d.getDate() - i);
        }
        const dStr = d.toISOString().split('T')[0];
        const shortDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        let dRev = 0;
        let dOrd = 0;
        currentOrders.forEach(o => {
          if (o.status !== 'Cancelled' && o.status !== 'Pending Payment') {
            if (o.createdAt.startsWith(dStr)) {
              dRev += o.total;
              dOrd++;
            }
          }
        });
        timeSeriesData.push({
          date: shortDay,
          fullDate: dStr,
          revenue: dRev,
          orders: dOrd
        });
      }
    } else {
      const currentYear = now.getFullYear();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      timeSeriesData = months.map((m, idx) => {
        const monthPrefix = `${currentYear}-${String(idx + 1).padStart(2, '0')}`;
        let mRev = 0;
        let mOrd = 0;
        currentOrders.forEach(o => {
          if (o.status !== 'Cancelled' && o.status !== 'Pending Payment') {
            if (o.createdAt.startsWith(monthPrefix)) {
              mRev += o.total;
              mOrd++;
            }
          }
        });
        return {
          date: m,
          revenue: mRev,
          orders: mOrd
        };
      });
    }

    // Category Chart Data
    const categoryData = Object.keys(categorySales).map(cat => ({
      name: cat,
      value: categorySales[cat]
    })).filter(c => c.value > 0);

    // Orders Analytics Data
    const ordersAnalytics = [
      { name: 'Delivered', value: statusCounts['Delivered'] || 0 },
      { name: 'Shipped', value: statusCounts['Shipped'] || 0 },
      { name: 'Confirmed', value: statusCounts['Confirmed'] || 0 },
      { name: 'Paid', value: statusCounts['Paid'] || 0 },
      { name: 'Pending', value: statusCounts['Pending Payment'] || 0 },
      { name: 'Cancelled', value: statusCounts['Cancelled'] || 0 },
    ].filter(s => s.value > 0);

    // Recent Activity Feed
    const recentActivity = [];
    currentOrders.slice(0, 5).forEach(o => {
       recentActivity.push({
          id: `ra-${o.id}`,
          type: o.status === 'Cancelled' ? 'cancelled' : 'order',
          title: o.status === 'Cancelled' ? `Order Cancelled: #${o.id}` : `New Order: #${o.id}`,
          timestamp: o.createdAt,
          details: `₹${o.total} by ${o.shippingInfo?.name || 'Customer'}`
       });
    });
    if (inventoryLogs) {
      inventoryLogs.filter(l => l.actionType === 'Manual Restock' && isDateInRange(l.timestamp, startDate, now)).slice(0, 3).forEach(l => {
         recentActivity.push({
            id: `ra-${l.id}`,
            type: 'restock',
            title: `Restocked: ${l.productName}`,
            timestamp: l.timestamp,
            details: `+${l.qtyChange}m (New Stock: ${l.newStock}m)`
         });
      });
    }
    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      kpi: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        statusCounts,
        totalCustomers,
        totalOnlinePayments,
        pendingPaymentsCount,
        totalProducts: products.length,
        outOfStock,
        lowStock,
        revGrowth: revGrowth.toFixed(1),
        orderGrowth: orderGrowth.toFixed(1),
      },
      charts: {
        timeSeriesData,
        categoryData,
        ordersAnalytics
      },
      tables: {
        bestSellers,
        lowStockAlerts,
        topCustomers,
        recentActivity: recentActivity.slice(0, 10),
        recentOrders: currentOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)
      }
    };
  }, [orders, products, users, inventoryLogs, dateRange]);
};