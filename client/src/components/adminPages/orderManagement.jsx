import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import "../pages/stylePages.css";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const storedUser = localStorage.getItem("user");
  const loggedUser = storedUser ? JSON.parse(storedUser) : null;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/ordersR");
      setOrders(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewReceipt = (order) => {
    const receiptItems = order.orderItems.map((item) => ({
      name: item.product ? item.product.name : item.prodId,
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
        username:
          order.user && order.user.username ? order.user.username : "N/A",
        email: loggedUser && loggedUser.email ? loggedUser.email : "N/A",
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
        <h1>Order Management</h1>
        {loading && <p>Loading orders...</p>}
        {error && <p className="text-danger">{error}</p>}
        {orders.length === 0 && !loading ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="card mb-4">
              <div className="card-header">
                <h5>Order ID: {order.orderId}</h5>
                <p>
                  <strong>Username: </strong>
                  {order.user ? order.user.username : "N/A"} <br />
                  <strong>User ID:</strong> {order.userId} <br />
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleString()}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₱
                  {Number(order.totalAmount).toFixed(2)}
                </p>
              </div>
              <div className="card-body">
                <h6>Order Items:</h6>
                {order.orderItems && order.orderItems.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Prod ID</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item) => (
                        <tr key={item.prodId}>
                          <td>{item.prodId}</td>
                          <td>{item.quantity}</td>
                          <td>₱{Number(item.unitPrice).toFixed(2)}</td>
                          <td>
                            ₱
                            {(
                              Number(item.quantity) * Number(item.unitPrice)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No items in this order.</p>
                )}
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

      {/* Receipt Modal Popup Following the Receipt Template */}
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

export default OrderManagement;
