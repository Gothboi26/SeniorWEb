import React, { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthday: "",
    address: "",
    idFile: null,
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProfile({ ...profile, [name]: files[0] });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile information saved!");
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      <img
        src={
          profile.profilePicture
            ? URL.createObjectURL(profile.profilePicture)
            : "https://via.placeholder.com/150"
        }
        alt="Profile"
        className="profile-image"
      />
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            required
          />
          <label>Middle Name:</label>
          <input
            type="text"
            name="middleName"
            value={profile.middleName}
            onChange={handleChange}
            required
          />
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            required
          />
          <label>Birthday:</label>
          <input
            type="date"
            name="birthday"
            value={profile.birthday}
            onChange={handleChange}
            required
          />
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            required
          />
          <label>Upload ID:</label>
          <input
            type="file"
            name="idFile"
            onChange={handleFileChange}
            required
          />
          <label>Upload Profile Picture:</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
          />
          <button type="submit" className="profile-edit-button">
            Save
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <p>
            <strong>First Name:</strong> {profile.firstName || "N/A"}
          </p>
          <p>
            <strong>Middle Name:</strong> {profile.middleName || "N/A"}
          </p>
          <p>
            <strong>Last Name:</strong> {profile.lastName || "N/A"}
          </p>
          <p>
            <strong>Birthday:</strong> {profile.birthday || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {profile.address || "N/A"}
          </p>
          <p>
            <strong>ID Uploaded:</strong>{" "}
            {profile.idFile ? profile.idFile.name : "No file uploaded"}
          </p>
          <p>
            <strong>Profile Picture:</strong>{" "}
            {profile.profilePicture
              ? profile.profilePicture.name
              : "No profile picture uploaded"}
          </p>
          <button onClick={toggleEdit} className="profile-edit-button">
            Edit Profile
          </button>
          <a href="/">Back to Home</a>
        </div>
      )}
    </div>
  );
};

export default Profile;
