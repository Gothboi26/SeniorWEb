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
        if (!data.error) {
          const updatedProfile = {
            firstName: data.first_name || "",
            middleName: data.middle_name || "",
            lastName: data.last_name || "",
            extensionName: data.extension || "",
            birthday: data.birthday || "",
            age: data.age || "",
            sex: data.sex || "",
            civilStatus: data.civil_status || "",
            barangayID: data.barangay_id || "",
            groupChapter: data.group_chapter || "",
            emergencyContactPerson: data.emergency_contact_person || "",
            contactNumber: data.emergency_contact_number || "",
            relationship: data.emergency_contact_relationship || "",
            address: data.address || "",
            profilePicture: data.profile_picture || null,
          };

          setProfile(updatedProfile);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !profile.profilePicture) {
      setProfile({ ...profile, profilePicture: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { ...profile };

    if (profile.profilePicture && typeof profile.profilePicture !== "string") {
      const reader = new FileReader();
      reader.onloadend = () => {
        formData.profilePicture = reader.result;
        sendProfile(formData);
      };
      reader.readAsDataURL(profile.profilePicture);
    }
  };

  const sendProfile = (data) => {
    fetch("https://backend-production-4629.up.railway.app/save_user_profile.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ profilePicture: data.profilePicture }),
    })
      .then((res) => res.json())
      .then((resData) => {
        alert(resData.message || "Profile picture uploaded!");
        setProfile((prev) => ({
          ...prev,
          profilePicture: data.profilePicture,
        }));
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
            {!profile.profilePicture && (
              <>
                <input
                  type="file"
                  id="upload-image"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="upload-image" className="upload-button">
                  Upload Image
                </label>
              </>
            )}
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
