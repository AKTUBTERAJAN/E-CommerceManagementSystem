import React from "react";
import { useState } from "react";
import { loginUser } from "../../api/auth";

function Hero() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const { data } = await loginUser(
      formData.email,
      formData.password
    );

    // Login Project (5173) me save
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert(data.message || "Login Successful");

    // Frontend (5174) par token ke saath redirect
    window.location.href =
      `http://localhost:5174/myprofile?token=${encodeURIComponent(data.token)}`;

  } catch (error) {
    alert(
      error.response?.data?.message ||
      error.message ||
      "Login Failed"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <>
        <div className="container">

      <style>{`
        .form-control{
          height:45px;
          margin-bottom:1%;
        }
      `}</style>

      <div className="text-center fs-2 mt-4">
        <b className="txt-mycolor">
          <u>Sign In</u>{" "}
          <i className="fa fa-sign-in me-1" aria-hidden="true"></i>
        </b>
      </div>

      <div className="row p-4">

        <div
          className="col-lg-5 col-md-7 col-sm-10 mx-auto"
          style={{
            padding: "60px",
            borderRadius: "10px",
            backgroundColor: "rgb(211,246,246)",
            textAlign: "center",
          }}
        >
          <form onSubmit={handleSubmit}>

            <b style={{fontSize:"25px"}}>Welcome to Big Mall</b>

            <h6 className="mb-4">
              Login to Your Online Site
            </h6>

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
                type="email"
                name="email"
                placeholder="Username..."
                className="form-control"
                required
                value={formData.email}
                onChange={handleChange}
              />

            </div>

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
                name="password"
                placeholder="Password..."
                className="form-control"
                required
                value={formData.password}
                onChange={handleChange}
              />

            </div>

            <button
              type="submit"
              className="btn bg-mycolor mt-3 w-100"
              style={{ borderRadius: "20px" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        </div>

      </div>

    </div>
    </>
  );
}

export default Hero;
