import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { DASHBOARD_URL } from "../../config";

function Hero() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("bigmall_ai_chat_history");
      localStorage.removeItem("bigmall_ai_chat_guest");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("bigmall_ai_chat_user_")) {
          localStorage.removeItem(key);
        }
      });
      window.dispatchEvent(new Event("storage"));
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

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
        formData.email.trim(),
        formData.password
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));

      alert(data.message || "Login Successful");

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");

      if (redirect === "dashboard") {
        window.location.href = `${DASHBOARD_URL}/myprofile?token=${encodeURIComponent(data.token)}`;
      } else if (redirect && redirect.startsWith("/")) {
        navigate(redirect);
      } else {
        // Return to store so authenticated user can enjoy personalized shopping and AI features
        navigate("/");
      }

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
              <b style={{ fontSize: "25px" }}>Welcome to Big Mall</b>

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
                disabled={loading}
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
