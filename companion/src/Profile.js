import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToHome from "./BackToHome";
import "./Profile.css";

const Profile = () => {
  const [role, setRole] = useState(null);
  const [readOnlyMode, setReadOnlyMode] = useState(false);
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

    fetch("http://localhost/php/fetch_profile.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          const updatedProfile = {
            ...data,
            barangayID: data.barangay_id || "",
            groupChapter: data.group_chapter || "",
            age: data.age || "",
            sex: data.sex || "",
            address: data.address || "",
          };

          setProfile((prev) => ({ ...prev, ...updatedProfile }));

          const requiredFields = [
            updatedProfile.firstName,
            updatedProfile.lastName,
            updatedProfile.birthday,
            updatedProfile.civilStatus,
            updatedProfile.emergencyContactPerson,
            updatedProfile.contactNumber,
            updatedProfile.relationship,
          ];
          const isComplete = requiredFields.every(
            (field) => field && field.trim() !== ""
          );

          const isSaved = localStorage.getItem("profileSaved") === "true";
          setReadOnlyMode(isSaved && isComplete);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!readOnlyMode) {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!readOnlyMode && file) {
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
    } else {
      sendProfile(formData);
    }
  };

  const sendProfile = (data) => {
    fetch("http://localhost/php/save_user_profile.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resData) => {
        alert(resData.message || "Profile saved!");

        const requiredFields = [
          profile.firstName,
          profile.lastName,
          profile.birthday,
          profile.civilStatus,
          profile.emergencyContactPerson,
          profile.contactNumber,
          profile.relationship,
        ];
        const isComplete = requiredFields.every(
          (field) => field && field.trim() !== ""
        );

        if (isComplete) {
          setReadOnlyMode(true);
          localStorage.setItem("profileSaved", "true");
        } else {
          alert(
            "Profile saved, but you can still complete the remaining required info."
          );
        }
      })
      .catch((err) => console.error("Error saving profile:", err));
  };

  return (
    <div className="profile-container">
      <Navbar role={role} />

      <div className="profile-title-container">
        <h1 className="profile-title">Profile Page</h1>
        {readOnlyMode && (
          <p className="readonly-note">
            Your profile has been saved and is now locked.
          </p>
        )}
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
            {!readOnlyMode && (
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
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                readOnly={readOnlyMode}
              />

              <label>Middle Name:</label>
              <input
                type="text"
                name="middleName"
                value={profile.middleName}
                onChange={handleChange}
                readOnly={readOnlyMode}
              />
            </div>

            <div className="name-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                readOnly={readOnlyMode}
              />

              <label>Extension Name:</label>
              <input
                type="text"
                name="extensionName"
                value={profile.extensionName}
                onChange={handleChange}
                readOnly={readOnlyMode}
              />
            </div>
          </div>
        </div>

        <div className="barangay-info-container">
          <div>
            <label>Barangay ID Number:</label>
            <input
              type="text"
              name="barangayID"
              value={profile.barangayID}
              readOnly
            />
          </div>
          <div>
            <label>Group Chapter:</label>
            <input
              type="text"
              name="groupChapter"
              value={profile.groupChapter}
              readOnly
            />
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
            <input
              type="date"
              name="birthday"
              value={profile.birthday}
              onChange={handleChange}
              readOnly={readOnlyMode}
            />
          </div>

          <div>
            <label>Civil Status:</label>
            <select
              name="civilStatus"
              value={profile.civilStatus}
              onChange={handleChange}
              disabled={readOnlyMode}
              className="form-input"
            >
              <option value="">-- Select Status --</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>
        </div>

        <div className="emergency-contact-container">
          <div>
            <label>Emergency Contact Person:</label>
            <input
              type="text"
              name="emergencyContactPerson"
              value={profile.emergencyContactPerson}
              onChange={handleChange}
              readOnly={readOnlyMode}
            />
          </div>

          <div>
            <label>Relationship:</label>
            <input
              type="text"
              name="relationship"
              value={profile.relationship}
              onChange={handleChange}
              readOnly={readOnlyMode}
            />
          </div>

          <div>
            <label>Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={profile.contactNumber}
              onChange={handleChange}
              readOnly={readOnlyMode}
            />
          </div>
        </div>

        {!readOnlyMode && (
          <div className="save-button-wrapper">
            <button
              type="submit"
              onClick={handleSubmit}
              className="submit-button"
            >
              Save
            </button>
          </div>
        )}

        {/* Back to Home */}
        <div className="temp-buttons">
          <BackToHome role={role} />
        </div>
      </div>

      <Footer role={role} />
    </div>
  );
};

export default Profile;
