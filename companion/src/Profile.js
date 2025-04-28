import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToHome from "./BackToHome";
import "./Profile.css";

const Profile = () => {
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    extensionName: "",
    birthday: "",
    age: "",
    sex: "",
    civilStatus: "",
    barangayID: "",
    groupChapter: "",
    emergencyContactPerson: "",
    contactNumber: "",
    relationship: "",
    address: "",
    healthIssue: "",
    profilePicture: null,
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    fetch("https://backend-production-4629.up.railway.app/fetch_profile.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          const user = data.user;
          const updatedProfile = {
            firstName: user.first_name || user.username || "",
            middleName: user.middle_name || "",
            lastName: user.last_name || "",
            extensionName: user.extension || "",
            birthday: user.birthday || "",
            age: user.age || "",
            sex: user.sex || "",
            civilStatus: user.civil_status || "",
            barangayID: user.barangay_id || "",
            groupChapter: user.group_chapter || "",
            emergencyContactPerson: user.emergency_contact_person || "",
            contactNumber: user.emergency_contact_number || "",
            relationship: user.emergency_contact_relationship || "",
            address: user.address || "",
            healthIssue: user.health_issue || "",
            profilePicture: user.profile_picture || null,
          };
          setProfile(updatedProfile);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePicture: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (profile.profilePicture && typeof profile.profilePicture !== "string") {
      const reader = new FileReader();
      reader.onloadend = () => {
        let base64Image = reader.result;
        if (!base64Image.startsWith("data:image")) {
          base64Image = `data:image/jpeg;base64,${base64Image}`;
        }
        sendProfile(base64Image);
      };
      reader.readAsDataURL(profile.profilePicture);
    }
  };

  const sendProfile = (base64Image) => {
    fetch("https://backend-production-4629.up.railway.app/save_user_profile.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ profilePicture: base64Image }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          alert(resData.message || "Profile picture uploaded successfully!");
          setProfile((prev) => ({
            ...prev,
            profilePicture: base64Image,
          }));
        } else {
          alert(resData.message || "Error uploading profile picture.");
        }
      })
      .catch((err) => console.error("Error saving profile:", err));
  };

  return (
    <div className="profile-container">
      <Navbar role={role} />

      <div className="profile-title-container">
        <h1 className="profile-title">Profile Page</h1>
      </div>

      <div className="profile-details-container">
        <div className="image-name-container">
          <div className="profile-image-section">
            <img
              src={
                profile.profilePicture
                  ? typeof profile.profilePicture === "string"
                    ? profile.profilePicture
                    : URL.createObjectURL(profile.profilePicture)
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="profile-image"
            />
            {!profile.profilePicture || typeof profile.profilePicture !== "string" ? (
              <>
                <input
                  type="file"
                  id="upload-image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="upload-image" className="upload-button">
                  Upload Image
                </label>
              </>
            ) : null}
          </div>

          <div className="profile-fields">
            <div className="name-group">
              <label>First Name:</label>
              <input type="text" name="firstName" value={profile.firstName} readOnly />

              <label>Middle Name:</label>
              <input type="text" name="middleName" value={profile.middleName} readOnly />
            </div>

            <div className="name-group">
              <label>Last Name:</label>
              <input type="text" name="lastName" value={profile.lastName} readOnly />

              <label>Extension Name:</label>
              <input type="text" name="extensionName" value={profile.extensionName} readOnly />
            </div>
          </div>
        </div>

        <div className="barangay-info-container">
          <div>
            <label>Barangay ID Number:</label>
            <input type="text" name="barangayID" value={profile.barangayID} readOnly />
          </div>
          <div>
            <label>Group Chapter:</label>
            <input type="text" name="groupChapter" value={profile.groupChapter} readOnly />
          </div>
        </div>

        <div className="address-container">
          <label>Address:</label>
          <input type="text" name="address" value={profile.address} readOnly />
        </div>

        <div className="address-container">
          <label>Health Issue:</label> {/* ✅ New */}
          <input type="text" name="healthIssue" value={profile.healthIssue} readOnly />
        </div>

        <div className="personal-info-container">
          <div>
            <label>Age:</label>
            <input type="text" name="age" value={profile.age} readOnly />
          </div>

          <div>
            <label>Sex:</label>
            <input type="text" name="sex" value={profile.sex} readOnly />
          </div>

          <div>
            <label>Birthday:</label>
            <input type="date" name="birthday" value={profile.birthday} readOnly />
          </div>

          <div>
            <label>Civil Status:</label>
            <input type="text" name="civilStatus" value={profile.civilStatus} readOnly />
          </div>
        </div>

        <div className="emergency-contact-container">
          <div>
            <label>Emergency Contact Person:</label>
            <input
              type="text"
              name="emergencyContactPerson"
              value={profile.emergencyContactPerson}
              readOnly
            />
          </div>

          <div>
            <label>Relationship:</label>
            <input type="text" name="relationship" value={profile.relationship} readOnly />
          </div>

          <div>
            <label>Contact Number:</label>
            <input type="text" name="contactNumber" value={profile.contactNumber} readOnly />
          </div>
        </div>

        {profile.profilePicture && typeof profile.profilePicture !== "string" && (
          <div className="save-button-wrapper">
            <button type="submit" onClick={handleSubmit} className="submit-button">
              Save
            </button>
          </div>
        )}

        <div className="temp-buttons">
          <BackToHome role={role} />
        </div>
      </div>

      <Footer role={role} />
    </div>
  );
};

export default Profile;
