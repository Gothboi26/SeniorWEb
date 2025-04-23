import React, { useEffect, useRef, useState } from "react";
import "./AccountTab.css";

const AccountTab = () => {
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [savedPhoto, setSavedPhoto] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch("hhttps://backend-production-4629.up.railway.app/php/get_admin_info.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setUsername(data.username || "");
          setEmailAddress(data.email_address || "");
          setAddress(data.address || "");
          setNumber(data.number || "");
          setCity(data.city || "");
          setState(data.state || "");
          setSavedPhoto(data.profile_photo || "");
        } else {
          console.warn("Fetch error:", data.error);
        }
      })
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  const handleUpdateAccount = (e) => {
    e.preventDefault();

    const payload = {
      email_address: emailAddress,
      address,
      number,
      city,
      state,
    };

    fetch("https://backend-production-4629.up.railway.app/php/update_admin_info.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          alert("Account information updated successfully!");
        } else {
          alert("Update failed: " + result.error);
        }
      })
      .catch((err) => console.error("Update failed:", err));
  };

  const handleUploadPhoto = () => {
    if (!profilePhoto) {
      fileInputRef.current.click(); // Open file input if no file selected yet
      return;
    }

    const formData = new FormData();
    formData.append("profile_photo", profilePhoto);

    fetch("https://backend-production-4629.up.railway.app/php/upload_admin_photo.php", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Profile photo uploaded successfully!");
          setSavedPhoto(data.photo_path);
          setPhotoPreview("");
          setProfilePhoto(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          alert(data.error || "Upload failed");
        }
      })
      .catch((err) => console.error("Upload error:", err));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      handleUploadPhoto(); // auto-upload after selection
    }
  };

  return (
    <div className="tab-content">
      <div className="account-header">
        <div className="account-info">
          <img
            src={
              photoPreview
                ? photoPreview
                : savedPhoto
                ? `https://backend-production-4629.up.railway.app/php/${savedPhoto}`
                : "/icons/admin.png"
            }
            alt="Profile"
            className="profile-img"
          />
          <h3>{username}</h3>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button className="update-profile-btn" onClick={handleUploadPhoto}>
          {profilePhoto ? "Re-upload Photo" : "Upload Photo"}
        </button>
      </div>

      <h4>Change Admin Information here:</h4>
      <form className="account-form" onSubmit={handleUpdateAccount}>
        <div className="form-row">
          <label>
            Email Address*
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="input-box"
              required
            />
          </label>
          <label>
            Address*
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-box"
              required
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
              required
            />
          </label>
          <label>
            State/Province*
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input-box"
              required
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Phone Number*
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="input-box"
              required
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
