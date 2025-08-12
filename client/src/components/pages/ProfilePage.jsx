import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import "./stylePages.css";

function ProfilePage() {
  const [user, setUser] = useState({});
  // Controlled fields for profile update
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // New password and confirm new password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // On component mount, load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUsername(parsedUser.username);
      setEmail(parsedUser.email);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If password is provided, ensure confirmPassword matches
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    // Build the update payload; only include password if provided.
    let updateData = { username, email };
    if (password) {
      updateData.password = password;
    }

    // Use user.userId since your model uses userId as the primary key.
    const userIdToUpdate = user.id || user.userId;

    try {
      // Assuming backend expects a PUT at /usersR/:id to update user info.
      const response = await axios.put(
        `http://localhost:3000/usersR/${userIdToUpdate}`,
        updateData
      );
      // Update the local state and localStorage with the updated user info.
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));

      setMessage("Profile updated successfully!");
      setError("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error updating profile. Please try again.");
      setMessage("");
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Profile Page</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="form-group mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {/* Email Input */}
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* New Password Input */}
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              New Password:
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              placeholder="Leave blank if not changing"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Confirm New Password Input */}
          <div className="form-group mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              placeholder="Re-enter your new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#8b4e2f",
              borderColor: "#8b4e2f",
              color: "#fff",
            }}
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
