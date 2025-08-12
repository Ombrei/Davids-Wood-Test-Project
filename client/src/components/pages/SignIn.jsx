import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import "./stylePages.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send credentials to the sign-in endpoint
      const response = await axios.post("http://localhost:3000/usersR/signin", {
        email,
        password,
      });

      // Assume the response returns all user details,
      // including a property called userType.
      localStorage.setItem("user", JSON.stringify(response.data));
      const { userType } = response.data;

      // Redirect based on account type
      if (userType === "admin") {
        // For admin accounts, redirect to the product management page.
        navigate("/LandingPage");
      } else if (userType === "supervisor") {
        navigate("/LandingPage");
      } else if (userType === "auditor") {
        navigate("/LandingPage");
      } else {
        // For all other user types, redirect to the landing page.
        navigate("/LandingPage");
      }
    } catch (err) {
      console.error("Error signing in:", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Sign In</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
          <div className="mb-3">
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
          <button type="submit" className="btn btn-primary" id="signInBtn">
            Sign In
          </button>
        </form>
        <div className="mt-3">
          <p>
            No Account?{" "}
            <Link to="/SignUp" id="SignUp">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
