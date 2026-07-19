import { createContext, useContext, useEffect, useState } from "react";
import {
  createOrder,
  deleteOrderApi,
  getMyOrders,
  updateOrderStatusApi,
} from "../../api/orders";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!localStorage.getItem("token")) return;

      try {
        const savedOrders = await getMyOrders();
        setOrders(savedOrders);
      } catch (error) {
        console.error("Failed to load orders", error);
      }
    };

    loadOrders();
  }, []);

  // Place New Order
  const addOrder = async (product, userInfo) => {

    const newOrder = {

      orderId: "BM" + Date.now(),

      id: product.id || product._id,

      product_pic: product.product_pic,

      subcategory_name: product.subcategory_name,

      product_quantity: product.product_quantity,

      quantity: product.quantity,

      discount_price: product.discount_price,

      total_price: product.total_price,

      added_date: new Date().toLocaleDateString(),

      status: "Order Confirmed",
      statusStep: 0,

      payment_method: "Wallet",

      customer: {
        name: userInfo.name,
        mobile: userInfo.mobile,
        email: userInfo.email,
        address: userInfo.address,
      },

    };

    const data = await createOrder(newOrder);
    const savedOrder = data.order;

    setOrders((prev) => [savedOrder, ...prev]);
    startOrderTracking(savedOrder.orderId);

    return savedOrder;

  };
  const startOrderTracking = (orderId) => {

  setTimeout(() => {
    updateOrderStatus(orderId, "Processing", 1);
  }, 5000);

  setTimeout(() => {
    updateOrderStatus(orderId, "Packed", 2);
  }, 100000);

  setTimeout(() => {
    updateOrderStatus(orderId, "Shipped", 3);
  }, 150000);

  setTimeout(() => {
    updateOrderStatus(orderId, "Out For Delivery", 4);
  }, 200000);

  setTimeout(() => {
    updateOrderStatus(orderId, "Delivered", 5);
  }, 250000);

};

  // Remove Order
  const removeOrder = async (orderId) => {

    try {
      await deleteOrderApi(orderId);
    } catch (error) {
      console.error("Failed to delete order", error);
    }

    setOrders((prev) =>
      prev.filter((item) => item.orderId !== orderId)
    );

  };

  // Change Status
  const updateOrderStatus = async (orderId, newStatus, step = null) => {

  setOrders(prev =>
    prev.map(item =>
      item.orderId === orderId
        ? {
            ...item,
            status: newStatus,
            statusStep:
              step !== null ? step : item.statusStep
          }
        : item
    )
  );

  try {
    await updateOrderStatusApi(orderId, {
      status: newStatus,
      statusStep: step,
    });
  } catch (error) {
    console.error("Failed to update order status", error);
  }

};

  // Get Single Order
  const getOrder = (orderId) => {

    return orders.find(
      (item) => item.orderId === orderId
    );

  };

  return (

    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        removeOrder,
        updateOrderStatus,
        getOrder,
      }}
    >

      {children}

    </OrderContext.Provider>

  );

};

export const useOrder = () => useContext(OrderContext);
