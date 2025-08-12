import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import "./stylePages.css"; 

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/ordersR?userId=${user.userId}`
        );
        console.log("Fetched orders:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleViewReceipt = (order) => {
    const receiptItems = order.orderItems.map((item) => ({
      name: item.product ? item.product.name : "N/A",
      price: Number(item.unitPrice).toFixed(2),
      quantity: item.quantity,
      subtotal: (Number(item.unitPrice) * item.quantity).toFixed(2),
    }));
    const decimalTotal = Number(order.totalAmount);
    const overallBase = (decimalTotal / 1.12).toFixed(2);
    const overallTax = (decimalTotal - decimalTotal / 1.12).toFixed(2);

    const receiptDetails = {
      orderNumber: order.orderId,
      date: new Date(order.orderDate).toLocaleString(),
      customer: {
        username: user && user.username ? user.username : "N/A",
        email: user && user.email ? user.email : "N/A",
        address: order.address || "N/A",
      },
      items: receiptItems,
      overallTotal: decimalTotal.toFixed(2),
      overallBase,
      overallTax,
    };

    setSelectedOrder(receiptDetails);
    setShowReceipt(true);
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h1>My Orders</h1>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>You have no orders.</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Order #{order.orderId}</h5>
                <p className="card-text">
                  Date: {new Date(order.orderDate).toLocaleString()}
                </p>
                <p className="card-text">
                  Total Amount: ${Number(order.totalAmount).toFixed(2)}
                </p>
                <p className="card-text">
                  <strong>Delivery Address:</strong> {order.address}
                </p>
                <p className="card-text">
                  <strong>Phone:</strong> {order.phone}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewReceipt(order)}
                >
                  View Receipt
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Receipt Modal Popup Following the Provided Template */}
      {showReceipt && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content receipt-modal">
            <div className="receipt-header text-center">
              <h3>Order Receipt</h3>
              <p>
                <strong>Order #:</strong> {selectedOrder.orderNumber}
              </p>
              <p>
                <strong>Date:</strong> {selectedOrder.date}
              </p>
            </div>
            <hr />
            <div className="receipt-customer">
              <h4>CUSTOMER DETAILS</h4>
              <p>
                <strong>Username:</strong> {selectedOrder.customer.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.customer.email}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.customer.address}
              </p>
            </div>
            <hr />
            <div className="receipt-items">
              <h4>ORDERED ITEMS</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>ITEM NAME</th>
                    <th>PRICE</th>
                    <th>QTY</th>
                    <th>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                      <td>${item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <hr />
            <div className="receipt-totals text-right">
              <p>
                <strong>Subtotal:</strong> ${selectedOrder.overallBase}
              </p>
              <p>
                <strong>Tax:</strong> ${selectedOrder.overallTax}
              </p>
              <p>
                <strong>Total:</strong> ${selectedOrder.overallTotal}
              </p>
            </div>
            <p className="text-center mt-3">Thank you for your purchase!</p>
            <div className="text-center mt-3">
              <button
                onClick={() => setShowReceipt(false)}
                className="btn btn-secondary"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center py-4">
        &copy; 2025 All Rights Reserved.
      </footer>
    </div>
  );
}

export default MyOrders;
