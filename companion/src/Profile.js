import React, { useState, useEffect } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState(null); // State to store the role
  const [profile, setProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthday: "",
    address: "",
    idFile: null,
    profilePicture: null,
  });

  useEffect(() => {
    // Retrieve role from localStorage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

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
<<<<<<< Updated upstream
      <h2>Profile</h2>
=======
      <h3>Profile</h3>
>>>>>>> Stashed changes
      <div className="profile-pic">
        <img
          src={
            profile.profilePicture
              ? URL.createObjectURL(profile.profilePicture)
              : "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="profile-image"
        />
      </div>
      
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
          
        </div>
        <div className="bhome-b">
          <button className="bhome-button">
            <a href="/" className="bhome-link">Back to Home</a>
          </button>
        </div>
        

        
    </div>
  );
};

export default Profile;
