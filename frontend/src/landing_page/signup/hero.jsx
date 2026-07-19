import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    address: "",
    profilePic: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userData = new FormData();
      userData.append("name", formData.name);
      userData.append("email", formData.email);
      userData.append("mobile", formData.mobile);
      userData.append("password", formData.password);
      userData.append("address", formData.address);
      if (formData.profilePic) {
        userData.append("profilePic", formData.profilePic);
      }

      const { data } = await registerUser(userData);
      alert(data.message || "Registration successful");
      navigate("/signin");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <style>
        {`
          .form-control{
            height:45px;
            margin-bottom:1%;
          }
        `}
      </style>

      <div className="text-center fs-2">
        Register{" "}
        <b className="txt-mycolor">
          <u>With Us</u> <i className="fa fa-user-plus me-1" aria-hidden="true"></i>  
        </b>
        <br />
        <h6>
          You are just one step behind to join the Our Website. I promise you
          to give my best product for you.
        </h6>
      </div>

      <legend>
        <div className="row p-4">
          <div className="col-sm-10 mx-auto">
            <div className="row">
              <div
                className="col-sm-7 mx-auto"
                style={{
                  border: "2px solid red",
                  padding: "10px",
                  borderRadius: "5px",
                  background:
                    "linear-gradient(60deg,#ffea00e6,#cc0041,#77cc00)",
                }}
              >
                <form onSubmit={handleSubmit}>
                  Name
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </span>

                    <input
                      type="text"
                      required
                      name="name"
                      placeholder="Name.."
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  Email
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
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
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                      <i className="fa fa-phone-square " aria-hidden="true"></i>
                    </span>

                    <input
                      type="number"
                      required
                      name="mobile"
                      placeholder="Mobile.."
                      className="form-control"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  </div>

                  Password
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                      <i className="fa fa-key " aria-hidden="true"></i>
                    </span>

                    <input
                      type="password"
                      required
                      name="password"
                      placeholder="Password.."
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  Profile Picture
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                      <i className="fa fa-image" aria-hidden="true"></i>
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      name="profilePic"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>

                  Address
                  <div className="input-group my-2">
                    <span
                      className="input-group-text bg-mycolor text-light"
                      style={{
                        width: "50px",
                        textAlign: "center",
                        height: "45px",
                      }}
                    >
                       <i className="fa fa-map-marker" aria-hidden="true"></i>
                    </span>

                    <textarea
                      className="form-control"
                      name="address"
                      placeholder="Address.."
                      value={formData.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <input
                    type="submit"
                    value={loading ? "Saving..." : "Save"}
                    className="btn bg-mycolor"
                    disabled={loading}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </legend>
    </>
  );
}

export default Signup;
