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
    fetch("https://backend-production-4629.up.railway.app/get_admin_info.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const info = data.data;
          setUsername(info.username || "");
          setEmailAddress(info.email_address || "");
          setAddress(info.address || "");
          setNumber(info.number || "");
          setCity(info.city || "");
          setState(info.state || "");
          setSavedPhoto(info.profile_photo || "");
        } else {
          console.warn("Fetch error:", data.message);
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

    fetch("https://backend-production-4629.up.railway.app/update_admin_info.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          alert("✅ Account information updated successfully!");
        } else {
          alert("❌ Update failed: " + result.message);
        }
      })
      .catch((err) => console.error("Update failed:", err));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));

      // ✅ Immediately upload when file selected
      const formData = new FormData();
      formData.append("profile_photo", file);

      fetch("https://backend-production-4629.up.railway.app/upload_admin_photo.php", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setSavedPhoto(data.data.photo_path);
            setPhotoPreview(""); // Reset preview since saved already
            setProfilePhoto(null); // Reset selected file
            if (fileInputRef.current) fileInputRef.current.value = "";
            alert("✅ Profile photo uploaded successfully!");
          } else {
            alert("❌ Upload failed: " + (data.message || "Unknown error"));
          }
        })
        .catch((err) => console.error("Upload error:", err));
    }
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
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
                ? `https://backend-production-4629.up.railway.app/uploads/${savedPhoto}` // ✅ FIX here (added /uploads/)
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
        <button className="update-profile-btn" onClick={triggerUpload}>
          Upload Photo
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
