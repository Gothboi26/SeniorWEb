import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
    profilePicture: null,
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePicture: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile information saved!");
  };

  return (
    <div className="profile-container">
      <Navbar role={role} />
      <div className="profile-title-container">
        <h2 className="profile-title">Profile Page</h2>
      </div>
      <div className="profile-details-container">
        <div className="image-name-container">
          <div className="profile-image-section">
            <img
              src={
                profile.profilePicture
                  ? URL.createObjectURL(profile.profilePicture)
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="profile-image"
            />
            <input type="file" id="upload-image" onChange={handleFileChange} />
            <label htmlFor="upload-image" className="upload-button">Upload Image</label>
          </div>
          <div className="name-container">
            <label>First Name:</label>
            <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} />

            <label>Middle Name:</label>
            <input type="text" name="middleName" value={profile.middleName} onChange={handleChange} />

            <label>Last Name:</label>
            <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} />

            <label>Extension Name:</label>
            <input type="text" name="extensionName" value={profile.extensionName} onChange={handleChange} />
          </div>
        </div>

        <div className="barangay-info-container">
          <div>
            <label>Barangay ID Number:</label>
            <input type="text" name="barangayID" value={profile.barangayID} onChange={handleChange} />
          </div>
          <div>
            <label>Group Chapter:</label>
            <input type="text" name="groupChapter" value={profile.groupChapter} onChange={handleChange} />
          </div>
        </div>

        <div className="personal-info-container">
          <label>Age:</label>
          <input type="text" name="age" value={profile.age} onChange={handleChange} />

          <label>Sex:</label>
          <input type="text" name="sex" value={profile.sex} onChange={handleChange} />

          <label>Birthday:</label>
          <input type="date" name="birthday" value={profile.birthday} onChange={handleChange} />

          <label>Civil Status:</label>
          <input type="text" name="civilStatus" value={profile.civilStatus} onChange={handleChange} />
        </div>

        <div className="emergency-contact-container">
          <label>Emergency Contact Person:</label>
          <input type="text" name="emergencyContactPerson" value={profile.emergencyContactPerson} onChange={handleChange} />

          <label>Relationship:</label>
          <input type="text" name="relationship" value={profile.relationship} onChange={handleChange} />

          <label>Contact Number:</label>
          <input type="text" name="contactNumber" value={profile.contactNumber} onChange={handleChange} />
        </div>

        <button type="submit" onClick={handleSubmit} className="save-button">Save</button>
        <button className="back-button">Back to Home</button>
      </div>
      <Footer role={role} />
    </div>
  );
};

export default Profile;
