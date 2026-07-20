import React, { useEffect, useState } from "react";
import { getFileUrl } from "../../api/api";
import { getCurrentUser, updateUserProfile } from "../../api/user";
import { DASHBOARD_URL } from "../../config";

function MyProfile() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    profilePic: null,
  });

  const setUserState = (userData) => {
    setUser(userData);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      mobile: userData.mobile || "",
      address: userData.address || "",
      profilePic: null,
    });
    localStorage.setItem("user", JSON.stringify(userData));
  };

useEffect(() => {
  const loadUser = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("token", token);

        // URL clean
        window.history.replaceState(
          {},
          "",
          `${DASHBOARD_URL}/myprofile`
        );
      }

      const userData = await getCurrentUser();

      setUserState(userData);

      localStorage.setItem("user", JSON.stringify(userData));

    } catch (error) {
      alert(error.message || "Profile load failed");
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);
  const handleChange = (e) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = new FormData();
    profileData.append("name", formData.name);
    profileData.append("email", formData.email);
    profileData.append("mobile", formData.mobile);
    profileData.append("address", formData.address);
    if (formData.profilePic) {
      profileData.append("profilePic", formData.profilePic);
    }

    try {
      setSaving(true);
      const data = await updateUserProfile(profileData);
      setUserState(data.user);
      setShowForm(false);
      alert(data.message || "Profile Updated Successfully");
    } catch (error) {
      alert(error.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center fs-4 py-5">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center fs-4 py-5">Profile not found</div>;
  }

  return (
    <>
      <div className="text-center fs-2">
        My
        <b className="txt-mycolor">
          <u>Profile</u><i className="fa fa-user m-2" aria-hidden="true"></i>
        </b>

        <h6>Your account details are loaded from backend and saved in MongoDB.</h6>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12 d-flex justify-content-center">
          <div
            className="card mb-3"
            style={{
              maxWidth: "700px",
              width: "100%",
              background: "linear-gradient(60deg,#ffea00e6,#cc0041,#77cc00)",
              color: "#fff",
            }}
          >
            <div className="row g-0 justify-content-center">
              <div className="col-md-4">
                <img
                  src={getFileUrl(user.profilePic)}
                  alt="Profile"
                  className="img-fluid rounded-start"
                  style={{
                    height: "250px",
                    width: "100%",
                    padding: "15px",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div className="col-md-8">
                <div className="card-body">
                  <p className="card-text">
                    <i className="fa fa-user profile-icon"></i> {user.name}
                    <br />
                    <i className="fa fa-envelope profile-icon"></i> {user.email}
                    <br />
                    <i className="fa fa-phone profile-icon"></i> {user.mobile}
                    <br />
                    <i className="fa fa-map-marker profile-icon"></i> {user.address}
                    <br />
                    <br />
                    <button
                      className="btn btn-sm text-bg-dark"
                      onClick={() => setShowForm(true)}
                    >
                      Edit Profile{" "}
                      <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="row py-3 mt-3">
          <div
            className="col-sm-7 mx-auto"
            style={{
              border: "2px solid red",
              padding: "10px",
              margin: "10px",
              borderRadius: "5px",
              background: "linear-gradient(60deg,#ffea00e6,#cc0041,#77cc00)",
            }}
          >
            <form onSubmit={handleSubmit}>
              Name
              <div className="input-group my-2">
                <span className="input-group-text bg-mycolor text-light profile-input-icon">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Name.."
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              Email
              <div className="input-group my-2">
                <span className="input-group-text bg-mycolor text-light profile-input-icon">
                  <i className="fa fa-envelope " aria-hidden="true"></i>
                </span>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="Email.."
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              Mobile
              <div className="input-group my-2">
                <span className="input-group-text bg-mycolor text-light profile-input-icon">
                  <i className="fa fa-phone-square " aria-hidden="true"></i>
                </span>
                <input
                  type="number"
                  name="mobile"
                  className="form-control"
                  placeholder="Mobile.."
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              Profile Picture
              <div className="input-group my-2">
                <span className="input-group-text bg-mycolor text-light profile-input-icon">
                  <i className="fa fa-image" aria-hidden="true"></i>
                </span>
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              Address
              <div className="input-group my-2">
                <span className="input-group-text bg-mycolor text-light profile-input-icon">
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                </span>
                <textarea
                  name="address"
                  className="form-control"
                  placeholder="Address.."
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <input
                type="submit"
                value={saving ? "Saving..." : "Save"}
                className="btn bg-mycolor"
                disabled={saving}
              />
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          .profile-icon {
            border: 1px solid #ff9800;
            height: 35px;
            width: 35px;
            line-height: 35px;
            text-align: center;
            margin-bottom: 8px;
          }
          .profile-input-icon {
            width: 50px;
            text-align: center;
            height: 45px;
          }
        `}
      </style>
    </>
  );
}

export default MyProfile;
