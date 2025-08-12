import React, { useState } from "react";
import Header from "./Header";
import { useCart } from "./CartContext";
import axios from "axios";
import "./pages/stylePages.css";

function Checkout() {
  const { cart, clearCart, addToCart, removeFromCart } = useCart();
  const [orderNotification, setOrderNotification] = useState("");
  const [placing, setPlacing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [receiptDetails, setReceiptDetails] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart
    .reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
    .toFixed(2);

  const handleIncrement = (item) => {
    addToCart(item);
  };

  const handleDecrement = (prodId) => {
    removeFromCart(prodId);
  };

  const handleDeleteCartItem = (prodId) => {
    removeFromCart(prodId, true);
  };

  const handlePlaceOrder = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("You must be signed in to place an order.");
      return;
    }
    setShowPopup(true);
  };

  const confirmPlaceOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      alert("Please provide both a delivery address and a phone number.");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("You must be signed in to place an order.");
      return;
    }
    const user = JSON.parse(storedUser);

    const orderItems = cart.map((item) => ({
      prodId: item.prodId,
      quantity: item.quantity,
      unitPrice: Number(item.price),
    }));

    const payload = {
      userId: user.userId,
      totalAmount: Number(totalPrice),
      orderItems,
      address: address.trim(),
      phone: phone.trim(),
    };

    try {
      setPlacing(true);
      const response = await axios.post(
        "http://localhost:3000/checkout",
        payload
      );

      if (response.status === 201 && response.data) {
        const order = response.data; 

        const orderNumber = order.orderId;
        const orderDate = order.orderDate
          ? new Date(order.orderDate).toLocaleString()
          : new Date().toLocaleString();
        const totalFromOrder = order.totalAmount
          ? Number(order.totalAmount)
          : Number(totalPrice);

        const customer = {
          username: user.username || "N/A",
          email: user.email || "N/A",
          address: address.trim(),
        };

        const receiptItems = cart.map((item) => ({
          name: item.name,
          price: Number(item.price).toFixed(2),
          quantity: item.quantity,
          subtotal: (Number(item.price) * item.quantity).toFixed(2),
        }));

        const overallBase = (totalFromOrder / 1.12).toFixed(2);
        const overallTax = (totalFromOrder - totalFromOrder / 1.12).toFixed(2);

        setReceiptDetails({
          orderNumber,
          date: orderDate,
          customer,
          items: receiptItems,
          overallTotal: totalFromOrder.toFixed(2),
          overallBase,
          overallTax,
        });

        setOrderNotification("Order placed successfully!");
        clearCart();
        setShowReceipt(true);
      }
      setPlacing(false);
      setAddress("");
      setPhone("");
      setShowPopup(false);
      setTimeout(() => setOrderNotification(""), 3000);
    } catch (err) {
      console.error(err);
      setOrderNotification("Failed to place order. Please try again.");
      setPlacing(false);
      setTimeout(() => setOrderNotification(""), 3000);
    }
  };

  return (
    <div>
      <Header />
      {orderNotification && (
        <div className="notification-popup">{orderNotification}</div>
      )}
      <div className="container mt-5">
        <h1>Checkout</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <h2>Order Summary</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.prodId}>
                    <td>{item.name}</td>
                    <td>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleDecrement(item.prodId)}
                      >
                        –
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleIncrement(item)}
                      >
                        +
                      </button>
                    </td>
                    <td>₱{Number(item.price).toFixed(2)}</td>
                    <td>₱{(Number(item.price) * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteCartItem(item.prodId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <h4>Total Items: {totalItems}</h4>
              <h4>Total Price: ₱{totalPrice}</h4>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={handlePlaceOrder}
                className="btn btn-lg"
                disabled={placing}
                style={{
                  backgroundColor: "#8b4e2f",
                  borderColor: "#8b4e2f",
                  color: "#fff",
                }}
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Popup for Delivery Details */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter Delivery Details</h3>
            <div className="form-group my-2">
              <label htmlFor="address">Delivery Address:</label>
              <input
                type="text"
                id="address"
                className="form-control"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group my-2">
              <label htmlFor="phone">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="text-center mt-3">
              <button
                onClick={confirmPlaceOrder}
                className="btn btn-success"
                disabled={placing}
              >
                {placing ? "Processing..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="btn btn-secondary ms-2"
                disabled={placing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal Popup Following the Provided Template */}
      {showReceipt && receiptDetails && (
        <div className="modal-overlay">
          <div className="modal-content receipt-modal">
            <div className="receipt-header text-center">
              <h3>Order Receipt</h3>
              <p>
                <strong>Order #:</strong> {receiptDetails.orderNumber}
              </p>
              <p>
                <strong>Date:</strong> {receiptDetails.date}
              </p>
            </div>
            <hr />
            <div className="receipt-customer">
              <h4>CUSTOMER DETAILS</h4>
              <p>
                <strong>Username:</strong> {receiptDetails.customer.username}
              </p>
              <p>
                <strong>Email:</strong> {receiptDetails.customer.email}
              </p>
              <p>
                <strong>Address:</strong> {receiptDetails.customer.address}
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
                  {receiptDetails.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>₱{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>₱{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <hr />
            <div className="receipt-totals text-right">
              <p>
                <strong>Subtotal:</strong> ₱{receiptDetails.overallBase}
              </p>
              <p>
                <strong>Tax:</strong> ₱{receiptDetails.overallTax}
              </p>
              <p>
                <strong>Total:</strong> ₱{receiptDetails.overallTotal}
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

export default Checkout;
