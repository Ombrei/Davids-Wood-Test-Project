import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import cartLogo from "./assets/cart.png";
import profLogo from "./assets/profLogo.png";
import { useCart } from "./CartContext";
import "./Header.css";

function Header() {
  const { cart, addToCart, removeFromCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const cartDropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutsideCart = (event) => {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target)
      ) {
        setShowCart(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideCart);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideCart);
  }, []);

  useEffect(() => {
    const handleClickOutsideAccount = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setShowAccount(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideAccount);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideAccount);
  }, []);

  useEffect(() => {
    const handleClickOutsideAdmin = (event) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target)
      ) {
        setShowAdmin(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideAdmin);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideAdmin);
  }, []);

  // Retrieve user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Logged in user:", parsedUser);
      setLoggedInUser(parsedUser);
    }
  }, []);

  // Helper functions for the cart operations.
  const handleIncrement = (item) => {
    addToCart(item);
  };

  const handleDecrement = (prodId) => {
    removeFromCart(prodId);
  };

  const handleDelete = (prodId) => {
    // Implement complete removal if needed, e.g. removeFromCart(prodId, true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setLoggedInUser(null);
    navigate("/SignIn");
  };

  // Compute admin menu items based on userType (case-insensitive and trimmed)
  let adminMenuItems = [];
  if (loggedInUser && loggedInUser.userType) {
    const userTypeLower = loggedInUser.userType.trim().toLowerCase();
    console.log("User type (lowercase, trimmed):", userTypeLower);
    if (userTypeLower === "admin") {
      adminMenuItems.push({
        label: "Product Management",
        to: "/admin/products",
      });
      adminMenuItems.push({
        label: "Inventory Management",
        to: "/admin/inventory",
      });
      adminMenuItems.push({
        label: "Account Management",
        to: "/admin/account-management",
      });
      adminMenuItems.push({
        label: "Order Management",
        to: "/admin/order-management",
      });
    } else if (userTypeLower === "supervisor") {
      adminMenuItems.push({
        label: "Inventory Management",
        to: "/admin/inventory",
      });
      adminMenuItems.push({
        label: "Order Management",
        to: "/admin/order-management",
      });
    } else if (userTypeLower === "auditor") {
      adminMenuItems.push({
        label: "Order Management",
        to: "/admin/order-management",
      });
    }
  }
  console.log("Admin menu items:", adminMenuItems);

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid position-relative">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Your Logo" className="logo" />
          </Link>
          {/* Toggle Button for Collapsed Navbar */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {/* Main Navigation Links */}
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/">
                  {" "}
                  Home{" "}
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/about">
                  {" "}
                  About{" "}
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/products">
                  {" "}
                  Products{" "}
                </Link>
              </li>

              {/* Admin Dropdown */}
              {loggedInUser && adminMenuItems.length > 0 && (
                <li className="nav-item mx-2" ref={adminDropdownRef}>
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={() => setShowAdmin(!showAdmin)}
                  >
                    <span>Admin</span>
                  </button>
                  {showAdmin && (
                    <div
                      className="dropdown-menu dropdown-menu-end"
                      style={{
                        display: "block",
                        position: "absolute",
                        top: "50px",
                        right: "0",
                        minWidth: "200px",
                        zIndex: 9999,
                      }}
                    >
                      {adminMenuItems.map((item, index) => (
                        <Link
                          key={index}
                          className="dropdown-item"
                          to={item.to}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )}

              {/* Cart Dropdown */}
              <li className="nav-item mx-2" ref={cartDropdownRef}>
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setShowCart(!showCart)}
                >
                  <img
                    src={cartLogo}
                    alt="Cart"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "5px",
                      verticalAlign: "middle",
                    }}
                  />
                  <span className="badge bg-secondary">{totalItems}</span>
                </button>
                {showCart && (
                  <div
                    className="dropdown-menu dropdown-menu-end"
                    style={{
                      display: "block",
                      position: "absolute",
                      top: "50px",
                      right: "0",
                      minWidth: "300px",
                      zIndex: 9999,
                    }}
                  >
                    {cart.length === 0 ? (
                      <span className="dropdown-item">Your cart is empty.</span>
                    ) : (
                      <>
                        {cart.map((item) => (
                          <div
                            key={item.prodId}
                            className="dropdown-item d-flex align-items-center"
                          >
                            <span className="flex-grow-1">{item.name}</span>
                            <div className="d-flex align-items-center">
                              <button
                                onClick={() => handleDecrement(item.prodId)}
                                className="btn btn-outline-secondary btn-sm"
                              >
                                –
                              </button>
                              <span className="mx-1">{item.quantity}</span>
                              <button
                                onClick={() => handleIncrement(item)}
                                className="btn btn-outline-secondary btn-sm"
                              >
                                +
                              </button>
                            </div>
                            <span className="ms-2">
                              ₱{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              className="btn btn-danger btn-sm ms-2"
                              onClick={() => handleDelete(item.prodId)}
                            >
                              X
                            </button>
                          </div>
                        ))}
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-item d-flex justify-content-between align-items-center font-weight-bold">
                          <span>Total:</span>
                          <span>₱{totalPrice}</span>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-item text-center">
                          <Link
                            className="btn btn-primary btn-sm"
                            id="checkoutBtn"
                            to="/checkout"
                          >
                            Checkout
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </li>

              {/* Account Dropdown */}
              <li className="nav-item mx-2" ref={accountDropdownRef}>
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setShowAccount(!showAccount)}
                >
                  <img
                    src={profLogo}
                    alt="Account"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "5px",
                      verticalAlign: "middle",
                    }}
                  />
                </button>
                {showAccount && (
                  <div
                    className="dropdown-menu dropdown-menu-end"
                    style={{
                      display: "block",
                      position: "absolute",
                      top: "50px",
                      right: "0",
                      minWidth: "200px",
                      zIndex: 9999,
                    }}
                  >
                    {loggedInUser ? (
                      <>
                        <span className="dropdown-item-text">
                          Welcome, {loggedInUser.username}!
                        </span>
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="/profilePage">
                          Profile
                        </Link>
                        <Link className="dropdown-item" to="/myorders">
                          My Orders
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button
                          className="dropdown-item"
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link className="dropdown-item" to="/SignIn">
                          Sign In
                        </Link>
                        <Link className="dropdown-item" to="/SignUp">
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
