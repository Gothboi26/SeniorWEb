import React, { useState } from "react";
import "./AccountTab.css";

const AccountTab = () => {
  // Get initial values from localStorage or set default values
  const getLocalStorage = (key, defaultValue) => {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  };

  const [fullname, setFullname] = useState(getLocalStorage("fullname", "Aliah Masdasdasdhae F. Blvd"));
  const [email, setEmail] = useState(getLocalStorage("email", "aliah@gmail.com"));
  const [address, setAddress] = useState(getLocalStorage("address", "karuhatan cutie"));
  const [phone, setPhone] = useState(getLocalStorage("phone", "092312323"));
  const [city, setCity] = useState(getLocalStorage("city", "Valenzuela City"));
  const [state, setState] = useState(getLocalStorage("state", "Quezon City"));

  // Handle form submission
  const handleUpdateAccount = (e) => {
    e.preventDefault();

    // Store updated data in localStorage
    localStorage.setItem("fullname", JSON.stringify(fullname));
    localStorage.setItem("email", JSON.stringify(email));
    localStorage.setItem("address", JSON.stringify(address));
    localStorage.setItem("phone", JSON.stringify(phone));
    localStorage.setItem("city", JSON.stringify(city));
    localStorage.setItem("state", JSON.stringify(state));

    // Optionally, show a success message or perform other actions
    alert("Account information updated successfully!");
  };

  return (
    <div className="tab-content">
      <div className="account-header">
        <div className="account-info">
          <img src="profile-pic.jpg" alt="Profile" className="profile-img" />
          <h3>{fullname}</h3>
        </div>
        <button className="update-profile-btn">Update</button>
      </div>
      <h4>Change Admin Information here:</h4>
      <form className="account-form" onSubmit={handleUpdateAccount}>
        <div className="form-row">
          <label>
            Full Name*
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)} 
              className="input-box"
            />
          </label>
          <label>
            Email Address*
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="input-box"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Address*
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)} 
              className="address-input"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Phone Number*
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} 
              className="input-box"
            />
          </label>
        </div>
        <div className="form-row city-state-input">
          <label>
            City*
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)} 
              className="input-box"
            />
          </label>
          <label>
            State/Province*
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)} 
              className="input-box"
            />
          </label>
        </div>
        <button type="submit" className="update-account-btn">
          Update Account Information
        </button>
      </form>
    </div>
  );
};

export default AccountTab;
