import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import "./stylePages.css";

function TermsModal({ show, onClose }) {
  if (!show) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h4>Terms and Conditions</h4>
        <p>
          By signing up, you agree that the personal information you provide
          (including your name, email address, contact details, and any
          additional information) will be used solely for the purpose of
          processing your orders, ensuring accurate and timely delivery, and for
          contacting you regarding your orders or any service-related matters.
        </p>
        <p>
          Your data will be handled confidentially and securely, and it will not
          be shared with any third parties apart from our trusted delivery and
          logistics partners who assist us in delivering your products. Your
          information will <strong>not be made publicly visible</strong> on our
          platform or used for any other purposes without your explicit consent.
        </p>
        <p>
          We are committed to protecting your privacy and ensuring that your
          data is used only as described above. Please review these terms
          carefully before proceeding.
        </p>
        <button
          className="btn btn-secondary"
          onClick={onClose}
          style={{
            backgroundColor: "#8b4e2f",
            borderColor: "#8b4e2f",
            color: "#fff",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setSuccess("");
      return;
    }

    // Validate acceptance of terms
    if (!termsAccepted) {
      setError("Please accept the Terms and Conditions.");
      setSuccess("");
      return;
    }

    // Prepare user data with default userType
    const userData = {
      firstName,
      lastName,
      username,
      email,
      password,
      userType: "customer",
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/usersR",
        userData
      );
      console.log("User created:", response.data);
      setError("");
      setSuccess("Registration successful!");

      // Delay navigation to allow the user to see the success message
      setTimeout(() => {
        navigate("/SignIn");
      }, 2000);
    } catch (err) {
      console.error("Error creating user:", err.response || err);
      setError(
        err.response?.data?.error || "Error creating user. Please try again."
      );
      setSuccess("");
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Sign Up</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms" className="form-label ms-2">
              I agree to the{" "}
              <span
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => setShowTerms(true)}
              >
                Terms and Conditions
              </span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" id="signUpBtn">
            Sign Up
          </button>
        </form>
      </div>
      <TermsModal show={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}

export default SignUp;
